import type { IncomingMessage, ServerResponse } from 'node:http'

import { DraftUnavailableError } from './draft.ts'
import { send } from './handler.ts'
import { addLead, backend, listLeads, patchLead, type StoredLead } from './store.ts'
import {
  checkCredentials,
  clearCookie,
  isAuthConfigured,
  issueToken,
  readCookie,
  sessionCookie,
  verifyToken,
} from './session.ts'

/**
 * The API surface beyond /api/draft: submissions, the operator's lead list,
 * the session, and funnel events.
 *
 * Written transport-free, like handler.ts, so the Vite dev middleware, the
 * standalone server and the Vercel Functions all run the same code. The only
 * thing each host does differently is hand over the body, because Vercel's
 * runtime pre-parses it and a raw Node server does not.
 */

const MAX_BODY_BYTES = 32 * 1024

export const API_PATHS = ['/api/submit', '/api/leads', '/api/session', '/api/events'] as const

export function isApiRequest(req: IncomingMessage): boolean {
  const path = (req.url ?? '').split('?')[0]
  return (API_PATHS as readonly string[]).includes(path)
}

export function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString('utf8')
      if (body.length > MAX_BODY_BYTES) {
        reject(new DraftUnavailableError('Body too large'))
        req.destroy()
      }
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

/** Local http has no Secure cookies, so read the scheme the request arrived on. */
function isSecure(req: IncomingMessage): boolean {
  const proto = req.headers['x-forwarded-proto']
  if (typeof proto === 'string') return proto.split(',')[0].trim() === 'https'
  const host = String(req.headers.host ?? '')
  return !host.startsWith('localhost') && !host.startsWith('127.0.0.1')
}

function authed(req: IncomingMessage): boolean {
  return verifyToken(readCookie(req.headers.cookie))
}

function id(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function query(req: IncomingMessage, key: string): string | null {
  const raw = req.url ?? ''
  const at = raw.indexOf('?')
  if (at === -1) return null
  return new URLSearchParams(raw.slice(at + 1)).get(key)
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max).trim() : ''
}

/**
 * Shape a posted lead into something storable.
 *
 * Everything is length-capped and re-derived rather than spread, so a body
 * cannot smuggle in an `id`, a `status`, or any other field the client has no
 * business setting. The intake is public; treat it that way.
 */
function toLead(body: Record<string, unknown>): StoredLead | null {
  const email = str(body.email, 200)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null

  if (body.kind === 'partner') {
    const name = str(body.name, 120)
    const craft = str(body.craft, 300)
    const plugIn = str(body.plugIn, 120)
    if (!name || !craft || !plugIn) return null
    return {
      id: id('lvp'),
      createdAt: Date.now(),
      kind: 'partner',
      status: 'new',
      name,
      craft,
      plugIn,
      email,
    }
  }

  const business = str(body.business, 120)
  const hours = str(body.hours, 40)
  const pains = Array.isArray(body.pains)
    ? body.pains.filter((p): p is string => typeof p === 'string').slice(0, 10)
    : []
  if (!business || !hours || pains.length === 0) return null

  return {
    id: id('lv'),
    createdAt: Date.now(),
    kind: 'plan',
    status: 'new',
    business,
    hours,
    pains,
    email,
    rate: typeof body.rate === 'number' && body.rate > 0 ? Math.min(body.rate, 1000) : 60,
    hoursLo: typeof body.hoursLo === 'number' ? body.hoursLo : 0,
    hoursHi: typeof body.hoursHi === 'number' ? body.hoursHi : 0,
  }
}

/* -------------------------------------------------------------------------- */
/* Handlers                                                                   */
/* -------------------------------------------------------------------------- */

export async function handleSubmit(
  req: IncomingMessage,
  res: ServerResponse,
  body: unknown,
): Promise<void> {
  if (req.method === 'PATCH') {
    // A booking landing after the fact. Public, but it can only ever set a
    // slot and move a lead to contacted — never edit the intake itself.
    const leadId = query(req, 'id')
    const patch = (body ?? {}) as Record<string, unknown>
    if (!leadId) {
      send(res, 400, { error: 'Missing id' })
      return
    }
    const slot = str(patch.bookedSlot, 80)
    const updated = await patchLead(leadId, {
      ...(slot ? { bookedSlot: slot } : {}),
      status: 'contacted',
    })
    send(res, updated ? 200 : 404, updated ? { ok: true } : { error: 'Unknown lead' })
    return
  }

  if (req.method !== 'POST') {
    send(res, 405, { error: 'Use POST' })
    return
  }

  const lead = toLead((body ?? {}) as Record<string, unknown>)
  if (!lead) {
    send(res, 400, { error: 'That submission is missing something required.' })
    return
  }

  await addLead(lead)
  // The client is told which backend took it, so the console can say whether
  // the record is durable rather than assume it.
  send(res, 201, { id: lead.id, storage: backend() })
}

export async function handleLeads(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!isAuthConfigured()) {
    send(res, 503, { error: 'The console is not configured on this deployment.', configured: false })
    return
  }
  if (!authed(req)) {
    send(res, 401, { error: 'Sign in first.' })
    return
  }

  if (req.method === 'GET') {
    send(res, 200, { leads: await listLeads(), storage: backend() })
    return
  }

  send(res, 405, { error: 'Use GET' })
}

export async function handleLeadPatch(
  req: IncomingMessage,
  res: ServerResponse,
  body: unknown,
): Promise<void> {
  if (!authed(req)) {
    send(res, 401, { error: 'Sign in first.' })
    return
  }
  const leadId = query(req, 'id')
  if (!leadId) {
    send(res, 400, { error: 'Missing id' })
    return
  }
  const patch = (body ?? {}) as Record<string, unknown>
  const status = patch.status
  if (status !== 'new' && status !== 'contacted' && status !== 'archived') {
    send(res, 400, { error: 'Unknown status' })
    return
  }
  const updated = await patchLead(leadId, { status })
  send(res, updated ? 200 : 404, updated ? { lead: updated } : { error: 'Unknown lead' })
}

export function handleSession(
  req: IncomingMessage,
  res: ServerResponse,
  body: unknown,
): void {
  const secure = isSecure(req)

  if (req.method === 'GET') {
    send(res, 200, { signedIn: authed(req), configured: isAuthConfigured() })
    return
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearCookie(secure))
    send(res, 200, { signedIn: false })
    return
  }

  if (req.method !== 'POST') {
    send(res, 405, { error: 'Use POST' })
    return
  }

  if (!isAuthConfigured()) {
    send(res, 503, {
      error:
        'No operator credential is set on this deployment. Set OPERATOR_USER and OPERATOR_PASSWORD.',
      configured: false,
    })
    return
  }

  const creds = (body ?? {}) as Record<string, unknown>
  if (!checkCredentials(creds.user, creds.password)) {
    // One message for both wrong-user and wrong-password: which half was wrong
    // is not the signer's business.
    send(res, 401, { error: 'That did not match.' })
    return
  }

  res.setHeader('Set-Cookie', sessionCookie(issueToken(), secure))
  send(res, 200, { signedIn: true })
}

/**
 * Funnel events.
 *
 * Deliberately thin: the numbers REQUIREMENTS.md §5 asks for are counts, and a
 * count needs a log line, not a pipeline. They go to the platform log where
 * they can be queried or shipped onward, and the endpoint always answers 204
 * so a blocked or failed beacon can never affect the page that sent it.
 */
export function handleEvents(res: ServerResponse, body: unknown): void {
  const payload = (body ?? {}) as Record<string, unknown>
  const event = str(payload.event, 60)
  if (event) {
    console.log(
      JSON.stringify({
        at: new Date().toISOString(),
        metric: 'funnel',
        event,
        visit: str(payload.visit, 80),
        path: str(payload.path, 200),
        detail: payload.detail ?? {},
      }),
    )
  }
  res.statusCode = 204
  res.end()
}

/** Route one API request. Shared by every host. */
export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  body: unknown,
): Promise<void> {
  const path = (req.url ?? '').split('?')[0]

  try {
    if (path === '/api/submit') return await handleSubmit(req, res, body)
    if (path === '/api/session') return handleSession(req, res, body)
    if (path === '/api/events') return handleEvents(res, body)
    if (path === '/api/leads') {
      if (req.method === 'PATCH') return await handleLeadPatch(req, res, body)
      return await handleLeads(req, res)
    }
    send(res, 404, { error: 'Not found' })
  } catch (error) {
    if (error instanceof SyntaxError) {
      send(res, 400, { error: 'Body must be valid JSON' })
      return
    }
    console.error('API error', error)
    send(res, 500, { error: 'Something went wrong on our side.' })
  }
}

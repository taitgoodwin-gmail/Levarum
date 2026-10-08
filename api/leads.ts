import type { IncomingMessage, ServerResponse } from 'node:http'
import { createHash, randomUUID } from 'node:crypto'
import { put } from '@vercel/blob'
import { LeadInputError, leadPath, parseLead, type Lead } from '../server/leads.ts'

const MAX_BYTES = 8 * 1024

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}
async function readBody(req: IncomingMessage & { body?: unknown }) {
  if (req.body !== undefined) {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    if (Buffer.byteLength(raw) > MAX_BYTES) throw new LeadInputError('Request too large')
    return JSON.parse(raw)
  }
  let size = 0
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    size += buffer.length
    if (size > MAX_BYTES) throw new LeadInputError('Request too large')
    chunks.push(buffer)
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

async function notify(lead: Lead) {
  if (!process.env.RESEND_API_KEY || !process.env.LEAD_EMAIL_FROM) return
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', signal: AbortSignal.timeout(5000),
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': leadPath(lead) },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM, to: ['hello@levarum.com'], reply_to: lead.email,
      subject: lead.intent === 'call' ? 'Levarum: new call request' : 'Levarum: new Game Plan intake',
      text: `Email: ${lead.email}\nBusiness: ${lead.business}\nHours: ${lead.hours}\nChallenges: ${lead.pains.join(', ')}\nPreferences: ${lead.preferences || 'Not supplied'}\nReference: ${lead.requestId}`,
    }),
  })
  if (!response.ok) throw new Error('Notification failed')
}

type LeadDependencies = {
  configured: () => boolean
  save: (lead: Lead) => Promise<void>
  notify: (lead: Lead) => Promise<void>
}
const defaults: LeadDependencies = {
  configured: () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID),
  save: async lead => {
    await put(leadPath(lead), JSON.stringify({ ...lead, receivedAt: new Date().toISOString(), privacyVersion: '2026-09-29' }), {
      access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true,
      abortSignal: AbortSignal.timeout(12000),
    })
  },
  notify,
}
export function createLeadHandler(deps: LeadDependencies = defaults) {
 const buckets = new Map<string, { count: number; until: number }>()
 return async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  const trace = randomUUID()
  res.setHeader('X-Levarum-Request', trace)
  const record = (event: string, reference?: string) => console.info(JSON.stringify({ event, trace, ...(reference ? { reference } : {}) }))
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); record('method_rejected'); return send(res, 405, { error: 'Use POST', code: 'method_rejected' }) }
  if (!req.headers['content-type']?.startsWith('application/json')) { record('media_rejected'); return send(res, 415, { error: 'Use application/json', code: 'media_rejected' }) }
  const origin = req.headers.origin
  if (origin) {
    try { if (new URL(origin).host !== req.headers.host) { record('origin_rejected'); return send(res, 403, { error: 'Origin not allowed', code: 'origin_rejected' }) } }
    catch { record('origin_rejected'); return send(res, 403, { error: 'Origin not allowed', code: 'origin_rejected' }) }
  }
  // Best-effort per-instance throttle; configure a platform-wide rule before scaling traffic.
  const now = Date.now()
  for (const [key, bucket] of buckets) if (bucket.until <= now) buckets.delete(key)
  const ip = req.headers['x-vercel-forwarded-for'] ?? req.socket.remoteAddress ?? 'unknown'
  const key = createHash('sha256').update(String(ip)).digest('hex')
  const bucket = buckets.get(key) ?? { count: 0, until: now + 60000 }
  if (++bucket.count > 10) { res.setHeader('Retry-After', '60'); record('throttled'); return send(res, 429, { error: 'Please wait a minute', code: 'throttled' }) }
  if (buckets.size < 10000) buckets.set(key, bucket)
  if (!deps.configured()) { record('configuration_unavailable'); return send(res, 503, { error: 'Intake is temporarily unavailable', code: 'configuration_unavailable' }) }
  try {
    const lead = parseLead(await readBody(req))
    await deps.save(lead)
    // Storage is the source of truth. Notification failure must never discard the lead.
    try { await deps.notify(lead) } catch { record('notification_failed', lead.requestId) }
    record('saved', lead.requestId)
    return send(res, 200, { saved: true, reference: lead.requestId })
  } catch (error) {
    if (error instanceof LeadInputError || error instanceof SyntaxError) { record('validation_rejected'); return send(res, 400, { error: 'Please check your intake details', code: 'validation_rejected' }) }
    const timeout = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')
    record(timeout ? 'storage_timeout' : 'storage_failed')
    return send(res, 503, { error: 'Could not confirm your intake was saved; please retry with the same details', code: timeout ? 'storage_timeout' : 'storage_failed' })
  }
}

}

export default createLeadHandler()

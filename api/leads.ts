import { blobConfigured } from '../server/blob-config.ts'
import { indexLead } from '../server/admin-store.ts'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { createHash } from 'node:crypto'
import { savePrivateRecord } from '../server/private-save.ts'
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

export function leadNotificationText(lead: Lead): string {
  return [
    `Email: ${lead.email}`,
    ...(lead.business !== undefined ? [`Business: ${lead.business}`] : []),
    ...(lead.hours !== undefined ? [`Hours: ${lead.hours}`] : []),
    `Challenges: ${lead.pains.length ? lead.pains.join(', ') : 'No task category selected'}`,
    ...('schemaVersion' in lead && lead.message ? [`Message: ${lead.message}`] : []),
    `Preferences: ${lead.preferences || 'Not supplied'}`,
    `Reference: ${lead.requestId}`,
  ].join('\n')
}
async function notify(lead: Lead) {
  if (!process.env.RESEND_API_KEY || !process.env.LEAD_EMAIL_FROM) return
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', signal: AbortSignal.timeout(5000),
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': leadPath(lead) },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM, to: ['hello@levarum.com'], reply_to: lead.email,
      subject: lead.intent === 'call' ? 'Levarum: new call request' : 'Levarum: new Game Plan intake',
      text: leadNotificationText(lead),
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
  configured: blobConfigured,
  save: async lead => {
    await savePrivateRecord(leadPath(lead), lead, 'schemaVersion' in lead ? '2026-09-30' : '2026-09-29')
    if (process.env.DATABASE_URL) { try { await indexLead(leadPath(lead)) } catch { console.error('Lead saved; dashboard indexing pending reconciliation') } }
  },
  notify,
}
export function createLeadHandler(deps: LeadDependencies = defaults) {
 const buckets = new Map<string, { count: number; until: number }>()
 return async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, { error: 'Use POST' }) }
  if (!req.headers['content-type']?.startsWith('application/json')) return send(res, 415, { error: 'Use application/json' })
  const origin = req.headers.origin
  if (origin) {
    try { if (new URL(origin).host !== req.headers.host) return send(res, 403, { error: 'Origin not allowed' }) }
    catch { return send(res, 403, { error: 'Origin not allowed' }) }
  }
  // Best-effort per-instance throttle; configure a platform-wide rule before scaling traffic.
  const now = Date.now()
  for (const [key, bucket] of buckets) if (bucket.until <= now) buckets.delete(key)
  const ip = req.headers['x-vercel-forwarded-for'] ?? req.socket.remoteAddress ?? 'unknown'
  const key = createHash('sha256').update(String(ip)).digest('hex')
  const bucket = buckets.get(key) ?? { count: 0, until: now + 60000 }
  if (++bucket.count > 10) { res.setHeader('Retry-After', '60'); return send(res, 429, { error: 'Please wait a minute' }) }
  if (buckets.size < 10000) buckets.set(key, bucket)
  if (!deps.configured()) return send(res, 503, { error: 'Intake is temporarily unavailable' })
  try {
    const lead = parseLead(await readBody(req))
    await deps.save(lead)
    // Storage is the source of truth. Notification failure must never discard the lead.
    try { await deps.notify(lead) } catch { console.error('Lead saved; notification failed') }
    return send(res, 200, { saved: true, reference: lead.requestId })
  } catch (error) {
    if (error instanceof LeadInputError || error instanceof SyntaxError) return send(res, 400, { error: 'Please check your intake details' })
    console.error('Lead storage failed')
    return send(res, 503, { error: 'Could not save intake; please retry' })
  }
}

}

export default createLeadHandler()

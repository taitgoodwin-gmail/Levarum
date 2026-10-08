import { createHash } from 'node:crypto'
import { BUSINESS_TYPES, HOURS_BANDS, isPainId } from '../src/domain/pains.ts'
import type { HoursBand, PainId } from '../src/domain/types.ts'

export class LeadInputError extends Error {}
export interface Lead {
  requestId: string
  intent: 'plan' | 'call'
  email: string
  business: string
  hours: HoursBand
  pains: PainId[]
  preferences: string
  sourceRequestId?: string
  consent: true
}
export function parseLead(body: unknown): Lead {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new LeadInputError('Invalid request')
  const b = body as Record<string, unknown>
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new LeadInputError('A valid email is required')
  if (typeof b.requestId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(b.requestId)) throw new LeadInputError('Invalid request ID')
  if (b.intent !== 'plan' && b.intent !== 'call') throw new LeadInputError('Invalid intent')
  if (typeof b.business !== 'string' || !BUSINESS_TYPES.some(v => v === b.business)) throw new LeadInputError('Select a business type')
  if (!HOURS_BANDS.includes(b.hours as HoursBand)) throw new LeadInputError('Select weekly hours')
  if (!Array.isArray(b.pains) || b.pains.length < 1 || b.pains.length > 5 || !b.pains.every(isPainId)) throw new LeadInputError('Select one to five known challenges')
  if (b.consent !== true) throw new LeadInputError('Consent is required')
  if (b.website) throw new LeadInputError('Invalid request')
  if (typeof b.preferences !== 'string' || b.preferences.length > 500) throw new LeadInputError('Preferences must be 500 characters or less')
  if (b.sourceRequestId !== undefined && (b.intent !== 'call' || typeof b.sourceRequestId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(b.sourceRequestId))) throw new LeadInputError('Invalid source request')
  return { requestId: b.requestId, intent: b.intent, email, business: b.business, hours: b.hours as HoursBand, pains: [...new Set(b.pains as PainId[])].sort(), preferences: b.intent === 'call' ? b.preferences.trim() : '', consent: true, ...(b.sourceRequestId ? {sourceRequestId:b.sourceRequestId as string} : {}) }
}

// The digest prevents the same request ID being used to overwrite a different lead.
// No email address or other personal data appears in object paths.
export function leadPath(lead: Lead): string {
  const digest = createHash('sha256').update(JSON.stringify(lead)).digest('hex')
  return `leads/${lead.intent}/${lead.requestId}-${digest}.json`
}

import { createHash } from 'node:crypto'
import { BUSINESS_TYPES, HOURS_BANDS, isPainId } from '../src/domain/pains.ts'
import type { HoursBand, PainId } from '../src/domain/types.ts'
import { WORKLOADS, type Workload } from '../src/domain/intake.ts'

export class LeadInputError extends Error {}
export interface LegacyLead {
  requestId: string
  intent: 'plan' | 'call'
  email: string
  business: string
  hours: HoursBand
  pains: PainId[]
  preferences: string
  consent: true
}
export interface IntakeLead extends Omit<LegacyLead, 'hours'> {
  schemaVersion: 3
  workload: Workload
}
export type Lead = LegacyLead | IntakeLead
export function parseLead(body: unknown): Lead {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new LeadInputError('Invalid request')
  const b = body as Record<string, unknown>
  const versioned = Object.prototype.hasOwnProperty.call(b, 'schemaVersion')
  if (versioned && b.schemaVersion !== 3) throw new LeadInputError('Unsupported schema version')
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new LeadInputError('A valid email is required')
  if (typeof b.requestId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(b.requestId)) throw new LeadInputError('Invalid request ID')
  if (b.intent !== 'plan' && b.intent !== 'call') throw new LeadInputError('Invalid intent')
  if (typeof b.business !== 'string' || !BUSINESS_TYPES.some(v => v === b.business)) throw new LeadInputError('Select a business type')
  if (versioned) {
    if (!WORKLOADS.includes(b.workload as Workload)) throw new LeadInputError('Select weekly workload')
    if (Object.prototype.hasOwnProperty.call(b, 'hours')) throw new LeadInputError('Qualitative workload must not be represented as numeric hours')
  } else if (!HOURS_BANDS.includes(b.hours as HoursBand)) throw new LeadInputError('Select weekly hours')
  if (!Array.isArray(b.pains) || b.pains.length < 1 || b.pains.length > 5 || !b.pains.every(isPainId)) throw new LeadInputError('Select one to five known challenges')
  if (b.consent !== true) throw new LeadInputError('Consent is required')
  if (b.website) throw new LeadInputError('Invalid request')
  if (typeof b.preferences !== 'string' || b.preferences.length > 500) throw new LeadInputError('Preferences must be 500 characters or less')
  // Preserve legacy insertion order: existing content-addressed keys depend on it.
  if (!versioned) return { requestId: b.requestId, intent: b.intent, email, business: b.business, hours: b.hours as HoursBand, pains: [...new Set(b.pains as PainId[])].sort(), preferences: b.intent === 'call' ? b.preferences.trim() : '', consent: true }
  return { schemaVersion: 3, requestId: b.requestId, intent: b.intent, email, business: b.business, workload: b.workload as Workload, pains: [...new Set(b.pains as PainId[])].sort(), preferences: b.intent === 'call' ? b.preferences.trim() : '', consent: true }
}

// The digest prevents the same request ID being used to overwrite a different lead.
// No email address or other personal data appears in object paths.
export function leadPath(lead: Lead): string {
  const digest = createHash('sha256').update(JSON.stringify(lead)).digest('hex')
  return `leads/${lead.intent}/${lead.requestId}-${digest}.json`
}

import type { HoursBand, Pain, PainId } from './types.ts'

export const BUSINESS_TYPES = [
  'Home services (plumbing, HVAC, electrical)',
  'Trades and contracting',
  'Health and wellness clinic',
  'Professional services (legal, accounting)',
  'Retail or online shop',
  'Hospitality or food',
  'Something else',
] as const

export const HOURS_BANDS: HoursBand[] = ['Under 5', '5 to 15', '15 to 30', '30 plus']

/**
 * The five things a small-business owner recognises about their own week.
 * `opp` is the only field that ever crosses to the prospect surface; `block`,
 * `measure`, `discovery` and `watchout` are operator vocabulary.
 */
export const PAINS: Pain[] = [
  {
    id: 'questions',
    label: 'Answering the same questions over and over',
    short: 'Repeat questions',
    opp: 'Stop re-answering the same customer questions',
    block: 'Shared answer library',
    measure: 'Hours a week spent on repeat questions',
    discovery: 'Which questions actually repeat, and who answers them today?',
    watchout: 'Answer library goes stale without a named owner',
    lo: 3,
    hi: 4,
  },
  {
    id: 'invoices',
    label: 'Chasing invoices and payments',
    short: 'Invoice chasing',
    opp: 'Get invoices out and followed up without you',
    block: 'Invoice automation',
    measure: 'Days from invoice sent to invoice paid',
    discovery: 'Where do invoices live, and what triggers a chase today?',
    watchout: 'Invoice tooling may be locked to their accountant',
    lo: 2,
    hi: 3,
  },
  {
    id: 'copying',
    label: 'Copying details between tools by hand',
    short: 'Manual copying',
    opp: 'Stop copying the same details between tools',
    block: 'Field sync between tools',
    measure: 'Manual re-entries a week across tools',
    discovery: 'Which two tools get double-entered the most?',
    watchout: 'A legacy tool may have no API to sync against',
    lo: 1,
    hi: 2,
  },
  {
    id: 'booking',
    label: 'Booking people in and sending reminders',
    short: 'Booking & reminders',
    opp: 'Hand off booking and reminders',
    block: 'Booking and reminders',
    measure: 'No-shows a week, before and after reminders',
    discovery: 'Who owns the calendar, and what cannot be automated?',
    watchout: 'Reminders annoy customers if over-sent',
    lo: 4,
    hi: 6,
  },
  {
    id: 'leads',
    label: 'Following up with new leads',
    short: 'Lead follow-up',
    opp: 'Follow up with new leads automatically',
    block: 'Lead follow-up flow',
    measure: 'Time from new lead to first reply',
    discovery: 'Where do new leads land today, and who sees them?',
    watchout: 'Automated follow-up must not read as robotic',
    lo: 2,
    hi: 3,
  },
]

export const PAIN_BY_ID: Record<PainId, Pain> = PAINS.reduce(
  (acc, p) => {
    acc[p.id] = p
    return acc
  },
  {} as Record<PainId, Pain>,
)

/** Selected pains, in the canonical order rather than the order they were tapped. */
export function painsFrom(ids: PainId[]): Pain[] {
  return PAINS.filter((p) => ids.includes(p.id))
}

/** Never let an empty selection produce an empty plan. */
export function painsOrDefault(ids: PainId[]): Pain[] {
  const sel = painsFrom(ids)
  return sel.length ? sel : [PAINS[0]]
}

export function isPainId(value: unknown): value is PainId {
  return typeof value === 'string' && PAINS.some((p) => p.id === value)
}

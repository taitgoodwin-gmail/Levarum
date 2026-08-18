import type { PainId } from '../../domain/types'

/**
 * The five jobs, ranked by hours given back.
 *
 * On naming tools here: this file is one of two on the prospect surface
 * allowed to, and the allowance is deliberate and enforced by
 * scripts/check-boundary.mjs rather than left to reviewer memory. Naming
 * familiar tools is an owner decision recorded in REQUIREMENTS.md §5 — for a
 * skeptical trades audience, "built on tools you already pay for and can
 * cancel" is the reassurance that makes the offer concrete, and it is the same
 * argument as "you keep the keys".
 *
 * What still never crosses is the wiring: which trigger fires which step in
 * which order, and anything resembling a configuration. That is the work being
 * paid for. A tool name is a receipt; the recipe is the product.
 */
export interface Automation {
  /** 01–05. The rank is content, not presentation: it is the reading order. */
  rank: string
  painId: PainId
  name: string
  /** Prospect-facing outcome, in the owner's terms. */
  summary: string
  todayLabel: string
  today: string
  setUpLabel: string
  setUp: string
  /** Familiar tools, named. Never the order they run in. */
  tools: string[]
  /** Hours a week given back, on the shared bar scale. */
  hours: number
  build: string
  /** The lead card gets the full treatment; the rest step down. */
  weight: 'lead' | 'major' | 'quiet'
}

export const AUTOMATIONS: Automation[] = [
  {
    rank: '01',
    painId: 'invoices',
    name: 'Invoice automation',
    summary:
      'Invoices go out when the job is done and get politely chased at 7, 14 and 21 days without you touching it. It pays for itself first and nothing else depends on it.',
    todayLabel: 'A bathroom fitter today',
    today:
      'Job done Friday, invoice typed Sunday at the kitchen table, nobody chases it, paid six weeks later.',
    setUpLabel: 'The same week, set up',
    setUp:
      'He taps the job done on the way to the van. Invoice out that minute, reminders at one week, two and three. Sunday stays Sunday.',
    tools: ['QuickBooks', 'Stripe', 'Zapier'],
    hours: 4,
    build: 'Built in 2 to 3 days',
    weight: 'lead',
  },
  {
    rank: '02',
    painId: 'booking',
    name: 'Booking and reminders',
    summary:
      'Customers pick a real slot, get a text before it, and no-shows are followed up automatically.',
    todayLabel: 'A roofer today',
    today: 'Hands full on a ridge. The call goes to voicemail and he rings the next roofer on the list.',
    setUpLabel: 'The same call, set up',
    setUp:
      'The missed call texts back with his next free mornings. Thursday at nine is taken before he is off the ladder.',
    tools: ['Cal.com', 'RingCentral', 'Zapier'],
    hours: 3,
    build: 'Built in 2 to 3 days',
    weight: 'major',
  },
  {
    rank: '03',
    painId: 'leads',
    name: 'Lead follow-up flow',
    summary:
      'Every new enquiry gets a first reply in minutes, logged in one place, with the hot ones pushed straight to you.',
    todayLabel: 'A heating firm today',
    today: 'No hot water, form filled at nine at night, seen Tuesday. She had someone in on Monday.',
    setUpLabel: 'The same enquiry, set up',
    setUp:
      'Answered in two minutes with his prices and his first free slot. Urgent ones buzz his phone; the rest wait for morning.',
    tools: ['Claude', 'HubSpot', 'Zapier'],
    hours: 3,
    build: 'Built in about 3 days',
    weight: 'major',
  },
  {
    rank: '04',
    painId: 'questions',
    name: 'Shared answer library',
    summary:
      'The same fifteen questions get answered from your own words, with a one-tap human OK before anything sends.',
    todayLabel: 'Today',
    today: '“Do you cover Riverside?” typed with one thumb, forty times a week.',
    setUpLabel: 'Set up',
    setUp: 'Drafted in your words; you read it and tap send.',
    tools: ['Claude', 'Gmail', 'Zapier'],
    hours: 2,
    build: 'Built in 2 to 3 days',
    weight: 'quiet',
  },
  {
    rank: '05',
    painId: 'copying',
    name: 'Field sync between tools',
    summary:
      'A detail entered once appears everywhere it is needed, both ways, and retries itself when something fails.',
    todayLabel: 'Today',
    today:
      'A new address typed into the quote, the diary and the invoice — and once, wrong, so the van went to the old house.',
    setUpLabel: 'Set up',
    setUp: 'Typed once, lands everywhere.',
    tools: ['Zapier', 'Make'],
    hours: 2,
    build: 'Built in 1 to 2 days',
    weight: 'quiet',
  },
]

/** The promises that follow the five cards. Nothing here is a tool. */
export const KEYS_PROMISES = [
  'Built in your accounts, under your logins',
  'A human OK before anything customer-facing sends',
  'Written down in plain language, so anyone can run it',
  'Two weeks of fixes after handover, included',
  'Built and handed over remotely, anywhere in the country — no site visit, nothing to host',
]

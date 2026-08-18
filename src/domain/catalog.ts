import type { CatalogEntry, PainId, StackItem, WorkflowOption } from './types'
import { PAIN_BY_ID } from './pains'

/**
 * Real-world solution catalog. Operator-only: not one of these names may
 * appear on the prospect surface. Each pain maps to two buildable recipes so
 * the operator has something to choose between on the call.
 */
export const CATALOG: Record<PainId, CatalogEntry> = {
  questions: {
    capability: 'Shared answer library',
    options: [
      {
        id: 'q-ai',
        name: 'AI answer assistant',
        trigger: 'A customer sends a question',
        steps: [
          { tool: 'Claude', action: 'drafts a reply from your saved FAQ and past answers' },
          { tool: 'Zapier', action: 'routes it to email or SMS for a one-tap human OK' },
        ],
        tools: ['Claude', 'Zapier', 'Gmail'],
        effort: '2 to 3 days',
        cost: '$40 to $90 / mo',
        dLo: 2,
        dHi: 3,
        cLo: 40,
        cHi: 90,
      },
      {
        id: 'q-help',
        name: 'Self-serve help center',
        trigger: 'A customer lands on your site',
        steps: [
          { tool: 'Notion', action: 'holds a searchable, always-current FAQ' },
          { tool: 'Intercom', action: 'suggests the right article before they contact you' },
        ],
        tools: ['Intercom', 'Notion'],
        effort: '2 days',
        cost: '$59 to $99 / mo',
        dLo: 2,
        dHi: 2,
        cLo: 59,
        cHi: 99,
      },
    ],
  },
  invoices: {
    capability: 'Invoice automation',
    options: [
      {
        id: 'inv-qb',
        name: 'Auto-invoice and chase',
        trigger: 'A job is marked complete',
        steps: [
          { tool: 'QuickBooks', action: 'issues the invoice automatically' },
          { tool: 'Stripe', action: 'attaches a pay-now link' },
          { tool: 'Zapier', action: 'sends polite reminders at 7, 14 and 21 days' },
        ],
        tools: ['QuickBooks', 'Stripe', 'Zapier'],
        effort: '2 to 3 days',
        cost: '$50 to $80 / mo',
        dLo: 2,
        dHi: 3,
        cLo: 50,
        cHi: 80,
      },
      {
        id: 'inv-sms',
        name: 'Pay-link and text nudge',
        trigger: 'An invoice is created',
        steps: [
          { tool: 'Stripe', action: 'creates a payment link' },
          { tool: 'RingCentral', action: 'texts the link and gentle reminders until paid' },
        ],
        tools: ['Stripe', 'RingCentral', 'Zapier'],
        effort: '2 days',
        cost: '$45 to $70 / mo',
        dLo: 2,
        dHi: 2,
        cLo: 45,
        cHi: 70,
      },
    ],
  },
  copying: {
    capability: 'Field sync between tools',
    options: [
      {
        id: 'cp-zap',
        name: 'No-code field sync',
        trigger: 'A record is created in the first tool',
        steps: [
          {
            tool: 'Zapier',
            action: 'maps the fields and creates the matching record in the second tool',
          },
        ],
        tools: ['Zapier'],
        effort: '1 to 2 days',
        cost: '$30 to $50 / mo',
        dLo: 1,
        dHi: 2,
        cLo: 30,
        cHi: 50,
      },
      {
        id: 'cp-make',
        name: 'Two-way sync with error handling',
        trigger: 'A record changes in either tool',
        steps: [
          {
            tool: 'Make',
            action: 'runs a branching scenario that syncs both ways and retries on failure',
          },
        ],
        tools: ['Make'],
        effort: '2 days',
        cost: '$29 to $60 / mo',
        dLo: 2,
        dHi: 2,
        cLo: 29,
        cHi: 60,
      },
    ],
  },
  booking: {
    capability: 'Booking and reminders',
    options: [
      {
        id: 'bk-cal',
        name: 'Self-scheduling with SMS reminders',
        trigger: 'A customer books a slot',
        steps: [
          { tool: 'Cal.com', action: 'takes the booking and holds the slot' },
          { tool: 'RingCentral', action: 'texts reminders 24h and 1h before' },
          { tool: 'Zapier', action: 'follows up automatically on any no-show' },
        ],
        tools: ['Cal.com', 'RingCentral', 'Zapier'],
        effort: '2 to 3 days',
        cost: '$45 to $75 / mo',
        dLo: 2,
        dHi: 3,
        cLo: 45,
        cHi: 75,
      },
      {
        id: 'bk-cly',
        name: 'Calendly with text reminders',
        trigger: 'A customer picks a time',
        steps: [
          { tool: 'Calendly', action: 'handles scheduling and calendar sync' },
          { tool: 'Twilio', action: 'sends reminder texts on your number' },
          { tool: 'Google Calendar', action: 'keeps the whole team in sync' },
        ],
        tools: ['Calendly', 'Twilio', 'Google Calendar'],
        effort: '2 days',
        cost: '$40 to $65 / mo',
        dLo: 2,
        dHi: 2,
        cLo: 40,
        cHi: 65,
      },
    ],
  },
  leads: {
    capability: 'Lead follow-up flow',
    options: [
      {
        id: 'ld-rc',
        name: 'Instant lead response',
        trigger: 'A new call or web form comes in',
        steps: [
          { tool: 'RingCentral', action: 'captures the call or text and logs it' },
          { tool: 'Claude', action: 'qualifies the lead and drafts a first reply' },
          { tool: 'HubSpot', action: 'logs the lead and starts a nurture sequence' },
        ],
        tools: ['RingCentral', 'Claude', 'HubSpot', 'Zapier'],
        effort: '3 days',
        cost: '$70 to $120 / mo',
        dLo: 3,
        dHi: 3,
        cLo: 70,
        cHi: 120,
      },
      {
        id: 'ld-email',
        name: 'Email nurture with alerts',
        trigger: 'A new lead is added',
        steps: [
          { tool: 'HubSpot', action: 'runs a timed email sequence' },
          { tool: 'Slack', action: 'pings the owner the moment a hot lead replies' },
        ],
        tools: ['HubSpot', 'Slack'],
        effort: '2 days',
        cost: '$50 to $90 / mo',
        dLo: 2,
        dHi: 2,
        cLo: 50,
        cHi: 90,
      },
    ],
  },
}

/** The default pick for a pain: the first option, with a plain rationale. */
export function defaultStackItem(painId: PainId): StackItem {
  const pain = PAIN_BY_ID[painId]
  const entry = CATALOG[painId]
  return {
    painId,
    painShort: pain.short,
    capability: entry.capability,
    optionId: entry.options[0].id,
    why: `Fastest path to lift ${pain.short.toLowerCase()}, on tools they can keep running themselves.`,
  }
}

/** Resolve a stack item to its option, falling back to the first if the id is unknown. */
export function optionFor(item: StackItem): WorkflowOption {
  const entry = CATALOG[item.painId]
  return entry.options.find((o) => o.id === item.optionId) ?? entry.options[0]
}

export function isValidOption(painId: PainId, optionId: string): boolean {
  return CATALOG[painId].options.some((o) => o.id === optionId)
}

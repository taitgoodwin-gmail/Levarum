/** Shared vocabulary for both surfaces. No UI, no storage, no network. */

export type PainId = 'questions' | 'invoices' | 'copying' | 'booking' | 'leads'

export interface Pain {
  id: PainId
  /** Prospect-facing checkbox label. */
  label: string
  /** Short form used in chips and summaries. */
  short: string
  /** Prospect-facing outcome. Never names a tool or a step. */
  opp: string
  /** Internal capability name. */
  block: string
  measure: string
  discovery: string
  watchout: string
  /** Hours a week this pain gives back, low and high. */
  lo: number
  hi: number
  /** Why it is worth fixing first, in the owner's terms. Prospect-facing. */
  why: string
}

export type HoursBand = 'Under 5' | '5 to 15' | '15 to 30' | '30 plus'

/** One step of a named workflow: a real tool doing one real thing. */
export interface WorkflowStep {
  tool: string
  action: string
}

/** A concrete, buildable recipe made of named tools. Operator-only. */
export interface WorkflowOption {
  id: string
  name: string
  trigger: string
  steps: WorkflowStep[]
  tools: string[]
  /** Display strings, kept alongside the numbers they were written from. */
  effort: string
  cost: string
  /** Build days, low and high. */
  dLo: number
  dHi: number
  /** Monthly tooling cost in dollars, low and high. */
  cLo: number
  cHi: number
}

export interface CatalogEntry {
  capability: string
  options: WorkflowOption[]
}

/** The operator's chosen workflow for one named pain. */
export interface StackItem {
  painId: PainId
  painShort: string
  capability: string
  optionId: string
  /** Why this option fits this business. Written by Claude, or a default. */
  why: string
}

export type DraftStatus = 'pending' | 'ready'
/** Where the written parts of the draft came from. */
export type DraftSource = 'ai' | 'fallback' | null

export interface DraftPhase {
  n: number
  title: string
  detail: string
}

export interface Draft {
  /** Hours back a week, summed across named pains. */
  hoursLo: number
  hoursHi: number
  blocks: string[]
  measure: string[]
  discovery: string[]
  watchouts: string[]
  summary: string
  phases: DraftPhase[]
  stack: StackItem[]
  status: DraftStatus
  source: DraftSource
}

export type SubmissionStatus = 'new' | 'contacted' | 'archived'

/** A Game Plan request: someone who ran the intake and unlocked a plan. */
export interface Submission {
  id: string
  createdAt: number
  /** Discriminates the two lead types that share the console inbox. */
  kind: 'plan'
  business: string
  hours: HoursBand
  pains: PainId[]
  email: string
  /** The hourly rate the prospect settled on, for context on the call. */
  rate: number
  status: SubmissionStatus
  bookedSlot?: string
  draft: Draft
}

/**
 * An implementation partner who put their name down.
 *
 * REQUIREMENTS.md §5 asks for a partner lead type in the console inbox rather
 * than a second inbox: one place to work leads, with the kind visible on the
 * row. It carries no draft — there is nothing to generate a plan from, and
 * pretending otherwise would put an empty Game Plan in front of the operator.
 */
export interface PartnerLead {
  id: string
  createdAt: number
  kind: 'partner'
  name: string
  /** What they do, in their words. */
  craft: string
  /** Where they would plug in. */
  plugIn: string
  email: string
  status: SubmissionStatus
}

/** Anything that lands in the console inbox. */
export type Lead = Submission | PartnerLead

export function isPlanSubmission(lead: Lead): lead is Submission {
  return lead.kind === 'plan'
}

export function isPartnerLead(lead: Lead): lead is PartnerLead {
  return lead.kind === 'partner'
}

/** What the drafting endpoint is given. */
export interface DraftRequest {
  business: string
  hours: HoursBand
  pains: PainId[]
}

/** What the drafting endpoint returns. Validated before it is trusted. */
export interface DraftResponse {
  summary: string
  phases: { title: string; detail: string }[]
  picks: { pain: string; option: string; why: string }[]
}

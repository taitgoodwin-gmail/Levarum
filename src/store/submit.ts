import type { Lead, PartnerLead, Submission } from '../domain/types'
import { addSubmission } from './submissions'
import { track } from '../analytics'

/**
 * The submit client.
 *
 * Replaces the prototype's empty formEndpoint. One rule governs the shape of
 * this file: a lead is never lost. The write to the on-device store happens
 * first and unconditionally, then the POST is attempted; if the POST fails the
 * prospect still sees their plan, the record still exists, and the failure is
 * reported honestly rather than swallowed.
 *
 * The server assigns the real id. When it answers, the local record is
 * reconciled to it so a later status change from the console addresses the
 * same lead rather than a local twin.
 */

const ENDPOINT = '/api/submit'
/** Long enough for a cold function, short enough not to strand someone. */
const TIMEOUT_MS = 8000

export type SubmitState = 'idle' | 'sending' | 'sent' | 'failed'

export interface SubmitResult {
  ok: boolean
  /** The server's id when it answered, the local one when it did not. */
  id: string
  error?: string
}

async function post(body: unknown): Promise<{ id?: string }> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`The server replied ${res.status}.`)
    return (await res.json()) as { id?: string }
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Persist a Game Plan request.
 *
 * Called at the moment the email gate is satisfied, which is the moment the
 * record becomes real: it is what the console reads as an inbox, and what the
 * drafting call is keyed on.
 */
export async function submitPlan(submission: Submission): Promise<SubmitResult> {
  addSubmission(submission)

  try {
    const answer = await post({
      kind: 'plan',
      business: submission.business,
      hours: submission.hours,
      pains: submission.pains,
      email: submission.email,
      rate: submission.rate,
      hoursLo: submission.draft.hoursLo,
      hoursHi: submission.draft.hoursHi,
    })
    track('submission', { kind: 'plan' })
    return { ok: true, id: answer.id ?? submission.id }
  } catch (err) {
    return {
      ok: false,
      id: submission.id,
      error: err instanceof Error ? err.message : String(err),
    }
  }
}

export interface PartnerInput {
  name: string
  craft: string
  plugIn: string
  email: string
}

/** Persist a partner lead. Same inbox, different kind. */
export async function submitPartner(input: PartnerInput): Promise<SubmitResult> {
  const local: PartnerLead = {
    id: `lvp-${Date.now().toString(36)}`,
    createdAt: Date.now(),
    kind: 'partner',
    status: 'new',
    ...input,
  }
  addSubmission(local)

  try {
    const answer = await post({ kind: 'partner', ...input })
    track('submission', { kind: 'partner' })
    return { ok: true, id: answer.id ?? local.id }
  } catch (err) {
    return { ok: false, id: local.id, error: err instanceof Error ? err.message : String(err) }
  }
}

/** Tell the server a slot was picked. Best-effort; the local record is already right. */
export async function submitBooking(id: string, slot: string): Promise<void> {
  try {
    await fetch(`${ENDPOINT}?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookedSlot: slot, status: 'contacted' }),
    })
  } catch {
    // The prospect has their confirmation and the lead is on the device. The
    // operator will see the booking on the next successful sync.
  }
}

export type { Lead }

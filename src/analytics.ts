/**
 * Week-one instrumentation.
 *
 * The funnel questions this exists to answer, from REQUIREMENTS.md §5:
 * home→start rate, gate conversion, plan→booking clicks, submissions, and
 * booked calls. Gate conversion in particular is the one that settles the
 * soft-gate argument with data rather than opinion, which is why the gate's
 * two ends are measured server-side in api/submit.ts as well as here — a
 * client-only number would be quietly wrong for anyone running a blocker.
 *
 * Events are beacons: fire-and-forget, never awaited, never blocking a
 * navigation or a render. If the endpoint is down the site does not notice.
 * There is no third-party script, no cookie, and no identifier beyond an
 * anonymous per-visit id, so this needs no consent banner to be honest.
 */

export type FunnelEvent =
  /** A prospect left home for the intake. Numerator of the home→start rate. */
  | 'home_to_start'
  /** The intake reached the email gate. Denominator of gate conversion. */
  | 'gate_view'
  /** An email was accepted at the gate. Numerator of gate conversion. */
  | 'gate_unlock'
  /** The gate was abandoned — the drop-off with no recovery today. */
  | 'gate_abandon'
  /** A plan was revealed. */
  | 'plan_view'
  /** A booking slot was clicked from the plan. */
  | 'plan_to_booking'
  /** A submission was persisted. */
  | 'submission'
  /** A call was booked. */
  | 'booking_confirmed'

const VISIT_KEY = 'levarum.visit.v1'
const ENDPOINT = '/api/events'

/** An anonymous per-visit id, so a funnel can be followed without a person being. */
function visitId(): string {
  try {
    const existing = sessionStorage.getItem(VISIT_KEY)
    if (existing) return existing
    const fresh =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    sessionStorage.setItem(VISIT_KEY, fresh)
    return fresh
  } catch {
    return 'anonymous'
  }
}

export function track(event: FunnelEvent, detail: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return

  const body = JSON.stringify({
    event,
    detail,
    visit: visitId(),
    path: window.location.pathname,
    at: new Date().toISOString(),
  })

  try {
    // sendBeacon survives the page going away, which is the whole point for
    // the last event before a navigation.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))
      return
    }
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
  } catch {
    // Analytics never breaks the page it is measuring.
  }
}

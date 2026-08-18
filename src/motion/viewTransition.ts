import { flushSync } from 'react-dom'
import { prefersReducedMotion } from './useReducedMotion'

type ViewTransition = { finished: Promise<void> }
type StartViewTransition = (cb: () => void) => ViewTransition

function api(): StartViewTransition | null {
  if (typeof document === 'undefined') return null
  const doc = document as Document & { startViewTransition?: StartViewTransition }
  return typeof doc.startViewTransition === 'function' ? doc.startViewTransition.bind(doc) : null
}

/** Whether this browser will actually cross-fade, rather than just apply. */
export function canViewTransition(): boolean {
  return api() !== null && !prefersReducedMotion()
}

/**
 * Run a state change inside a View Transition.
 *
 * This is what makes the three intake questions read as one continuous
 * conversation instead of three pages: the shared elements — the progress
 * track, the card, the heading — are matched across the change by
 * view-transition-name and animate between their two positions, so the step
 * appears to rearrange rather than to be replaced.
 *
 * flushSync is required and not incidental. startViewTransition snapshots the
 * DOM, runs the callback, then snapshots again; React's default batching would
 * schedule the re-render for after the second snapshot, and the transition
 * would capture two identical frames and do nothing.
 *
 * Everywhere the API is missing, or motion is off, the update is applied
 * directly. Same state, same result, no animation — which is the whole
 * fallback.
 */
export function transition(update: () => void): void {
  const start = api()
  if (!start || prefersReducedMotion()) {
    update()
    return
  }
  start(() => flushSync(update))
}

/**
 * The motion layer.
 *
 * Levarum sells automation, so a site that sits still is an argument against
 * the product. Everything here exists to make the page behave like something
 * working: sections arrive as they are reached, hours bars spring to their
 * value with weight, the intake rearranges rather than jumping, and the plan
 * assembles a line at a time while the real drafting call is in flight.
 *
 * Two rules hold across all of it. Nothing fakes capability — a working state
 * is only shown while real work is actually happening. And every piece checks
 * prefers-reduced-motion before its first render and falls back to the
 * finished state instantly, never to a faster animation.
 */
export { prefersReducedMotion, useReducedMotion } from './useReducedMotion'
export { useReveal, type Reveal, type RevealOptions } from './useReveal'
export { useSpring, HOURS_BAR_SPRING, TOTAL_SPRING, type SpringConfig } from './useSpring'
export { transition, canViewTransition } from './viewTransition'

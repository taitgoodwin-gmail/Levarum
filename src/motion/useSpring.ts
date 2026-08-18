import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

export interface SpringConfig {
  /** How hard it is pulled toward the target. Higher is snappier. */
  stiffness?: number
  /** How much the motion is bled off. Higher settles sooner, overshoots less. */
  damping?: number
  /** Heavier mass carries more momentum into the overshoot. */
  mass?: number
  /** Below this distance and velocity, snap to target and stop. */
  rest?: number
}

/** Weight, not easing. Tuned to overshoot once and settle, like a real needle. */
export const HOURS_BAR_SPRING: Required<SpringConfig> = {
  stiffness: 120,
  damping: 17,
  mass: 1,
  rest: 0.01,
}

/** For a running total: firmer, so digits do not wobble on the way up. */
export const TOTAL_SPRING: Required<SpringConfig> = {
  stiffness: 150,
  damping: 22,
  mass: 1,
  rest: 0.02,
}

/**
 * A damped-spring integrator on requestAnimationFrame.
 *
 * The site is selling automation, so the numbers on it should behave like
 * something with mass arriving at a stop rather than a value being tweened. A
 * spring gives that for free: it accelerates, overshoots slightly, and settles.
 * Written here rather than pulled in as a dependency because it is forty lines
 * and the bundle is the thing a prospect on a phone in a van waits for.
 *
 * `active` is the trigger — a bar springs when it is first scrolled to, not on
 * mount, so pass the reveal's `shown` through. Under reduced motion the hook
 * returns the target immediately and never schedules a frame.
 */
export function useSpring(
  target: number,
  active = true,
  config: SpringConfig = HOURS_BAR_SPRING,
): number {
  const { stiffness, damping, mass, rest } = { ...HOURS_BAR_SPRING, ...config }
  const reduced = prefersReducedMotion()

  const [value, setValue] = useState(() => (reduced || !active ? target : 0))
  const position = useRef(reduced ? target : 0)
  const velocity = useRef(0)
  const frame = useRef(0)

  useEffect(() => {
    if (reduced) {
      position.current = target
      velocity.current = 0
      setValue(target)
      return
    }
    if (!active) return

    let last = performance.now()

    const tick = (now: number) => {
      // Clamp the step so a backgrounded tab does not resume with one huge
      // integration step and fling the value off screen.
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now

      const displacement = position.current - target
      const acceleration = (-stiffness * displacement - damping * velocity.current) / mass

      velocity.current += acceleration * dt
      position.current += velocity.current * dt

      if (Math.abs(position.current - target) < rest && Math.abs(velocity.current) < rest) {
        position.current = target
        velocity.current = 0
        setValue(target)
        return
      }

      setValue(position.current)
      frame.current = requestAnimationFrame(tick)
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, active, reduced, stiffness, damping, mass, rest])

  return value
}

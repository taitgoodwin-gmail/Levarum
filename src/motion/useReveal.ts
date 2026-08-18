import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from './useReducedMotion'

export interface RevealOptions {
  /** How much of the element has to be on screen before it counts as arrived. */
  threshold?: number
  /** Pull the trigger line up from the viewport bottom so things arrive early. */
  rootMargin?: string
  /** Stagger index. Multiplied by the step below to offset the transition. */
  index?: number
  /** Milliseconds between staggered siblings. */
  step?: number
}

export interface Reveal {
  ref: (node: HTMLElement | null) => void
  /** True once the element has been seen. Starts true under reduced motion. */
  shown: boolean
  /** Spread onto the element: handles the class, the delay, and nothing else. */
  props: {
    ref: (node: HTMLElement | null) => void
    'data-reveal': '' | undefined
    'data-shown': '' | undefined
    style?: { transitionDelay: string }
  }
}

/**
 * Scroll-driven arrival for one element.
 *
 * A section is hidden until it has been scrolled to, then transitions in. The
 * observer disconnects on the first intersection — this is an arrival, not a
 * scrubbed animation, and re-playing it when someone scrolls back up reads as
 * a bug rather than as polish.
 *
 * Under reduced motion the hook returns shown: true and attaches no data
 * attributes at all, so the element renders finished on its first frame with
 * no transition to interrupt. That is the instant-render fallback: not a
 * shortened animation, no animation.
 */
export function useReveal(options: RevealOptions = {}): Reveal {
  const { threshold = 0.16, rootMargin = '0px 0px -8% 0px', index = 0, step = 70 } = options

  const reduced = prefersReducedMotion()
  const [shown, setShown] = useState(reduced)
  const node = useRef<HTMLElement | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (reduced || shown) return
    // No IntersectionObserver means no way to know when it arrived. Show it
    // rather than leave content invisible forever.
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          setShown(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.current = io
    if (node.current) io.observe(node.current)
    return () => io.disconnect()
  }, [reduced, shown, threshold, rootMargin])

  const ref = (next: HTMLElement | null) => {
    node.current = next
    if (next && observer.current && !shown) observer.current.observe(next)
  }

  return {
    ref,
    shown,
    props: reduced
      ? { ref, 'data-reveal': undefined, 'data-shown': undefined }
      : {
          ref,
          'data-reveal': '',
          'data-shown': shown ? '' : undefined,
          style: { transitionDelay: `${index * step}ms` },
        },
  }
}

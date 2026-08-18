import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Read the setting once, synchronously, outside React.
 *
 * Every piece of motion in this app branches on this before its first render,
 * not after it. The difference matters: a component that renders its hidden
 * start state and then corrects on an effect has already shown someone who
 * asked for no motion a flash of the thing moving.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  try {
    return window.matchMedia(QUERY).matches
  } catch {
    return false
  }
}

/**
 * Follow the setting. It is changeable at runtime on every major platform, and
 * someone who turns it on mid-visit should not have to reload to be believed.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    if (!window.matchMedia) return
    let media: MediaQueryList
    try {
      media = window.matchMedia(QUERY)
    } catch {
      return
    }
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return reduced
}

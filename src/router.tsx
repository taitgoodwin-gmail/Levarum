import { useCallback, useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { transition } from './motion'

/**
 * A router, sized to this site.
 *
 * Nine routes, no nested layouts, no loaders. A dependency for that would be
 * more bundle than behaviour, and the one thing this needs that an off-the-
 * shelf router would fight — running the navigation inside a View Transition —
 * is three lines here.
 */
export const ROUTES = {
  home: '/',
  howItWorks: '/how-it-works',
  whatWeAutomate: '/what-we-automate',
  questions: '/questions',
  start: '/start',
  partners: '/partners',
  operator: '/operator',
} as const

export type Path = string

function normalise(path: string): string {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1)
  return path
}

export function currentPath(): string {
  return typeof window === 'undefined' ? ROUTES.home : normalise(window.location.pathname)
}

/** Follow the address bar, including back and forward. */
export function usePath(): string {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const onPop = () => setPath(currentPath())
    window.addEventListener('popstate', onPop)
    window.addEventListener('lv:navigate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('lv:navigate', onPop)
    }
  }, [])

  return path
}

export interface NavigateOptions {
  /** Replace rather than push. Used for intake steps, which are one screen. */
  replace?: boolean
  /** Skip the scroll reset. The intake keeps its position between steps. */
  keepScroll?: boolean
}

export function navigate(to: string, options: NavigateOptions = {}): void {
  const target = normalise(to)
  if (target === currentPath()) return

  transition(() => {
    if (options.replace) window.history.replaceState(null, '', target)
    else window.history.pushState(null, '', target)
    window.dispatchEvent(new Event('lv:navigate'))
  })

  if (!options.keepScroll) {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  children: ReactNode
}

/**
 * An in-app link that stays a real anchor.
 *
 * Middle-click, cmd-click and "open in new tab" all have to keep working —
 * this is a site people send to a business partner — so the href is real and
 * only a plain left click is intercepted.
 */
export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const handle = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e)
      if (e.defaultPrevented) return
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
      navigate(to)
    },
    [onClick, to],
  )

  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  )
}

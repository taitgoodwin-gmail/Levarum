/**
 * Theme state, shared by the nav toggle on both surfaces.
 *
 * The value is written to <html data-theme> by the boot script in index.html,
 * which runs before first paint — this module never gets to decide the first
 * frame, it only reads what the boot script already decided and changes it
 * afterwards. That split is the flash guard: if the decision lived here, in a
 * module that loads with the JS bundle, there would be a frame of the wrong
 * theme on every cold load.
 */
export type Theme = 'light' | 'dark'

export const THEME_KEY = 'levarum.theme.v1'

const listeners = new Set<(theme: Theme) => void>()

function root(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.documentElement
}

export function readTheme(): Theme {
  return root()?.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

export function setTheme(theme: Theme): void {
  const el = root()
  if (!el) return
  el.setAttribute('data-theme', theme)
  // Kept in step with the attribute so the browser paints the right canvas
  // behind the page — scrollbars and overscroll included.
  el.style.colorScheme = theme
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Private mode. The theme still applies, it just will not survive a reload.
  }
  for (const fn of listeners) fn(theme)
}

export function toggleTheme(): Theme {
  const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
  setTheme(next)
  return next
}

/**
 * Follow the theme, including changes made in another component or, while the
 * device preference is still unset, by the OS.
 */
export function subscribeTheme(fn: (theme: Theme) => void): () => void {
  listeners.add(fn)

  let media: MediaQueryList | null = null
  const onSystem = (e: MediaQueryListEvent) => {
    // An explicit choice on this device outranks the OS. Only follow the OS
    // while the prospect has never touched the toggle.
    let stored: string | null = null
    try {
      stored = localStorage.getItem(THEME_KEY)
    } catch {
      stored = null
    }
    if (stored) return
    const next: Theme = e.matches ? 'dark' : 'light'
    root()?.setAttribute('data-theme', next)
    const el = root()
    if (el) el.style.colorScheme = next
    for (const l of listeners) l(next)
  }

  try {
    media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', onSystem)
  } catch {
    media = null
  }

  return () => {
    listeners.delete(fn)
    media?.removeEventListener('change', onSystem)
  }
}

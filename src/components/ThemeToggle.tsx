import { useEffect, useState } from 'react'
import { readTheme, subscribeTheme, toggleTheme, type Theme } from '../theme'

/**
 * The theme toggle.
 *
 * Lives outside both surfaces because both use it. The boundary check forbids
 * the prospect surface and the console importing each other, and a shared
 * control reaching across would be exactly the kind of coupling that rule
 * exists to catch — so it sits here instead, next to the theme module it
 * drives.
 *
 * Labelled with the theme it switches *to*, which is the convention people
 * read fastest, and announced as a real pressed-state button so a screen
 * reader gets the current theme rather than only the destination.
 *
 * State is seeded from the attribute the boot script already set, so this
 * never disagrees with what is on screen — the toggle follows the theme, it
 * does not own it.
 */
export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(() => readTheme())

  useEffect(() => subscribeTheme(setThemeState), [])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="lv-theme-toggle"
      aria-pressed={theme === 'dark'}
      onClick={() => setThemeState(toggleTheme())}
    >
      <span aria-hidden="true" className="lv-theme-toggle__dot" />
      <span>{next === 'dark' ? 'Dark' : 'Light'}</span>
      <span className="lv-sr-only">
        {theme === 'dark' ? 'Dark theme on. Switch to light.' : 'Light theme on. Switch to dark.'}
      </span>
    </button>
  )
}

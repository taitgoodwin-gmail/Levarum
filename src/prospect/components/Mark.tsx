import { useReducedMotion } from '../../motion'

/**
 * The Levarum mark: a dome lifted clear of its plate.
 *
 * One lever, whole operation — the load is up, the ground is flat. The dome
 * rises once on load, which is the only decorative motion on the site and the
 * one place --lv-spark's ancestor used to live; here it just inherits ink.
 *
 * Which mark ships is an open owner decision (REQUIREMENTS.md §3: mark A, the
 * lifted-ground plate, against mark B). This is mark B, the one currently on
 * every surface, so the choice stays open rather than being made by a port.
 */
export function Mark({ size = 30 }: { size?: number }) {
  const reduced = useReducedMotion()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className="lv-mark"
    >
      <path
        d="M6 44 A26 26 0 0 1 58 44 Z"
        fill="currentColor"
        className={reduced ? undefined : 'lv-mark__dome'}
      />
      <rect x="6" y="52" width="52" height="9" fill="currentColor" />
    </svg>
  )
}

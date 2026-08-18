import { useReveal, useSpring, HOURS_BAR_SPRING } from '../../motion'
import { barWidth } from '../content/scale'

export interface HoursBarProps {
  /** Hours a week, on the shared scale. Four fills the bar. */
  hours: number
  /** The label the bar is measuring. Read by assistive tech, not shown here. */
  label: string
  /** The lead item on a page fills solid; the rest use the quiet fill. */
  emphasis?: 'lead' | 'quiet'
  /** Stagger position within a group of bars. */
  index?: number
}

/**
 * An hours bar, on the site's one shared scale, filling with weight.
 *
 * The spring is the point. A bar that eases to its value looks drawn; a bar
 * that accelerates, overshoots a hair and settles looks like a measurement
 * being taken, which is the argument the page is making. It fires on first
 * view rather than on mount, so a bar below the fold is still worth scrolling
 * to.
 *
 * Under reduced motion useReveal reports shown immediately and useSpring
 * returns the target on its first call, so the bar renders full-width on frame
 * one with no transition attached — the instant-render fallback, not a
 * shortened animation.
 *
 * The bar is decorative markup; the number beside it carries the meaning, so
 * this is aria-hidden and the accessible value lives in the caller's text.
 */
export function HoursBar({ hours, label, emphasis = 'quiet', index = 0 }: HoursBarProps) {
  const reveal = useReveal({ threshold: 0.35, index })
  const width = useSpring(barWidth(hours), reveal.shown, HOURS_BAR_SPRING)

  return (
    <div
      ref={reveal.ref}
      className="lv-meter"
      role="img"
      aria-label={`${label}: about ${hours} hours a week, on a scale where four hours fills the bar.`}
    >
      <div
        className="lv-meter__fill"
        data-emphasis={emphasis}
        style={{ width: `${Math.max(0, width)}%` }}
      />
    </div>
  )
}

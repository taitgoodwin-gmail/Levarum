/**
 * One shared scale for every hours bar on the site.
 *
 * The design's rule, and the reason the bars are worth drawing at all: a bar on
 * the home page, a bar on the automations page and a bar in someone's own
 * Game Plan all mean the same thing. Four hours a week fills one. If a page
 * ever rescales its bars to its own biggest number, the comparison a prospect
 * makes across two pages silently becomes a lie.
 */
export const HOURS_BAR_FULL = 4

/** A bar width in percent for a weekly hours figure, on the shared scale. */
export function barWidth(hours: number): number {
  return Math.max(6, Math.min(100, (hours / HOURS_BAR_FULL) * 100))
}

/** The sentence that has to appear wherever a set of bars does. */
export const SCALE_NOTE = 'Bars are the same scale everywhere on the site. Four hours a week fills one.'

import type { ReactNode } from 'react'
import { useReveal } from '../../motion'

export interface SectionProps {
  children: ReactNode
  /**
   * Which rung of the warm neutral tint ladder this band sits on. This is the
   * page's rhythm: consecutive sections step up and down the ladder so a long
   * page reads as a sequence of rooms rather than one scroll.
   */
  rung?: 1 | 2 | 3 | 4 | 'dark'
  /** Narrow measure, for pages that are mostly prose. */
  prose?: boolean
  /** Hairlines above and below the band. */
  ruled?: boolean
  id?: string
  className?: string
}

/**
 * One band of a page: a rung of the tint ladder, revealed on arrival.
 *
 * The reveal is on the band rather than on every child, so a section arrives
 * as one thing. Cards inside that want their own stagger use useReveal
 * directly with an index.
 */
export function Section({
  children,
  rung = 1,
  prose = false,
  ruled = false,
  id,
  className,
}: SectionProps) {
  const reveal = useReveal()

  return (
    <section
      id={id}
      className={['lv-band', className].filter(Boolean).join(' ')}
      data-rung={rung}
      data-ruled={ruled ? '' : undefined}
      {...reveal.props}
    >
      <div className={prose ? 'lv-wrap lv-wrap--prose' : 'lv-wrap'}>{children}</div>
    </section>
  )
}

/** A petrol eyebrow. Secondary colour, never the accent. */
export function Eyebrow({ children, tone = 'sec' }: { children: ReactNode; tone?: 'sec' | 'quiet' }) {
  return (
    <div className="lv-eyebrow" data-tone={tone}>
      {children}
    </div>
  )
}

/** A child that arrives on its own beat within an already-revealed band. */
export function Rise({
  children,
  index = 0,
  className,
}: {
  children: ReactNode
  index?: number
  className?: string
}) {
  const reveal = useReveal({ index })
  return (
    <div className={className} {...reveal.props}>
      {children}
    </div>
  )
}

import { Link, ROUTES } from '../../router'
import { track } from '../../analytics'
import { NAV } from '../content/site'
import { Mark } from './Mark'
import { ThemeToggle } from '../../components/ThemeToggle'

/**
 * The primary nav.
 *
 * The only rust on it is the Start button and the underline beneath the
 * current page — commit action, active nav, and nothing else, which is the
 * whole accent budget for the header. Every other link is quiet ink until
 * hovered, when it goes petrol.
 *
 * `hideStart` exists for /start itself: the design's one-commit-action-per-
 * viewport rule would otherwise put a rust Start button in the header of the
 * page whose entire job is a rust Next button. It is also the open decision in
 * REQUIREMENTS.md §3 about the home hero, which this does not pre-empt.
 */
export function Nav({ current, hideStart = false }: { current: string; hideStart?: boolean }) {
  return (
    <header className="lv-nav">
      <nav aria-label="Primary" className="lv-nav__inner">
        <Link to={ROUTES.home} className="lv-nav__brand" aria-label="Levarum, home">
          <Mark />
          <span className="lv-nav__wordmark">Levarum</span>
        </Link>

        <div className="lv-nav__links">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="lv-nav__link"
              data-current={current === item.to ? '' : undefined}
              aria-current={current === item.to ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}

          <ThemeToggle />

          {hideStart ? null : (
            <Link
              to={ROUTES.start}
              className="lv-btn lv-btn--sm"
              onClick={() => track('home_to_start', { from: 'nav' })}
            >
              Start
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

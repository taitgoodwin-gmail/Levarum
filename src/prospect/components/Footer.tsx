import { Link, ROUTES } from '../../router'
import { CONTACT_EMAIL, TAGLINE } from '../content/site'
import { Mark } from './Mark'

/**
 * The footer.
 *
 * The console link is the one route out of the prospect surface, and it is
 * here rather than in the nav on purpose: an operator types /operator or finds
 * it at the bottom of a page, a prospect is never one visible tab away from
 * it. It is a plain anchor, not a Link — the console is a different app with
 * its own stylesheet, and a full load is the honest way to enter it.
 */
export function Footer({ current }: { current: string }) {
  const links = [
    { to: ROUTES.home, label: 'Home' },
    { to: ROUTES.howItWorks, label: 'How it works' },
    { to: ROUTES.whatWeAutomate, label: 'What we automate' },
    { to: ROUTES.questions, label: 'Questions' },
    { to: ROUTES.caseStudies, label: 'Case studies' },
  ].filter((l) => l.to !== current)

  return (
    <footer className="lv-foot">
      <div className="lv-foot__inner">
        <div className="lv-foot__brand">
          <Mark size={26} />
          <div>
            <div className="lv-foot__word">Levarum</div>
            <div className="lv-foot__tagline">{TAGLINE}</div>
          </div>
        </div>

        <div className="lv-foot__links">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="lv-foot__link">
              {l.label}
            </Link>
          ))}
          <a className="lv-foot__link" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          {current === ROUTES.partners ? null : (
            <Link to={ROUTES.partners} className="lv-foot__link">
              Partners
            </Link>
          )}
          <a className="lv-foot__link" href={ROUTES.operator}>
            Admin
          </a>
        </div>
      </div>
    </footer>
  )
}

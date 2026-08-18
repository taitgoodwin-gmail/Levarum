import { Link, ROUTES } from '../../router'
import { track } from '../../analytics'
import { Eyebrow, Rise, Section } from '../components/Section'
import { INTERIM, RESERVED_NOTE, RESULTS, type CaseStudy } from '../content/caseStudies'

/**
 * Case studies.
 *
 * The format the owner asked for — scannable cards, each leading with a
 * transformation headline and one concrete metric — built and ready for real
 * results, and populated meanwhile only with things a visitor can verify on
 * this site.
 *
 * The page is written so that the day RESULTS gets its first entry, nothing
 * needs rewriting: real results render above the interim proof, the interim
 * section demotes itself to a subheading, and the reserved slots disappear on
 * their own.
 */

function Card({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <Rise index={index}>
      <article className="lv-card lv-case">
        <div className="lv-case__metric">
          <span className="lv-figure lv-figure--sm">{study.metric}</span>
          <span className="lv-case__metriclabel">{study.metricLabel}</span>
        </div>
        <h3 className="lv-h3">{study.headline}</h3>
        <p className="lv-body">{study.body}</p>
        <p className="lv-case__check">{study.check}</p>
      </article>
    </Rise>
  )
}

export function CaseStudies() {
  const hasResults = RESULTS.length > 0

  return (
    <>
      <Section rung={1} prose>
        <Eyebrow>Case studies</Eyebrow>
        <h1 className="lv-h1">
          {hasResults ? 'What changed, and by how much.' : 'No customer stories yet.'}
        </h1>
        <p className="lv-lead">
          {hasResults
            ? 'Each one is a real business, the hours before and after, and what it cost.'
            : 'Early days. Inventing one would be the fastest way to lose someone who quotes work for a living — so here is what you can check instead, on the site you are standing on.'}
        </p>
      </Section>

      {hasResults ? (
        <Section rung={2} ruled>
          <div className="lv-cases">
            {RESULTS.map((study, i) => (
              <Card key={study.id} study={study} index={i} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section rung={hasResults ? 1 : 2} ruled>
        {hasResults ? (
          <>
            <Eyebrow>Meanwhile</Eyebrow>
            <h2 className="lv-h2">This site runs on what it sells.</h2>
          </>
        ) : (
          <Eyebrow>This site runs on what it sells</Eyebrow>
        )}

        <div className="lv-cases">
          {INTERIM.map((study, i) => (
            <Card key={study.id} study={study} index={i} />
          ))}

          {/* The reserved slots. They go away on their own once RESULTS fills. */}
          {hasResults
            ? null
            : [0, 1].map((n) => (
                <Rise key={`reserved-${n}`} index={INTERIM.length + n}>
                  <article className="lv-card lv-case lv-case--reserved">
                    <Eyebrow tone="quiet">Reserved</Eyebrow>
                    <h3 className="lv-h4">First client results go here</h3>
                    <p className="lv-body">{RESERVED_NOTE}</p>
                  </article>
                </Rise>
              ))}
        </div>
      </Section>

      <Section rung={3} ruled className="lv-cta">
        <h2 className="lv-h2">The fastest way to judge it is to use it.</h2>
        <p className="lv-lead lv-cta__lead">
          Three questions, about ninety seconds. If the plan that comes back is
          worthless, you have learned something true about us before paying anything.
        </p>
        <Link
          to={ROUTES.start}
          className="lv-btn"
          onClick={() => track('home_to_start', { from: 'case_studies' })}
        >
          Build my Game Plan
        </Link>
      </Section>
    </>
  )
}

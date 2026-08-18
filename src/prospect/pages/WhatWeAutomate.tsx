import { Link, ROUTES } from '../../router'
import { track } from '../../analytics'
import { Eyebrow, Rise, Section } from '../components/Section'
import { HoursBar } from '../components/HoursBar'
import { AUTOMATIONS, KEYS_PROMISES } from '../content/automations'
import { SCALE_NOTE } from '../content/scale'

/**
 * What we automate.
 *
 * The objection this page kills: "this is vague AI hand-waving." Five named
 * jobs, ranked 01–05 by hours given back, each told before and after in one
 * owner's week, with the familiar tools named and the build time stated.
 *
 * The ranked rhythm is the page's structure, not its decoration: 01 gets a
 * full card with both sides of the story, 02 and 03 get the same shape at less
 * weight, and 04 and 05 pair up quietly. Anything that leaks two hours a week
 * should not look like anything that leaks four.
 */
export function WhatWeAutomate() {
  const lead = AUTOMATIONS.filter((a) => a.weight === 'lead')
  const major = AUTOMATIONS.filter((a) => a.weight === 'major')
  const quiet = AUTOMATIONS.filter((a) => a.weight === 'quiet')

  return (
    <>
      <Section rung={1} prose>
        <Eyebrow>What we automate</Eyebrow>
        <h1 className="lv-h1">Five jobs that leak the most time.</h1>
        <p className="lv-lead">
          Nothing exotic. Each one runs on tools you can keep going yourself, gets built in days
          rather than months, and is handed over with the logins.
        </p>
      </Section>

      <Section rung={2} ruled>
        <div className="lv-rank-head">
          <Eyebrow>Ranked by hours given back</Eyebrow>
          <p className="lv-meta">{SCALE_NOTE}</p>
        </div>

        {/* 01 — the lead card */}
        {lead.map((a) => (
          <Rise key={a.rank}>
            <article className="lv-card lv-auto lv-auto--lead">
              <header className="lv-auto__head">
                <span className="lv-rank">{a.rank}</span>
                <div>
                  <Eyebrow>Start here</Eyebrow>
                  <h2 className="lv-h3">{a.name}</h2>
                </div>
              </header>

              <p className="lv-lead">{a.summary}</p>

              <div className="lv-ba">
                <div className="lv-ba__col" data-side="before">
                  <span className="lv-ba__label">{a.todayLabel}</span>
                  <p className="lv-ba__text">{a.today}</p>
                </div>
                <div className="lv-ba__col lv-railed" data-side="after">
                  <span className="lv-ba__label">{a.setUpLabel}</span>
                  <p className="lv-ba__text">{a.setUp}</p>
                </div>
              </div>

              <footer className="lv-auto__foot">
                <div className="lv-auto__hours">
                  <span className="lv-ba__label">Typically gives back</span>
                  <div className="lv-figure">
                    {a.hours}
                    <span className="lv-figure__unit">hours a week</span>
                  </div>
                  <HoursBar hours={a.hours} label={a.name} emphasis="lead" />
                </div>
                <div className="lv-auto__meta">
                  <div className="lv-chips">
                    {a.tools.map((t) => (
                      <span key={t} className="lv-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="lv-meta">{a.build}</p>
                </div>
              </footer>
            </article>
          </Rise>
        ))}

        {/* 02 / 03 — the same shape, less weight */}
        <div className="lv-grid lv-grid--2 lv-auto__pair">
          {major.map((a, i) => (
            <Rise key={a.rank} index={i}>
              <article className="lv-card lv-auto">
                <header className="lv-auto__head">
                  <span className="lv-rank">{a.rank}</span>
                  <h2 className="lv-h4">{a.name}</h2>
                </header>

                <p className="lv-body">{a.summary}</p>

                <div className="lv-ba">
                  <div className="lv-ba__col" data-side="before">
                    <span className="lv-ba__label">{a.todayLabel}</span>
                    <p className="lv-ba__text">{a.today}</p>
                  </div>
                  <div className="lv-ba__col lv-railed" data-side="after">
                    <span className="lv-ba__label">{a.setUpLabel}</span>
                    <p className="lv-ba__text">{a.setUp}</p>
                  </div>
                </div>

                <footer className="lv-auto__foot">
                  <div className="lv-auto__hours">
                    <div className="lv-hoursrow">
                      <span className="lv-ba__label">Gives back</span>
                      <span className="lv-figure lv-figure--sm">
                        {a.hours}
                        <span className="lv-figure__unit">h</span>
                      </span>
                    </div>
                    <HoursBar hours={a.hours} label={a.name} />
                  </div>
                  <div className="lv-auto__meta">
                    <div className="lv-chips">
                      {a.tools.map((t) => (
                        <span key={t} className="lv-chip">
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="lv-meta">{a.build}</p>
                  </div>
                </footer>
              </article>
            </Rise>
          ))}
        </div>

        {/* 04 / 05 — the quiet pair */}
        <div className="lv-grid lv-grid--2 lv-auto__pair">
          {quiet.map((a, i) => (
            <Rise key={a.rank} index={i}>
              <article className="lv-card lv-auto lv-auto--quiet">
                <header className="lv-auto__head">
                  <span className="lv-rank">{a.rank}</span>
                  <h2 className="lv-h4">{a.name}</h2>
                </header>

                <p className="lv-body">{a.summary}</p>

                <p className="lv-body">
                  <strong>{a.todayLabel}:</strong> {a.today} <strong>{a.setUpLabel}:</strong>{' '}
                  {a.setUp}
                </p>

                <footer className="lv-auto__foot">
                  <div className="lv-auto__hours">
                    <div className="lv-hoursrow">
                      <span className="lv-ba__label">Gives back</span>
                      <span className="lv-figure lv-figure--sm">
                        {a.hours}
                        <span className="lv-figure__unit">h</span>
                      </span>
                    </div>
                    <HoursBar hours={a.hours} label={a.name} />
                  </div>
                  <p className="lv-meta">
                    {a.tools.join(' · ')} — {a.build.toLowerCase()}
                  </p>
                </footer>
              </article>
            </Rise>
          ))}
        </div>
      </Section>

      {/* SOMETHING ELSE ------------------------------------------------ */}
      <Section rung={1} prose>
        <h2 className="lv-h3">Something else entirely?</h2>
        <p className="lv-lead">
          Your plan is built from your answers, not from this list. If your week goes somewhere
          odd, name it in the intake and I will look at that instead.
        </p>
        <Link
          to={ROUTES.start}
          className="lv-textlink"
          onClick={() => track('home_to_start', { from: 'what_we_automate' })}
        >
          Start the intake →
        </Link>
      </Section>

      {/* YOU KEEP THE KEYS --------------------------------------------- */}
      <Section rung="dark">
        <h2 className="lv-h2">You keep the keys.</h2>
        <p className="lv-lead">
          Everything is built inside your own accounts, on tools you can cancel, with two weeks of
          fixes after handover. Nothing routes through me and nothing stops working if we stop
          working together.
        </p>
        <ul className="lv-list lv-list--arrow lv-keys">
          {KEYS_PROMISES.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </Section>

      <Section rung={2} ruled>
        <div className="lv-grid lv-grid--2">
          <Link to={ROUTES.howItWorks} className="lv-card lv-pagelink">
            <Eyebrow>Before this</Eyebrow>
            <h3 className="lv-h4">How it works</h3>
            <p className="lv-body">Three questions, a plan, one short call.</p>
            <span className="lv-textlink">Read the process →</span>
          </Link>
          <Link to={ROUTES.questions} className="lv-card lv-pagelink">
            <Eyebrow>Next</Eyebrow>
            <h3 className="lv-h4">Questions</h3>
            <p className="lv-body">Cost, time, safety, staff — answered plainly.</p>
            <span className="lv-textlink">Read the answers →</span>
          </Link>
        </div>
      </Section>
    </>
  )
}

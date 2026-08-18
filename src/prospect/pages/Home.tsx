import { useState } from 'react'

import { Link, ROUTES, navigate } from '../../router'
import { BUSINESS_TYPES } from '../../domain/pains'
import { track } from '../../analytics'
import { Eyebrow, Rise, Section } from '../components/Section'
import { HoursBar } from '../components/HoursBar'
import { SCALE_NOTE } from '../content/scale'
import { NO_SHOW_CAVEAT, NO_SHOW_FIGURES, USE_CASES } from '../content/useCases'
import { PROOF } from '../content/site'

/**
 * Home.
 *
 * The objection this page kills: "I do not know what this is or whether it is
 * for me." It answers by showing a week someone recognises — five Tuesday
 * stories, before and after, each ending on the hours it hands back — and by
 * putting the first intake question in the hero so starting costs one tap.
 *
 * One commit action per viewport is doing real work here: the hero CTA is
 * rust, the nav Start is rust, and they are never both on screen at once
 * because the nav is sticky and the hero CTA is below it — which is exactly
 * the tension flagged as an open decision in REQUIREMENTS.md §3. Resolving it
 * properly is the owner's call; this keeps both, as designed, rather than
 * silently dropping one.
 */

/** What the plan preview shows. Illustrative, and labelled as an example. */
const EXAMPLE_PLAN = [
  { title: 'Get invoices out and followed up without you', hours: 4 },
  { title: 'Hand off booking and reminders', hours: 3 },
  { title: 'Stop re-answering the same questions', hours: 2 },
]

export function Home() {
  const [business, setBusiness] = useState<string>(BUSINESS_TYPES[0])

  const start = () => {
    track('home_to_start', { from: 'hero', business })
    navigate(`${ROUTES.start}?business=${encodeURIComponent(business)}`)
  }

  return (
    <>
      {/* HERO ---------------------------------------------------------- */}
      <Section rung={1}>
        <div className="lv-hero">
          <div>
            <div className="lv-pill">
              <span className="lv-pill__dot" aria-hidden="true" />
              Owner-run businesses · anywhere in the US
            </div>

            <h1 className="lv-hero-title">Get your week back.</h1>

            <p className="lv-lead lv-hero__lead">
              Answer three questions about your business and I will show you which jobs are worth
              handing off first, and roughly how many hours a week that gives you back. Plain
              language, no jargon. Everything is remote — the call, the build and the handover —
              wherever you are in the country.
            </p>

            <div className="lv-hero__form">
              <label className="lv-label" htmlFor="home-business">
                What kind of business is this?
              </label>
              <select
                id="home-business"
                className="lv-field"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
              >
                {BUSINESS_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <button type="button" className="lv-btn lv-btn--block" onClick={start}>
                Build my Game Plan
              </button>

              <p className="lv-meta lv-hero__micro">About 90 seconds. No account, no card.</p>
            </div>
          </div>

          {/* The plan preview. Every number on it is the same shared scale as
              the bars in a real plan, so the example is not flattering. */}
          <Rise index={2}>
            <div className="lv-card lv-preview">
              <div className="lv-preview__head">
                <span className="lv-preview__title">A plan looks like this</span>
                <span className="lv-chip">Example</span>
              </div>

              <div className="lv-preview__total">
                <span className="lv-meta">Hand off first</span>
                <div className="lv-figure">
                  9 <span className="lv-figure__unit">hours a week, across three jobs</span>
                </div>
              </div>

              <div className="lv-stack">
                {EXAMPLE_PLAN.map((row, i) => (
                  <div key={row.title} className="lv-preview__row">
                    <div className="lv-hoursrow">
                      <span className="lv-preview__rowtitle">{row.title}</span>
                      <span className="lv-figure lv-figure--sm">
                        {row.hours}
                        <span className="lv-figure__unit">h</span>
                      </span>
                    </div>
                    <HoursBar
                      hours={row.hours}
                      label={row.title}
                      emphasis={i === 0 ? 'lead' : 'quiet'}
                      index={i}
                    />
                  </div>
                ))}
              </div>

              <div className="lv-preview__fix lv-railed">
                <Eyebrow>Fix this first</Eyebrow>
                <div className="lv-h4">Invoice automation</div>
                <p className="lv-body">
                  It pays for itself first and nothing else depends on it.
                </p>
              </div>
            </div>
          </Rise>
        </div>
      </Section>

      {/* PROBLEM ------------------------------------------------------- */}
      <Section rung={2} ruled>
        <h2 className="lv-h2">You did not start this to do admin.</h2>
        <p className="lv-lead">
          Most owner-run businesses lose ten to twenty hours a week to work no customer ever sees.
          It rarely feels like a problem worth solving, because nobody has ever laid it out
          plainly. That is the whole job here.
        </p>

        <div className="lv-grid lv-problem">
          {[
            {
              title: 'The evening shift',
              body: 'The real work happens after hours, because the day went to quotes, chasing and copying details between tools.',
            },
            {
              title: 'Everything in your head',
              body: 'Nothing can be handed to anyone else, so growth means more of your hours and nothing else.',
            },
            {
              title: 'Twelve tabs, no joins',
              body: 'You bought the tools. They do not talk to each other, so you are the integration.',
            },
          ].map((card, i) => (
            <Rise key={card.title} index={i}>
              <div className="lv-card lv-railed">
                <h3 className="lv-h4">{card.title}</h3>
                <p className="lv-body">{card.body}</p>
              </div>
            </Rise>
          ))}
        </div>
      </Section>

      {/* USE CASES ----------------------------------------------------- */}
      <Section rung={1}>
        <Eyebrow>What it looks like on a Tuesday</Eyebrow>
        <h2 className="lv-h2">None of it is clever. It just happens without you.</h2>
        <p className="lv-lead">
          Five weeks out of real service businesses. What happens today on the left, what happens
          once it is set up on the right, and the hours it hands back.
        </p>

        <div className="lv-stack--loose lv-usecases">
          {USE_CASES.map((uc, i) => (
            <Rise key={uc.id} index={i % 2}>
              <article className="lv-card lv-usecase">
                <header className="lv-usecase__head">
                  <span className="lv-usecase__who">{uc.who}</span>
                  <h3 className="lv-h3">{uc.headline}</h3>
                </header>

                <div className="lv-ba">
                  <div className="lv-ba__col" data-side="before">
                    <span className="lv-ba__label">Today</span>
                    <p className="lv-ba__text">{uc.today}</p>
                  </div>
                  <div className="lv-ba__col lv-railed" data-side="after">
                    <span className="lv-ba__label">Once it is set up</span>
                    <p className="lv-ba__text">{uc.automated}</p>
                  </div>
                </div>

                <footer className="lv-usecase__foot">
                  <div className="lv-hoursrow">
                    <span className="lv-ba__label">{uc.metric}</span>
                    <span className="lv-figure lv-figure--sm">
                      {uc.hours}
                      <span className="lv-figure__unit">h</span>
                    </span>
                  </div>
                  <HoursBar hours={uc.hours} label={uc.metric} emphasis={uc.hours >= 4 ? 'lead' : 'quiet'} />
                </footer>
              </article>
            </Rise>
          ))}
        </div>
      </Section>

      {/* CITED FIGURES — a petrol-ink band, never neutral black --------- */}
      <Section rung="dark">
        <Eyebrow>Why the phone matters · published industry figures, not our results</Eyebrow>
        <div className="lv-grid lv-figures">
          {NO_SHOW_FIGURES.map((f, i) => (
            <Rise key={f.figure} index={i}>
              <div className="lv-figures__item">
                <div className="lv-figure lv-figures__num">{f.figure}</div>
                <p className="lv-body">{f.note}</p>
              </div>
            </Rise>
          ))}
        </div>
        <p className="lv-body lv-figures__caveat">{NO_SHOW_CAVEAT}</p>
        <Link to={ROUTES.whatWeAutomate} className="lv-textlink lv-figures__link">
          All five jobs, with a week from each →
        </Link>
        <p className="lv-meta lv-figures__scale">{SCALE_NOTE}</p>
      </Section>

      {/* HONEST PROOF -------------------------------------------------- */}
      <Section rung={2} ruled>
        <Eyebrow>{PROOF.eyebrow}</Eyebrow>
        <h2 className="lv-h2">{PROOF.headline}</h2>
        <p className="lv-lead">{PROOF.lead}</p>

        <div className="lv-grid lv-proof">
          {PROOF.cards.map((card, i) => (
            <Rise key={card.title} index={i}>
              <div className="lv-card lv-railed">
                <h3 className="lv-h4">{card.title}</h3>
                <p className="lv-body">{card.body}</p>
              </div>
            </Rise>
          ))}
          <Rise index={2}>
            <div className="lv-card lv-proof__reserved">
              <Eyebrow tone="quiet">{PROOF.reserved.eyebrow}</Eyebrow>
              <h3 className="lv-h4">{PROOF.reserved.title}</h3>
              <p className="lv-body">{PROOF.reserved.body}</p>
            </div>
          </Rise>
        </div>
      </Section>

      {/* PAGE LINKS ---------------------------------------------------- */}
      <Section rung={1}>
        <div className="lv-grid">
          {[
            {
              to: ROUTES.howItWorks,
              eyebrow: 'How it works',
              title: 'Three questions, a plan, one short call',
              body: 'What I ask, what you get back, and what happens on the fifteen minutes afterwards.',
              cta: 'Read the process →',
            },
            {
              to: ROUTES.whatWeAutomate,
              eyebrow: 'What we automate',
              title: 'Five jobs that leak the most time',
              body: 'Invoicing, booking, lead follow-up, repeat questions and copying between tools.',
              cta: 'See the five →',
            },
            {
              to: ROUTES.questions,
              eyebrow: 'Questions',
              title: 'Cost, time, safety, staff',
              body: 'The seven things owners ask me before they start, answered plainly.',
              cta: 'Read the answers →',
            },
          ].map((card, i) => (
            <Rise key={card.to} index={i}>
              <Link to={card.to} className="lv-card lv-pagelink">
                <Eyebrow>{card.eyebrow}</Eyebrow>
                <h3 className="lv-h4">{card.title}</h3>
                <p className="lv-body">{card.body}</p>
                <span className="lv-textlink">{card.cta}</span>
              </Link>
            </Rise>
          ))}
        </div>
      </Section>

      {/* CTA ----------------------------------------------------------- */}
      <Section rung={3} ruled className="lv-cta">
        <h2 className="lv-h2">Find out what you should stop doing yourself.</h2>
        <p className="lv-lead lv-cta__lead">
          Three questions, about ninety seconds. The plan is yours whether or not we ever speak.
        </p>
        <Link
          to={ROUTES.start}
          className="lv-btn"
          onClick={() => track('home_to_start', { from: 'footer_cta' })}
        >
          Build my Game Plan
        </Link>
        <p className="lv-meta lv-cta__micro">
          Your answers stay on your device until you unlock the plan.
        </p>
      </Section>

      {/* PARTNERS — a quiet path, deliberately not competing with the CTA */}
      <Section rung={1} className="lv-partners-strip">
        <div className="lv-card lv-railed">
          <Eyebrow tone="quiet">Not a business owner · for partners</Eyebrow>
          <h3 className="lv-h4">Build these with me</h3>
          <p className="lv-body">
            If you set up automations for small service businesses, there is paid delivery work
            here and decisions still open. Remote, wherever you are.
          </p>
          <Link to={ROUTES.partners} className="lv-textlink">
            Put your name down →
          </Link>
        </div>
      </Section>
    </>
  )
}

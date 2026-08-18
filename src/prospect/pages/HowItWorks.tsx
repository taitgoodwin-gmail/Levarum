import { useState } from 'react'

import { Link, ROUTES } from '../../router'
import { track } from '../../analytics'
import { useReveal, useSpring, TOTAL_SPRING } from '../../motion'
import { Eyebrow, Rise, Section } from '../components/Section'
import { LINE, LINE_SHAPE, LINE_WITHHELD } from '../content/line'

/**
 * How it works.
 *
 * The objection this page kills: "this is going to be a six-week consulting
 * engagement." Three steps, each with what it costs in time, and a station-by-
 * station walk of one missed call from ring to paid — then an explicit note
 * about what is deliberately not on the page, because a prospect who notices
 * the omission on their own reads it as evasion.
 */

const STEPS = [
  {
    n: 1,
    when: 'About 90 seconds',
    title: 'Tell me the shape of your week',
    body: 'What kind of business you run, roughly how many hours go to back-office work, and which jobs eat the most of them. Three questions, no account, no card.',
    listLabel: 'What I ask',
    list: [
      'What kind of business is this?',
      'How many hours a week go to back-office work?',
      'Which of these sound like you?',
    ],
  },
  {
    n: 2,
    when: 'Straight away, on screen',
    title: 'Read your Game Plan',
    body: 'Named jobs worth handing off, roughly how many hours a week each gives back, and the one thing I would fix before anything else. Written for you, not for a developer.',
    listLabel: 'What you get',
    list: [
      'The handful of jobs worth handing off first',
      'Hours back each week, per job',
      'The one thing to fix first, and why',
    ],
  },
  {
    n: 3,
    when: 'Fifteen minutes, if you want it',
    title: 'A short call, no pitch',
    body: 'We walk the plan together and decide whether it is worth building at all. If it is not, I will say so, and you keep the plan either way.',
    listLabel: 'Then, if you go ahead',
    list: [
      'Scope and price agreed before work starts',
      'Built in days, in your own accounts',
      'Handed over with the logins, plus two weeks of fixes',
    ],
  },
]

/**
 * The hours-worth slider.
 *
 * Deliberately vague about money: it converts hours to hours, never to a
 * dollar figure, because a rate is something the prospect sets in their own
 * plan and pricing policy is an open owner decision. The total springs rather
 * than counts, so dragging feels like moving a weight.
 */
function Calculator() {
  const [hours, setHours] = useState(9)
  const reveal = useReveal({ threshold: 0.3 })
  const perYear = useSpring(hours * 46, reveal.shown, TOTAL_SPRING)
  const weeks = Math.max(1, Math.round((hours * 46) / 38))

  return (
    <div className="lv-card lv-calc" ref={reveal.ref}>
      <label className="lv-label" htmlFor="calc-hours">
        Hours a week handed off
      </label>
      <input
        id="calc-hours"
        className="lv-slider"
        type="range"
        min={1}
        max={25}
        step={1}
        value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
      />

      <div className="lv-calc__out" aria-live="polite">
        <div className="lv-figure">
          {Math.round(perYear).toLocaleString('en-US')}
          <span className="lv-figure__unit">
            hours back a year, at {hours} {hours === 1 ? 'hour' : 'hours'} a week
          </span>
        </div>
        <p className="lv-meta">
          Roughly {weeks} working {weeks === 1 ? 'week' : 'weeks'} a year. An estimate from a
          slider — your plan works from your own answers.
        </p>
      </div>
    </div>
  )
}

export function HowItWorks() {
  return (
    <>
      <Section rung={1} prose>
        <Eyebrow>How it works</Eyebrow>
        <h1 className="lv-h1">Three questions, a plan, one short call.</h1>
        <p className="lv-lead">
          No discovery workshop, no proposal document, no six-week engagement before anything
          useful exists.
        </p>
      </Section>

      {/* STEPS --------------------------------------------------------- */}
      <Section rung={2} ruled>
        <div className="lv-stack--loose">
          {STEPS.map((step, i) => (
            <Rise key={step.n} index={i}>
              <article className="lv-card lv-step">
                <div className="lv-step__head">
                  <span className="lv-marker">{step.n}</span>
                  <span className="lv-meta">{step.when}</span>
                </div>
                <h2 className="lv-h3">{step.title}</h2>
                <p className="lv-body">{step.body}</p>

                <div className="lv-step__list lv-railed">
                  <Eyebrow tone="quiet">{step.listLabel}</Eyebrow>
                  <ul className="lv-list">
                    {step.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Rise>
          ))}
        </div>
      </Section>

      {/* THE LINE ------------------------------------------------------ */}
      <Section rung={1}>
        <Eyebrow>How the pieces string together</Eyebrow>
        <h2 className="lv-h2">One missed call, end to end.</h2>
        <p className="lv-lead">
          Seven stations on one line, using tools you already pay for. Nothing here needs you at a
          keyboard.
        </p>

        <ol className="lv-line">
          {LINE.map((station, i) => (
            <Rise key={station.n} index={i} className="lv-line__item">
              <li className="lv-line__row">
                <span className="lv-marker">{station.n}</span>
                <div className="lv-line__body">
                  <div className="lv-line__title">
                    {station.title}
                    {station.tool ? <span className="lv-chip">{station.tool}</span> : null}
                  </div>
                  <p className="lv-body">{station.detail}</p>
                </div>
              </li>
            </Rise>
          ))}
        </ol>

        <div className="lv-grid lv-grid--2 lv-line__notes">
          <div className="lv-card lv-railed">
            <h3 className="lv-h4">{LINE_SHAPE.title}</h3>
            <p className="lv-body">{LINE_SHAPE.body}</p>
          </div>
          <div className="lv-card lv-railed">
            <h3 className="lv-h4">{LINE_WITHHELD.title}</h3>
            <p className="lv-body">{LINE_WITHHELD.body}</p>
          </div>
        </div>
      </Section>

      {/* CALCULATOR ---------------------------------------------------- */}
      <Section rung={3} ruled>
        <Eyebrow>A rough idea</Eyebrow>
        <h2 className="lv-h2">What would the hours be worth to you?</h2>
        <p className="lv-lead">
          Drag the hours. Your plan does this properly, using the jobs you actually name and a rate
          you set yourself.
        </p>
        <Calculator />
      </Section>

      {/* NEXT ---------------------------------------------------------- */}
      <Section rung={1}>
        <div className="lv-grid lv-grid--2">
          <Link to={ROUTES.whatWeAutomate} className="lv-card lv-pagelink">
            <Eyebrow>Next</Eyebrow>
            <h3 className="lv-h4">What we automate</h3>
            <p className="lv-body">
              The five jobs that leak the most time, and the tools each one runs on.
            </p>
            <span className="lv-textlink">See the five →</span>
          </Link>
          <Link to={ROUTES.questions} className="lv-card lv-pagelink">
            <Eyebrow>Still wondering</Eyebrow>
            <h3 className="lv-h4">Cost, time, safety, staff</h3>
            <p className="lv-body">
              The seven things owners ask before they start, answered plainly.
            </p>
            <span className="lv-textlink">Read the answers →</span>
          </Link>
        </div>
      </Section>

      <Section rung={2} ruled className="lv-cta">
        <h2 className="lv-h2">Ready when you are</h2>
        <p className="lv-lead lv-cta__lead">
          Three questions, about ninety seconds. Everything after it is remote, wherever you are.
          The plan is yours either way.
        </p>
        <Link
          to={ROUTES.start}
          className="lv-btn"
          onClick={() => track('home_to_start', { from: 'how_it_works' })}
        >
          Build my Game Plan
        </Link>
      </Section>
    </>
  )
}

import { useState } from 'react'

import { Link, ROUTES } from '../../router'
import { track } from '../../analytics'
import { Eyebrow, Rise, Section } from '../components/Section'
import { FAQS } from '../content/faqs'

/**
 * Questions.
 *
 * The objection this page kills: every remaining one. Nine answers, the
 * awkward ones included — will this replace my staff, why not just buy
 * software — answered against the reader's interest rather than for it.
 *
 * One panel open at a time, which keeps the page scannable and means the
 * answer someone is reading is never competing with three others.
 */
export function Questions() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <Section rung={1} prose>
        <Eyebrow>Questions</Eyebrow>
        <h1 className="lv-h1">The things owners ask me first.</h1>
        <p className="lv-lead">Honest answers. If yours is not here, ask it on the call.</p>
      </Section>

      <Section rung={3} ruled prose>
        <div className="lv-stack--tight">
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <Rise key={faq.q} index={i} className="lv-faq-wrap">
                <div className="lv-faq" data-open={isOpen ? '' : undefined}>
                  <h2 className="lv-faq__heading">
                    <button
                      type="button"
                      className="lv-faq__button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-button-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span>{faq.q}</span>
                      <span className="lv-faq__icon" aria-hidden="true">
                        +
                      </span>
                    </button>
                  </h2>
                  <div
                    className="lv-faq__panel"
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    /* Hidden from assistive tech while collapsed, since the
                       grid-rows trick keeps it in the layout. */
                    aria-hidden={!isOpen}
                  >
                    <div className="lv-faq__panelinner">
                      <p className="lv-faq__answer">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </Rise>
            )
          })}
        </div>
      </Section>

      <Section rung={2} className="lv-cta">
        <h2 className="lv-h2">Still not sure? Get the plan and decide after.</h2>
        <p className="lv-lead lv-cta__lead">
          Three questions, about ninety seconds. It is yours whether or not we ever speak.
        </p>
        <Link
          to={ROUTES.start}
          className="lv-btn"
          onClick={() => track('home_to_start', { from: 'questions' })}
        >
          Build my Game Plan
        </Link>
      </Section>
    </>
  )
}

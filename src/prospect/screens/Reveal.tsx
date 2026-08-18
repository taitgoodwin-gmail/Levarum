import { BRAND } from '../../brand'
import type { Pain } from '../../domain/types'
import { annualRange, fixFirst, hoursBack, hoursLabel, monthlyRange } from '../../domain/estimate'

/**
 * Frame 05: the unlocked, costed plan.
 *
 * The dollar figure is transparent math the prospect can adjust: hours x their
 * own rate x 4.3 weeks, shown as a rounded range and labelled an estimate.
 * Outcomes are named, methods never are. One button out: book the call.
 */

interface RevealProps {
  pains: Pain[]
  rate: number
  onRate: (value: number) => void
  onBook: () => void
}

export function Reveal({ pains, rate, onRate, onBook }: RevealProps) {
  const back = hoursBack(pains)
  const fix = fixFirst(pains)

  return (
    <>
      <div className="p-topbar">
        <span className="p-wordmark">{BRAND.name}</span>
        <span className="p-step-count">Unlocked</span>
      </div>

      <div className="p-eyebrow">YOUR GAME PLAN</div>

      <div className="p-reveal-top">
        <div>
          <div className="p-reveal-label">Your time, given back, is worth about</div>
          <div className="p-figure">{monthlyRange(back, rate)}</div>
          <div className="p-figure-unit">a month</div>
          <div className="p-rule" aria-hidden="true" />
          <p className="p-math">
            Based on <b>{hoursLabel(back)}</b> a week back, at your rate, across about 4.3 weeks.
            That is roughly <b>{annualRange(back, rate)}</b> a year. An estimate, not a quote.
          </p>
        </div>

        <div className="p-rate">
          <div className="p-rate-head">
            <label className="p-rate-name" htmlFor="rate">
              Your hourly rate
            </label>
            <span className="p-rate-value">${rate} / hr</span>
          </div>
          <input
            id="rate"
            className="p-slider"
            type="range"
            min={25}
            max={200}
            step={5}
            value={rate}
            aria-valuetext={`$${rate} per hour`}
            onChange={(e) => onRate(Number(e.target.value))}
          />
          <div className="p-rate-hint">Drag to use your real number. The estimate moves with it.</div>
        </div>
      </div>

      <div className="p-reveal-divider" aria-hidden="true" />

      <div className="p-reveal-mid">
        <div>
          <div className="p-section-label">Where it comes from</div>
          <div className="p-opps">
            {pains.map((pain) => (
              <div className="p-opp" key={pain.id}>
                <div className="p-opp-title">{pain.opp}</div>
                <div className="p-opp-hours">
                  about {pain.lo} to {pain.hi} hours a week
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-reveal-side">
          {fix ? (
            <div className="p-fix">
              <div className="p-fix-eyebrow">FIX THIS FIRST</div>
              <div className="p-fix-title">{fix.opp}</div>
              <div className="p-fix-why">
                It is the biggest block of hours and among the easiest to lift off your plate, so
                you feel it in the first week.
              </div>
            </div>
          ) : null}

          <div className="p-proof">
            <div className="p-proof-label">PROOF TO ADD</div>
            <div className="p-proof-slot">[ stat plus named source ]</div>
          </div>
        </div>
      </div>

      <div className="p-reveal-cta">
        <button type="button" className="p-cta p-cta--convert" onClick={onBook}>
          Book a 15-min call
        </button>
        <p className="p-caption">
          Fifteen minutes, no pitch. We see together whether this is worth doing.
        </p>
      </div>
    </>
  )
}

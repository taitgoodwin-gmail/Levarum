import { useState } from 'react'
import { BRAND } from '../../brand'
import { BUSINESS_TYPES, HOURS_BANDS, PAINS } from '../../domain/pains'
import type { HoursBand, PainId } from '../../domain/types'

/** Frames 01 to 03: the three-step intake. Under 90 seconds, no account. */

interface StepChromeProps {
  step: 1 | 2 | 3
  onBack?: () => void
  children: React.ReactNode
}

function StepChrome({ step, onBack, children }: StepChromeProps) {
  return (
    <>
      <div className="p-topbar">
        {onBack ? (
          <button type="button" className="p-back" onClick={onBack} aria-label="Go back a step">
            ‹
          </button>
        ) : null}
        <span className="p-wordmark">{BRAND.name}</span>
        <span className="p-step-count">Step {step} of 3</span>
      </div>
      <div className="p-progress" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step} aria-label="Intake progress">
        {[1, 2, 3].map((n) => (
          <span key={n} className={n <= step ? 'is-done' : undefined} />
        ))}
      </div>
      {children}
    </>
  )
}

interface Step1Props {
  business: string
  hours: HoursBand
  onBusiness: (value: string) => void
  onHours: (value: HoursBand) => void
  onNext: () => void
}

export function Step1({ business, hours, onBusiness, onHours, onNext }: Step1Props) {
  const [open, setOpen] = useState(false)

  return (
    <StepChrome step={1}>
      <div className="p-intake">
        <div>
          <h1 className="p-h1">First, the basics.</h1>
          <p className="p-lede p-lede--desktop-only">
            Two quick answers and I can start sizing where your week is going.
          </p>
        </div>
        <div>
          <div className="p-field-label" id="business-label">
            What kind of business is this?
          </div>
          <button
            type="button"
            className="p-select"
            aria-expanded={open}
            aria-labelledby="business-label"
            onClick={() => setOpen((v) => !v)}
          >
            {business}
            <span className="p-select-caret" aria-hidden="true">
              ▾
            </span>
          </button>
          {open ? (
            <div className="p-select-menu" role="listbox" aria-labelledby="business-label">
              {BUSINESS_TYPES.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={option === business}
                  className="p-select-option"
                  onClick={() => {
                    onBusiness(option)
                    setOpen(false)
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : null}

          <div className="p-field-label" style={{ marginTop: 22 }} id="hours-label">
            About how many hours a week go to back-office work?
          </div>
          <div className="p-hours" role="group" aria-labelledby="hours-label">
            {HOURS_BANDS.map((band) => (
              <button
                key={band}
                type="button"
                className="p-chip"
                aria-pressed={band === hours}
                onClick={() => onHours(band)}
              >
                {band === hours ? (
                  <span className="p-chip-check" aria-hidden="true">
                    ✓
                  </span>
                ) : null}
                {band}
              </button>
            ))}
          </div>

          <div className="p-actions">
            <button type="button" className="p-cta" onClick={onNext}>
              Next
            </button>
            <p className="p-caption">About 90 seconds. No account, no card.</p>
          </div>
        </div>
      </div>
    </StepChrome>
  )
}

interface Step2Props {
  pains: PainId[]
  onToggle: (id: PainId) => void
  onBack: () => void
  onNext: () => void
}

export function Step2({ pains, onToggle, onBack, onNext }: Step2Props) {
  return (
    <StepChrome step={2} onBack={onBack}>
      <h1 className="p-h1 p-h1--tight">Where does the week actually go?</h1>
      <p className="p-lede">Pick the ones that sound like you. More than one is fine.</p>
      <div className="p-pains">
        {PAINS.map((pain) => {
          const selected = pains.includes(pain.id)
          return (
            <button
              key={pain.id}
              type="button"
              className="p-pain"
              aria-pressed={selected}
              onClick={() => onToggle(pain.id)}
            >
              <span className="p-pain-box" aria-hidden="true">
                {selected ? '✓' : ''}
              </span>
              <span className="p-pain-label">{pain.label}</span>
            </button>
          )
        })}
      </div>
      <button type="button" className="p-cta" onClick={onNext}>
        Next
      </button>
    </StepChrome>
  )
}

interface Step3Props {
  onBack: () => void
  onBuild: () => void
}

const PROMISE = [
  'The handful of jobs worth handing off first',
  'Roughly how many hours that gives you back each week',
  'What those hours are worth in money',
  'The one thing I would fix before anything else',
]

export function Step3({ onBack, onBuild }: Step3Props) {
  return (
    <StepChrome step={3} onBack={onBack}>
      <h1 className="p-h1 p-h1--tight">Here is what I will put together for you.</h1>
      <p className="p-lede">
        A short, costed plan. Built from your answers, written in plain language.
      </p>
      <ol className="p-promise">
        {PROMISE.map((line, i) => (
          <li key={line}>
            <span className="p-promise-n" aria-hidden="true">
              {i + 1}
            </span>
            <span className="p-promise-text">{line}</span>
          </li>
        ))}
      </ol>
      <button type="button" className="p-cta" onClick={onBuild}>
        Build my Game Plan
      </button>
      <p className="p-caption">Takes about ten seconds.</p>
    </StepChrome>
  )
}

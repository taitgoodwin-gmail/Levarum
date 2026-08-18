import { BRAND } from '../../brand'
import type { HoursBand, Pain } from '../../domain/types'
import { countWord, hoursBack, hoursLabel, monthlyRange } from '../../domain/estimate'

/**
 * Frame 04: the result, locked.
 *
 * Magnitude is shown, method stays hidden. The hours figure is real and legible;
 * the money figure is blurred. The recap above it echoes their own answers so
 * the lock reads as their plan redacted rather than a generic paywall.
 */

interface GateProps {
  business: string
  hours: HoursBand
  pains: Pain[]
  rate: number
  email: string
  error: boolean
  onEmail: (value: string) => void
  onUnlock: () => void
  onBack: () => void
}

export function Gate({
  business,
  hours,
  pains,
  rate,
  email,
  error,
  onEmail,
  onUnlock,
  onBack,
}: GateProps) {
  const back = hoursBack(pains)

  return (
    <>
      <div className="p-topbar">
        <button type="button" className="p-back" onClick={onBack} aria-label="Go back a step">
          ‹
        </button>
        <span className="p-wordmark">{BRAND.name}</span>
        <span className="p-step-count" aria-hidden="true" />
      </div>

      <div className="p-eyebrow">YOUR GAME PLAN IS READY</div>
      <h1 className="p-h1 p-h1--tight">
        I found {countWord(pains.length)} places your week is leaking time.
      </h1>
      <p className="p-lede">I put a number on each one. Here is the size of it.</p>

      <div className="p-recap">
        <div className="p-recap-title">WHAT YOU TOLD ME</div>
        <div className="p-recap-row">
          <span>Business</span>
          <b>{business}</b>
        </div>
        <div className="p-recap-row">
          <span>Back-office</span>
          <b>{hours} hrs / week</b>
        </div>
        <div className="p-tags">
          {pains.map((pain) => (
            <span key={pain.id} className="p-tag">
              {pain.short}
            </span>
          ))}
        </div>
      </div>

      <div className="p-stat">
        <div className="p-stat-label">Hours back, every week</div>
        <div className="p-stat-value">{hoursLabel(back)}</div>
      </div>

      <div className="p-locked">
        <div className="p-locked-head">
          <span>What that is worth, per month</span>
          <span className="p-lock" aria-hidden="true">
            <span className="p-lock-body" />
            <span className="p-lock-shackle" />
          </span>
        </div>
        <div className="p-locked-value" aria-hidden="true">
          {monthlyRange(back, rate)}
        </div>
        <span className="sr-only">
          The monthly figure is hidden until you enter your email address.
        </span>
        <div className="p-locked-note">
          Unlock the plan to see the math, every opportunity named, and the one thing to fix
          first.
        </div>
      </div>

      <div className="p-gate">
        <label className="p-gate-title" htmlFor="gate-email">
          Where should I send the full plan?
        </label>
        <input
          id="gate-email"
          className="p-input"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@yourbusiness.com"
          value={email}
          aria-invalid={error}
          aria-describedby={error ? 'gate-email-error' : undefined}
          onChange={(e) => onEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onUnlock()
          }}
        />
        {error ? (
          <div className="p-error" id="gate-email-error" role="alert">
            That does not look like an email yet. Mind checking it?
          </div>
        ) : null}
        <button type="button" className="p-cta" onClick={onUnlock}>
          Unlock my Game Plan
        </button>
        <p className="p-caption">Sent once. No list, no spam.</p>
      </div>
    </>
  )
}

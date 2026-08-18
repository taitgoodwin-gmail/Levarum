import { BRAND } from '../../brand'
import type { Pain } from '../../domain/types'

/**
 * The conversion and its confirmation.
 *
 * Scheduling is a labelled placeholder: the slot list stands in for a real
 * scheduler embed, and says so rather than implying a live calendar. The
 * vendor is named in the operator catalog, never here.
 */

export const SLOTS = [
  'Tomorrow, 9:30 AM',
  'Tomorrow, 2:00 PM',
  'Thursday, 11:00 AM',
  'Friday, 4:30 PM',
]

interface BookingProps {
  email: string
  onPick: (slot: string) => void
  onBack: () => void
}

export function Booking({ email, onPick, onBack }: BookingProps) {
  return (
    <>
      <div className="p-topbar">
        <button type="button" className="p-back" onClick={onBack} aria-label="Back to my plan">
          ‹
        </button>
        <span className="p-wordmark">{BRAND.name}</span>
        <span className="p-step-count" aria-hidden="true" />
      </div>

      <h1 className="p-h1 p-h1--tight">Pick a time that suits you.</h1>
      <p className="p-lede">
        Fifteen minutes, by phone. I will have your plan open in front of me.
      </p>

      <div className="p-slots">
        <div className="p-slots-label">Earliest openings</div>
        <div className="p-slot-list">
          {SLOTS.map((slot) => (
            <button key={slot} type="button" className="p-slot" onClick={() => onPick(slot)}>
              <span className="p-slot-time">{slot}</span>
              <span className="p-slot-pick" aria-hidden="true">
                Pick →
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="p-simulated">
        Invite goes to {email}. Times are a placeholder for a live scheduler.
      </p>
    </>
  )
}

interface ConfirmedProps {
  slot: string
  email: string
  fix: Pain | null
  onRestart: () => void
}

export function Confirmed({ slot, email, fix, onRestart }: ConfirmedProps) {
  return (
    <>
      <div className="p-tick" aria-hidden="true">
        ✓
      </div>
      <h1 className="p-confirm-h">You are booked.</h1>
      <p className="p-confirm-sub">
        A 15-minute call, no pitch. Look out for a calendar invite.
      </p>

      <div className="p-detail">
        <div className="p-detail-row">
          <span>When</span>
          <b className="is-strong">{slot}</b>
        </div>
        <div className="p-detail-row">
          <span>Invite to</span>
          <b>{email}</b>
        </div>
        <div className="p-detail-row">
          <span>With</span>
          <b>{BRAND.name}</b>
        </div>
      </div>

      {fix ? (
        <div className="p-oncall">
          <div className="p-oncall-label">ON THE CALL</div>
          <div className="p-oncall-body">
            We walk your plan together and start with the one thing to fix first:{' '}
            {fix.opp.toLowerCase()}.
          </div>
        </div>
      ) : null}

      <button type="button" className="p-cta p-cta--quiet" onClick={onRestart}>
        Start another Game Plan
      </button>
      <p className="p-simulated">
        The invite and the confirmation email are simulated in this build.
      </p>
    </>
  )
}

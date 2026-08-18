import { useCallback, useMemo, useState } from 'react'

import './prospect.css'

import type { HoursBand, PainId, Submission } from '../domain/types'
import { baseDraft, fixFirst, looksLikeEmail } from '../domain/estimate'
import { painsOrDefault } from '../domain/pains'
import { addSubmission, updateSubmission } from '../store/submissions'
import { runDraft } from '../ai/drafting'

import { Step1, Step2, Step3 } from './screens/Intake'
import { Gate } from './screens/Gate'
import { Reveal } from './screens/Reveal'
import { Booking, Confirmed, SLOTS } from './screens/Booking'

/**
 * The prospect surface: intake, gate, reveal, book.
 *
 * This component and everything under ./screens is the entire prospect
 * rendering path. It imports no operator module and renders no route into the
 * console, which is how the never-reveal boundary is held in the build rather
 * than only in the copy.
 *
 * Seeded with a plausible business so the whole flow clicks through without
 * typing. Typing still works and overwrites every seeded value.
 */

type Route = 'step1' | 'step2' | 'step3' | 'gate' | 'reveal' | 'booking' | 'confirmed'

export function ProspectApp() {
  const [route, setRoute] = useState<Route>('step1')
  const [business, setBusiness] = useState<string>('Home services (plumbing, HVAC, electrical)')
  const [hours, setHours] = useState<HoursBand>('5 to 15')
  const [pains, setPains] = useState<PainId[]>(['questions', 'invoices', 'booking'])
  const [email, setEmail] = useState('casey@brightpathplumbing.com')
  const [emailError, setEmailError] = useState(false)
  const [rate, setRate] = useState(60)
  const [slot, setSlot] = useState(SLOTS[0])
  const [submissionId, setSubmissionId] = useState<string | null>(null)

  const selected = useMemo(() => painsOrDefault(pains), [pains])
  const fix = useMemo(() => fixFirst(selected), [selected])

  const go = useCallback((next: Route) => {
    setRoute(next)
    window.scrollTo(0, 0)
  }, [])

  const togglePain = useCallback((id: PainId) => {
    setPains((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }, [])

  /**
   * Unlocking is the moment the record becomes real: it is written to the
   * store, which is what the operator console reads, and the drafting call is
   * fired without blocking the reveal.
   */
  const unlock = useCallback(() => {
    if (!looksLikeEmail(email)) {
      setEmailError(true)
      return
    }
    setEmailError(false)

    const submission: Submission = {
      id: `sub-${Date.now()}`,
      createdAt: Date.now(),
      business,
      hours,
      pains: [...pains],
      email: email.trim(),
      rate,
      status: 'new',
      draft: baseDraft(pains),
    }
    addSubmission(submission)
    setSubmissionId(submission.id)
    void runDraft(submission.id)

    go('reveal')
  }, [business, email, go, hours, pains, rate])

  /** The rate they settle on is worth carrying to the call. */
  const commitRate = useCallback(
    (value: number) => {
      setRate(value)
      if (submissionId) updateSubmission(submissionId, { rate: value })
    },
    [submissionId],
  )

  const pickSlot = useCallback(
    (picked: string) => {
      setSlot(picked)
      if (submissionId) {
        updateSubmission(submissionId, { status: 'contacted', bookedSlot: picked })
      }
      go('confirmed')
    },
    [go, submissionId],
  )

  const restart = useCallback(() => {
    setSubmissionId(null)
    setEmailError(false)
    go('step1')
  }, [go])

  // Frame 05-D is the wider of the two desktop layouts.
  const wide = route === 'reveal'

  return (
    <div className="p-canvas">
      <main className={wide ? 'p-frame p-frame--wide' : 'p-frame'}>
        {route === 'step1' ? (
          <Step1
            business={business}
            hours={hours}
            onBusiness={setBusiness}
            onHours={setHours}
            onNext={() => go('step2')}
          />
        ) : null}

        {route === 'step2' ? (
          <Step2 pains={pains} onToggle={togglePain} onBack={() => go('step1')} onNext={() => go('step3')} />
        ) : null}

        {route === 'step3' ? <Step3 onBack={() => go('step2')} onBuild={() => go('gate')} /> : null}

        {route === 'gate' ? (
          <Gate
            business={business}
            hours={hours}
            pains={selected}
            rate={rate}
            email={email}
            error={emailError}
            onEmail={(value) => {
              setEmail(value)
              setEmailError(false)
            }}
            onUnlock={unlock}
            onBack={() => go('step3')}
          />
        ) : null}

        {route === 'reveal' ? (
          <Reveal pains={selected} rate={rate} onRate={commitRate} onBook={() => go('booking')} />
        ) : null}

        {route === 'booking' ? (
          <Booking email={email} onPick={pickSlot} onBack={() => go('reveal')} />
        ) : null}

        {route === 'confirmed' ? (
          <Confirmed slot={slot} email={email} fix={fix} onRestart={restart} />
        ) : null}
      </main>
    </div>
  )
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Link, ROUTES } from '../../router'
import { BUSINESS_TYPES, HOURS_BANDS, PAINS, painsOrDefault } from '../../domain/pains'
import { baseDraft, looksLikeEmail } from '../../domain/estimate'
import type { HoursBand, PainId, Submission } from '../../domain/types'
import { runDraft } from '../../ai/drafting'
import { submitBooking, submitPlan } from '../../store/submit'
import { updateSubmission } from '../../store/submissions'
import { track } from '../../analytics'
import { transition, useSpring, TOTAL_SPRING } from '../../motion'
import { HoursBar } from '../components/HoursBar'
import { Eyebrow } from '../components/Section'
import { CONTACT_EMAIL } from '../content/site'
import { usePlanAssembly } from '../usePlanAssembly'

/**
 * The intake: three questions, an email gate, then the plan.
 *
 * Conversational pacing, explicitly not a chatbot. One question on screen at a
 * time with structured inputs — taps and a select, never a free-text box
 * pretending to understand. The point of the pacing is that it reads as a
 * conversation; the point of the structure is that it cannot misunderstand
 * someone, which a text box would.
 *
 * Steps move inside a View Transition, so the progress track, the card and the
 * heading are matched across the change and slide rather than cut. That is
 * what makes three screens read as one continuous exchange. Where the API is
 * missing, or motion is off, the state simply changes — same screens, no
 * animation.
 *
 * Answers stay on the device until the gate is satisfied. That is what the
 * micro-copy promises, and the POST does not happen a moment sooner.
 */

type Route = 'step1' | 'step2' | 'step3' | 'gate' | 'plan'

const ROUTE_ORDER: Route[] = ['step1', 'step2', 'step3', 'gate', 'plan']

/** Held on the device across a refresh, so a half-finished intake survives. */
const DRAFT_KEY = 'levarum.start.v1'

/**
 * Slots, as designed. Not a real calendar yet: the booking tool is an open
 * owner decision (REQUIREMENTS.md §5, Calendly against Cal.com), and embedding
 * one to fill the gap would settle it by accident.
 */
const SLOTS = ['Tomorrow, 9:30am', 'Tomorrow, 2:00pm', 'Thursday, 11:00am']

/** The band caps what the pains can add up to. Nobody hands off more than they have. */
const BAND_CAP: Record<HoursBand, number> = {
  'Under 5': 4,
  '5 to 15': 11,
  '15 to 30': 20,
  '30 plus': 30,
}

interface Saved {
  route?: Route
  business?: string
  hours?: HoursBand
  pains?: PainId[]
  email?: string
  bookedSlot?: string | null
}

function readSaved(): Saved {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as Saved) : {}
  } catch {
    return {}
  }
}

export function Start() {
  const saved = useRef<Saved>(readSaved()).current

  const [route, setRoute] = useState<Route>(() => {
    // A saved plan route is not resumable — the submission it described was
    // for that visit. Send them back to the last step they can act on.
    const r = saved.route
    return r && r !== 'plan' && ROUTE_ORDER.includes(r) ? r : 'step1'
  })

  const [business, setBusiness] = useState<string>(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('business')
      if (fromUrl && (BUSINESS_TYPES as readonly string[]).includes(fromUrl)) return fromUrl
    } catch {
      /* no search params to read */
    }
    return saved.business ?? BUSINESS_TYPES[0]
  })

  const [hours, setHours] = useState<HoursBand>(saved.hours ?? '5 to 15')
  const [pains, setPains] = useState<PainId[]>(saved.pains ?? ['invoices', 'booking'])
  const [painError, setPainError] = useState(false)
  const [email, setEmail] = useState(saved.email ?? '')
  const [emailError, setEmailError] = useState(false)
  const [bookedSlot, setBookedSlot] = useState<string | null>(saved.bookedSlot ?? null)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)

  const selected = useMemo(() => painsOrDefault(pains), [pains])

  /** Hours back a week, capped by the band they told us about themselves. */
  const range = useMemo(() => {
    const cap = BAND_CAP[hours]
    const lo = Math.min(
      selected.reduce((a, p) => a + p.lo, 0),
      cap,
    )
    const hi = Math.min(
      selected.reduce((a, p) => a + p.hi, 0),
      cap + 4,
    )
    return { lo, hi, mid: (lo + hi) / 2 }
  }, [selected, hours])

  const hoursLabel = range.lo === range.hi ? `${range.lo} hours` : `${range.lo} to ${range.hi} hours`

  /** The biggest block of hours: what to fix before anything else. */
  const fixFirst = useMemo(
    () => [...selected].sort((a, b) => b.lo + b.hi - (a.lo + a.hi))[0],
    [selected],
  )

  // Persist the answers, and keep the address bar honest about which step is
  // on screen so back does what it looks like it does.
  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ route, business, hours, pains, email, bookedSlot } satisfies Saved),
      )
    } catch {
      /* the intake still works, it just will not survive a refresh */
    }
  }, [route, business, hours, pains, email, bookedSlot])

  const go = useCallback((next: Route) => {
    transition(() => setRoute(next))
  }, [])

  const togglePain = (id: PainId) => {
    setPainError(false)
    setPains((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const toStep3 = () => {
    if (!pains.length) {
      setPainError(true)
      return
    }
    go('step3')
  }

  const toGate = () => {
    track('gate_view', { pains: pains.length })
    go('gate')
  }

  const assembly = usePlanAssembly(selected.length)

  /**
   * The gate. This is the moment the record becomes real: it is written to the
   * store, POSTed to the server, and the drafting call is started — none of
   * which happens before an email is given, which is what the micro-copy on
   * every earlier step promises.
   */
  const unlock = () => {
    if (!looksLikeEmail(email)) {
      setEmailError(true)
      return
    }
    setEmailError(false)

    const submission: Submission = {
      id: `sub-${Date.now().toString(36)}`,
      createdAt: Date.now(),
      kind: 'plan',
      business,
      hours,
      pains: [...pains],
      email: email.trim(),
      rate: 60,
      status: 'new',
      draft: baseDraft(pains),
    }

    track('gate_unlock')
    setSubmissionId(submission.id)
    go('plan')
    track('plan_view')

    // Both calls are real, and the plan's assembly is paced against the first
    // of them rather than against a timer. See usePlanAssembly.
    const persisted = submitPlan(submission).then((result) => {
      if (!result.ok) setSendError(result.error ?? 'The request did not go through.')
      else setSendError(null)
      return result
    })
    assembly.begin(persisted.then(() => undefined))
    void persisted.then((result) => {
      if (result.ok) {
        setSubmissionId(result.id)
        void runDraft(result.id)
      }
    })
  }

  const retry = () => {
    if (!submissionId) return
    setSendError(null)
    const record = { ...baseDraft(pains) }
    void submitPlan({
      id: submissionId,
      createdAt: Date.now(),
      kind: 'plan',
      business,
      hours,
      pains: [...pains],
      email: email.trim(),
      rate: 60,
      status: 'new',
      draft: record,
    }).then((result) => {
      if (!result.ok) setSendError(result.error ?? 'The request did not go through.')
      else setSendError(null)
    })
  }

  const book = (slot: string) => {
    setBookedSlot(slot)
    track('plan_to_booking', { slot })
    track('booking_confirmed', { slot })
    if (submissionId) {
      updateSubmission(submissionId, { status: 'contacted', bookedSlot: slot })
      void submitBooking(submissionId, slot)
    }
  }

  const restart = () => {
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* nothing saved to clear */
    }
    setSubmissionId(null)
    setBookedSlot(null)
    setEmail('')
    setSendError(null)
    go('step1')
  }

  const stepNumber = route === 'step1' ? 1 : route === 'step2' ? 2 : 3
  const inIntake = route === 'step1' || route === 'step2' || route === 'step3'

  return (
    <div className="lv-wrap lv-start">
      {inIntake ? (
        <div className="lv-start__progress">
          {/* The track is a matched element across the view transition, so it
              slides between steps instead of being redrawn. */}
          <div className="lv-track" style={{ viewTransitionName: 'lv-track' }}>
            {[1, 2, 3].map((n) => (
              <span key={n} className="lv-track__dot" data-on={n <= stepNumber ? '' : undefined} />
            ))}
          </div>
          <p className="lv-meta" aria-live="polite">
            Step {stepNumber} of 3 · about 90 seconds in total
          </p>
        </div>
      ) : null}

      <div className="lv-start__card" style={{ viewTransitionName: 'lv-intake-card' }}>
        {/* STEP 1 ---------------------------------------------------- */}
        {route === 'step1' ? (
          <section className="lv-card lv-intake" aria-labelledby="step1-head">
            <h1 className="lv-h3" id="step1-head" style={{ viewTransitionName: 'lv-intake-head' }}>
              First, the basics.
            </h1>
            <p className="lv-lead">
              Two quick facts and we can already tell where most of the week is going.
            </p>

            <div className="lv-intake__field">
              <label className="lv-label" htmlFor="s-business">
                What kind of business is this?
              </label>
              <select
                id="s-business"
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
            </div>

            <fieldset className="lv-fieldset">
              <legend className="lv-label">
                About how many hours a week go to back-office work?
              </legend>
              <div className="lv-optiongrid">
                {HOURS_BANDS.map((band) => (
                  <button
                    key={band}
                    type="button"
                    className="lv-option"
                    aria-pressed={hours === band}
                    onClick={() => setHours(band)}
                  >
                    {band} hrs
                  </button>
                ))}
              </div>
            </fieldset>

            <button type="button" className="lv-btn lv-btn--block" onClick={() => go('step2')}>
              Next
            </button>
            <p className="lv-meta lv-intake__micro">
              No account, no card. Your answers stay on this device.
            </p>
          </section>
        ) : null}

        {/* STEP 2 ---------------------------------------------------- */}
        {route === 'step2' ? (
          <section className="lv-card lv-intake" aria-labelledby="step2-head">
            <h1 className="lv-h3" id="step2-head" style={{ viewTransitionName: 'lv-intake-head' }}>
              Where does the week actually go?
            </h1>
            <p className="lv-lead">Pick the ones that sound like you. More than one is normal.</p>

            <div className="lv-stack--tight" role="group" aria-label="Where the week goes">
              {PAINS.map((pain) => {
                const on = pains.includes(pain.id)
                return (
                  <button
                    key={pain.id}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    className="lv-option lv-optionrow"
                    onClick={() => togglePain(pain.id)}
                  >
                    <span className="lv-tick" aria-hidden="true">
                      ✓
                    </span>
                    <span>{pain.label}</span>
                  </button>
                )
              })}
            </div>

            {painError ? (
              <p className="lv-error" role="alert">
                Pick at least one, even if none of them is perfect.
              </p>
            ) : null}

            <div className="lv-intake__actions">
              <button type="button" className="lv-btn lv-btn--ghost" onClick={() => go('step1')}>
                Back
              </button>
              <button type="button" className="lv-btn" onClick={toStep3}>
                Next
              </button>
            </div>
          </section>
        ) : null}

        {/* STEP 3 ---------------------------------------------------- */}
        {route === 'step3' ? (
          <section className="lv-card lv-intake" aria-labelledby="step3-head">
            <h1 className="lv-h3" id="step3-head" style={{ viewTransitionName: 'lv-intake-head' }}>
              Here is what we will put together.
            </h1>
            <p className="lv-lead">
              A short plan, built from your answers, written in plain language.
            </p>

            <ol className="lv-numbered">
              {[
                'The handful of jobs worth handing off first',
                'Roughly how many hours that gives you back each week',
                'The one thing I would fix before anything else',
              ].map((item, i) => (
                <li key={item}>
                  <span className="lv-marker">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>

            <div className="lv-intake__actions">
              <button type="button" className="lv-btn lv-btn--ghost" onClick={() => go('step2')}>
                Back
              </button>
              <button type="button" className="lv-btn" onClick={toGate}>
                Build my Game Plan
              </button>
            </div>
          </section>
        ) : null}

        {/* GATE ------------------------------------------------------ */}
        {route === 'gate' ? (
          <section className="lv-card lv-intake" aria-labelledby="gate-head">
            <Eyebrow>Your Game Plan is ready</Eyebrow>
            <h1 className="lv-h3" id="gate-head" style={{ viewTransitionName: 'lv-intake-head' }}>
              I found {selected.length === 1 ? 'one place' : `${selected.length} places`} your week
              is leaking time.
            </h1>

            <div className="lv-gate__stats">
              <div className="lv-gate__stat">
                <span className="lv-meta">Hours back, every week</span>
                <div className="lv-figure">{hoursLabel}</div>
              </div>
              <div className="lv-gate__stat">
                <span className="lv-meta">Jobs worth handing off</span>
                <div className="lv-figure">
                  {selected.length} {selected.length === 1 ? 'job' : 'jobs'}
                </div>
              </div>
            </div>

            <div className="lv-gate__summary">
              <Eyebrow tone="quiet">What you told me</Eyebrow>
              <dl className="lv-deflist">
                <dt>Business</dt>
                <dd>{business}</dd>
                <dt>Back-office</dt>
                <dd>{hours} hrs / week</dd>
              </dl>
              <div className="lv-chips">
                {selected.map((p) => (
                  <span key={p.id} className="lv-chip">
                    {p.short}
                  </span>
                ))}
              </div>
            </div>

            <div className="lv-gate__ask">
              <label className="lv-label" htmlFor="s-email">
                Where should we send the full plan?
              </label>
              <p className="lv-meta">
                You will see it on screen straight away — the email is so you can keep it.
              </p>
              <div className="lv-gate__row">
                <input
                  id="s-email"
                  className="lv-field"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@yourbusiness.com"
                  value={email}
                  aria-invalid={emailError || undefined}
                  aria-describedby={emailError ? 'email-error' : undefined}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') unlock()
                  }}
                />
                <button type="button" className="lv-btn" onClick={unlock}>
                  Unlock my plan
                </button>
              </div>
              {emailError ? (
                <p className="lv-error" id="email-error" role="alert">
                  That does not look like an email yet. Mind checking it?
                </p>
              ) : null}
            </div>

            <button
              type="button"
              className="lv-textlink"
              onClick={() => {
                track('gate_abandon')
                go('step3')
              }}
            >
              ← Back a step
            </button>
          </section>
        ) : null}
      </div>

      {/* PLAN --------------------------------------------------------- */}
      {route === 'plan' ? (
        <Plan
          hoursLabel={hoursLabel}
          hoursMid={range.mid}
          pains={selected}
          fixFirst={fixFirst}
          assembly={assembly}
          bookedSlot={bookedSlot}
          onBook={book}
          email={email}
          sendError={sendError}
          onRetry={retry}
          onRestart={restart}
        />
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------------ */

interface PlanProps {
  hoursLabel: string
  hoursMid: number
  pains: ReturnType<typeof painsOrDefault>
  fixFirst: ReturnType<typeof painsOrDefault>[number]
  assembly: ReturnType<typeof usePlanAssembly>
  bookedSlot: string | null
  onBook: (slot: string) => void
  email: string
  sendError: string | null
  onRetry: () => void
  onRestart: () => void
}

/**
 * The revealed plan, assembling a line at a time.
 *
 * Each row is a job, its hours, and a bar on the site's shared scale — so the
 * number someone reads here means the same thing as the number they read on
 * the home page. The rows arrive one by one while the working line names what
 * is actually happening; see usePlanAssembly for what each state is tied to.
 */
function Plan({
  hoursLabel,
  hoursMid,
  pains,
  fixFirst,
  assembly,
  bookedSlot,
  onBook,
  email,
  sendError,
  onRetry,
  onRestart,
}: PlanProps) {
  const perYear = useSpring(Math.round(hoursMid * 46), assembly.done, TOTAL_SPRING)
  const weeks = Math.max(1, Math.round((hoursMid * 46) / 38))
  const visible = pains.slice(0, assembly.rows)

  return (
    <div className="lv-plan">
      <header className="lv-plan__head">
        <Eyebrow>Your Game Plan</Eyebrow>
        <h1 className="lv-h2">{hoursLabel} a week, back in your hands.</h1>
        <p className="lv-lead">
          That is about {Math.round(perYear).toLocaleString('en-US')} hours a year — roughly{' '}
          {weeks} working weeks handed back. An estimate from your answers, not a promise.
        </p>
      </header>

      <section className="lv-plan__rows" aria-label="Where the hours come from">
        <div className="lv-plan__rowshead">
          <Eyebrow tone="quiet">Where it comes from</Eyebrow>
          {assembly.working ? (
            <p className="lv-working" aria-live="polite">
              <span className="lv-working__pulse" aria-hidden="true" />
              {assembly.working}…
            </p>
          ) : null}
        </div>

        <div className="lv-stack">
          {visible.map((pain, i) => (
            <div key={pain.id} className="lv-card lv-planrow">
              <div className="lv-hoursrow">
                <span className="lv-planrow__title">{pain.opp}</span>
                <span className="lv-figure lv-figure--sm">
                  {Math.round((pain.lo + pain.hi) / 2)}
                  <span className="lv-figure__unit">h</span>
                </span>
              </div>
              <p className="lv-meta">
                About {pain.lo} to {pain.hi} hrs a week
              </p>
              <HoursBar
                hours={(pain.lo + pain.hi) / 2}
                label={pain.opp}
                emphasis={pain.id === fixFirst.id ? 'lead' : 'quiet'}
                index={i}
              />
            </div>
          ))}
        </div>
      </section>

      {assembly.done ? (
        <>
          <section className="lv-card lv-plan__fix lv-railed">
            <Eyebrow>Fix this first</Eyebrow>
            <h2 className="lv-h3">{fixFirst.block}</h2>
            <p className="lv-body">{fixFirst.why}</p>
          </section>

          {/* BOOKING — a petrol-ink band, so the one rust action on it reads */}
          <section className="lv-plan__book" aria-labelledby="book-head">
            <h2 className="lv-h3" id="book-head">
              Want to walk through it together?
            </h2>
            <p className="lv-body">
              Fifteen minutes, no pitch. I will have your plan open in front of me and we decide
              whether it is worth building at all.
            </p>

            {bookedSlot ? (
              <div className="lv-booked" role="status">
                <p className="lv-h4">You are booked for {bookedSlot}.</p>
                <ol className="lv-numbered lv-numbered--dark">
                  {[
                    'We read your answers before the call — you will not repeat yourself.',
                    `A calendar invite reaches ${email || 'your inbox'} within one working day.`,
                    'On the call we decide together whether any of it is worth building.',
                  ].map((text, i) => (
                    <li key={text}>
                      <span className="lv-marker">{i + 1}</span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ol>
                <p className="lv-meta">
                  Nothing arrived? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </p>
              </div>
            ) : (
              <div className="lv-slots">
                {SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className="lv-slot"
                    onClick={() => onBook(slot)}
                  >
                    <span>{slot}</span>
                    <span className="lv-slot__action">Pick →</span>
                  </button>
                ))}
              </div>
            )}

            {sendError ? (
              <div className="lv-alert" role="alert">
                <p className="lv-alert__head">That did not go through.</p>
                <p className="lv-alert__body">
                  Your plan is still on screen and your answers are saved on this device. Try
                  again, or email us and we will pick it up from there.
                </p>
                <p className="lv-alert__detail">{sendError}</p>
                <div className="lv-alert__actions">
                  <button type="button" className="lv-alert__retry" onClick={onRetry}>
                    Try again
                  </button>
                  <a className="lv-alert__mail" href={`mailto:${CONTACT_EMAIL}`}>
                    Email us instead
                  </a>
                </div>
              </div>
            ) : null}
          </section>

          <footer className="lv-plan__foot">
            <Link to={ROUTES.whatWeAutomate} className="lv-textlink">
              See how each one is built →
            </Link>
            <Link to={ROUTES.questions} className="lv-textlink">
              Still have questions →
            </Link>
            <Link to={ROUTES.home} className="lv-textlink">
              Back to home →
            </Link>
            <button type="button" className="lv-textlink" onClick={onRestart}>
              Start again
            </button>
          </footer>
        </>
      ) : null}
    </div>
  )
}

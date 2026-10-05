import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { BUSINESS_TYPES, PAINS } from '../domain/pains'
import type { PainId } from '../domain/types'
import { WORKLOADS } from '../domain/intake'
import './figma-intake.css'

type Stage = 1 | 2 | 3 | 'plan' | 'call' | 'received'
const businesses = ['Home services', 'Trades & contracting', 'Health & wellness clinic', 'Professional services', 'Retail or online shop', 'Hospitality or food']
const workloads = WORKLOADS
const introductions = [
  ['A SHORT INTAKE', 'First, tell me what kind of business you run.', 'I use this to keep the rest of the questions relevant to your week, not to put you into a generic category.'],
  ['THE WEEKLY DRAG', 'Where does the week actually go?', 'Pick every job that repeats, interrupts the day, or keeps slipping to later. There is no perfect answer.'],
  ['ONE LAST STEP', 'I will turn this into a short, costed plan.', 'I keep it practical: a clear first move, what it could return to your week, and how I arrived there.'],
]
const outputs = ['The handful of jobs worth handing off first', 'Roughly how many hours that gives back each week', 'What those hours are worth in money', 'The one thing I would fix before anything else']
class SubmissionError extends Error {}

function Marker({ selected }: { selected: boolean }) {
  return selected ? <span className="lv-marker lv-marker--selected" aria-hidden="true"><span className="lv-selected-icon"><img className="lv-circle" src="/figma/imgCircleGeometricCircleRoundDesignShapeShapesShape.svg" alt="" /><img className="lv-check" src="/figma/imgCheckCheckFormValidationCheckmarkSuccessAddAdditionTick.svg" alt="" /></span></span> : <img className="lv-marker" src="/figma/imgLevarumSelectionMarker.svg" alt="" />
}
function Choice({ label, selected, onClick, radio = false, tabIndex = 0 }: { label: string; selected: boolean; onClick: () => void; radio?: boolean; tabIndex?: number }) {
  return <button type="button" className="lv-choice" tabIndex={tabIndex} role={radio ? 'radio' : undefined} aria-checked={radio ? selected : undefined} aria-pressed={radio ? undefined : selected} onClick={onClick}>
    <Marker selected={selected} /><span className="lv-choice-copy">{label}</span>{selected && <span className="lv-selected-label" aria-hidden="true">SELECTED</span>}
  </button>
}
function radioKeyboard(event: KeyboardEvent<HTMLDivElement>, select: (index: number) => void) {
  const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role=radio]'))
  const current = buttons.indexOf(event.target as HTMLButtonElement)
  if (current < 0) return
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : ['ArrowRight', 'ArrowDown'].includes(event.key) ? (current + 1) % buttons.length : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? (current - 1 + buttons.length) % buttons.length : -1
  if (next < 0) return
  event.preventDefault(); select(next); buttons[next].focus()
}

export function FigmaIntake() {
  const [stage, setStage] = useState<Stage>(1)
  const [business, setBusiness] = useState<number | null>(null)
  const [workload, setWorkload] = useState<number | null>(null)
  const [pains, setPains] = useState<PainId[]>([])
  const [attempted, setAttempted] = useState(false)
  const [email, setEmail] = useState('')
  const [preferences, setPreferences] = useState('')
  const [website, setWebsite] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const locked = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const requestId = useRef(crypto.randomUUID())
  const selected = PAINS.filter(p => pains.includes(p.id))
  useEffect(() => { heading.current?.focus(); window.scrollTo(0, 0) }, [stage])
  function go(next: Stage) { setError(''); setAttempted(false); setStage(next) }
  function advance() {
    setAttempted(true)
    if (stage === 1 && (business === null || workload === null)) { setError('Choose a business type and weekly workload before continuing.'); document.querySelector<HTMLButtonElement>(business === null ? '#business-choices button' : '#workload-choices button')?.focus(); return }
    if (stage === 2 && pains.length === 0) { setError('Choose at least one recurring job before continuing.'); document.querySelector<HTMLButtonElement>('#pain-choices button')?.focus(); return }
    go(stage === 1 ? 2 : stage === 2 ? 3 : 'plan')
  }
  async function submit() {
    if (locked.current) return
    if (business === null || workload === null || !pains.length || !consent || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setError('Please complete your email and consent.'); return }
    locked.current = true; setBusy(true); setError('')
    try {
      const response = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20000), body: JSON.stringify({ schemaVersion: 3, requestId: requestId.current, intent: 'call', business: BUSINESS_TYPES[business], workload: workloads[workload], pains, email: email.trim(), preferences, consent, website }) })
      if (!response.ok) throw new SubmissionError(response.status === 429 ? 'Please wait a minute before trying again.' : 'We could not confirm your request. Please try again or email hello@levarum.com.')
      const result = await response.json()
      if (result?.saved !== true) throw new SubmissionError('Your request was not confirmed. Please try again.')
      go('received')
    } catch (cause) {
      setError(cause instanceof SubmissionError ? cause.message : cause instanceof Error && ['TimeoutError', 'AbortError'].includes(cause.name) ? 'The request timed out. Please try again; repeated submissions are safely deduplicated.' : 'We could not confirm your request. Please try again or email hello@levarum.com.')
    }
    finally { locked.current = false; setBusy(false) }
  }
  const step = typeof stage === 'number' ? stage : null
  return <div className="lv-shell">
    <header className="lv-header"><button className="lv-brand" onClick={() => go(1)} disabled={busy}>LEVARUM</button><nav aria-label="Intake navigation"><span>YOUR PLAN</span><img src="/figma/imgSeparator.svg" width="4" height="4" alt="" /><a href="/" onClick={event => { event.preventDefault(); if (!busy) go(1) }}>Back to Levarum</a></nav></header>
    <main key={stage} className={step ? 'lv-workspace' : 'lv-plan-workspace'}>
      {step ? <>
        <aside className="lv-introduction"><div className="lv-progress" aria-label={`Step ${step} of 3`}><div className="lv-progress-labels"><span>STEP {step} OF 3</span><span>About 90 seconds</span></div><div className="lv-track" aria-hidden="true">{[1, 2, 3].map(n => <span key={n} className={n <= step ? 'is-complete' : ''} />)}</div></div>
          <div className="lv-editorial"><p className="lv-eyebrow">{introductions[step - 1][0]}</p><h1 ref={heading} tabIndex={-1}>{introductions[step - 1][1]}</h1><p className="lv-secondary">{introductions[step - 1][2]}</p></div>
          {step === 2 ? <div className="lv-guidance"><p>SELECT ALL THAT APPLY</p><p className="lv-secondary">I use these choices to find the strongest place to start.</p></div> : <div className="lv-trust"><img src="/figma/imgMarker.svg" width="8" height="8" alt="" /><span>{step === 1 ? 'About 90 seconds. No account, no card.' : 'You see the opportunity before I ask for any contact details.'}</span></div>}
        </aside>
        <section className={step === 3 ? 'lv-build' : 'lv-paper'} aria-label={`Step ${step} questions`}>
          {step === 1 ? <>
            <div className="lv-question"><h2 id="business-heading">What kind of business do you run?</h2><p className="lv-small lv-secondary">Choose the closest fit.</p><div className="lv-choices lv-choices--grid" id="business-choices" role="radiogroup" aria-labelledby="business-heading" aria-invalid={attempted && business === null} aria-describedby={attempted && business === null ? "business-error" : undefined} onKeyDown={e => radioKeyboard(e, i => { setBusiness(i) })}>{businesses.map((label, i) => <Choice key={label} label={label} selected={business === i} radio tabIndex={business === i || (business === null && i === 0) ? 0 : -1} onClick={() => { setBusiness(i) }} />)}</div>{attempted && business === null && <p id="business-error" className="lv-error">Choose a business type.</p>}</div>
            <div className="lv-question"><h2 id="workload-heading">How much back-office work lands with you in a normal week?</h2><div className="lv-choices lv-choices--grid" id="workload-choices" role="radiogroup" aria-labelledby="workload-heading" aria-invalid={attempted && workload === null} aria-describedby={attempted && workload === null ? "workload-error" : undefined} onKeyDown={e => radioKeyboard(e, i => { setWorkload(i) })}>{workloads.map((label, i) => <Choice key={label} label={label} selected={workload === i} radio tabIndex={workload === i || (workload === null && i === 0) ? 0 : -1} onClick={() => { setWorkload(i) }} />)}</div>{attempted && workload === null && <p id="workload-error" className="lv-error">Choose a weekly workload.</p>}</div>
          </> : step === 2 ? <><div className="lv-question"><h2 id="pains-heading">Which of these takes your time?</h2><p className="lv-small lv-secondary">Choose as many as you need.</p><div id="pain-choices" className="lv-choices" role="group" aria-labelledby="pains-heading" aria-describedby={attempted && pains.length === 0 ? "pains-error" : undefined}>{PAINS.map(p => <Choice key={p.id} label={p.label} selected={pains.includes(p.id)} onClick={() => { setPains(previous => previous.includes(p.id) ? previous.filter(id => id !== p.id) : [...previous, p.id]) }} />)}</div>{attempted && pains.length === 0 && <p id="pains-error" className="lv-error">Choose at least one recurring job.</p>}</div></> : <>
            <div><h2 className="lv-sentence">Your plan will contain</h2><p className="lv-small lv-secondary">Only the parts that help you decide what is worth changing first.</p></div><div className="lv-output-grid">{outputs.map((text, i) => <section className="lv-output" key={text}><div className="lv-small lv-point"><span>0{i + 1}</span><span className="lv-secondary">IN YOUR PLAN</span></div><h2>{text}</h2></section>)}</div>
          </>}
          {error && (step === 1 ? business === null || workload === null : step === 2 ? pains.length === 0 : true) && <p className="lv-error" role="alert">{error}</p>}
          <div className="lv-actions">{step === 1 ? <p className="lv-small lv-secondary">You can change these later.</p> : <button className="lv-button lv-button--quiet" onClick={() => go(step === 2 ? 1 : 2)}>Back</button>}<div className="lv-primary"><button className="lv-button" onClick={advance}>{step === 3 ? 'Build my plan' : 'Continue'}</button>{step === 3 && <p className="lv-small lv-secondary">No account, no card.</p>}</div></div>
        </section>
      </> : stage === 'plan' ? <>
        <div className="lv-plan-heading"><div><p className="lv-eyebrow">YOUR PLAN</p><h1 ref={heading} tabIndex={-1}>A practical place to start.</h1><p className="lv-secondary">This is the full useful structure. Each variable field is filled from your own answers rather than example claims.</p></div><button className="lv-button lv-button--quiet" onClick={() => window.print()}>Print / save plan</button></div>
        <div className="lv-plan-grid">
          {[['Priorities', 'The recurring jobs worth handing off first, ordered by usefulness.', 'ORDERED FROM YOUR ANSWERS'], ['Weekly hours returned', 'A transparent estimate tied to the work you selected.', 'CALCULATED FROM YOUR INTAKE'], ['Value of those hours', 'The value section uses your own inputs, not a market average.', 'YOUR INPUT-BASED VALUE'], ['The first thing I would fix', 'One clear recommendation, with the reason it comes first.', 'YOUR FIRST MOVE']].map(([title, subtitle, label], i) => <section className="lv-plan-section" key={title}><div className="lv-point lv-small"><span className="lv-secondary">0{i + 1}</span><span>BASED ON YOUR INTAKE</span></div><h2>{title}</h2><p className="lv-small lv-secondary">{subtitle}</p><div className="lv-result"><p className="lv-small lv-secondary">{label}</p>{i === 0 ? <ul>{selected.map(p => <li key={p.id}>{p.opp}</li>)}</ul> : i === 1 || i === 2 ? <><p>Not estimated from these answers.</p><p className="lv-small lv-secondary">{i === 1 ? 'The plan explains which answers contribute to this estimate.' : 'No savings or return is invented when the needed input is missing.'}</p></> : <p>{selected[0]?.discovery}</p>}</div></section>)}
        </div><div className="lv-actions"><div className="lv-trust"><img src="/figma/imgMarker.svg" width="8" height="8" alt="" /><span>The plan is yours to print or save. A call is optional and does not unlock anything else.</span></div><button className="lv-button" onClick={() => go('call')}>Request a 15-min call</button></div>
      </> : <section className="lv-paper lv-contact">
        {stage === 'call' ? <><button className="lv-button lv-button--quiet" disabled={busy} onClick={() => go('plan')}>Back to my plan</button><h1 ref={heading} tabIndex={-1}>Let’s find a time.</h1><p className="lv-secondary">Request a 15-minute conversation. Nothing is booked yet.</p><form onSubmit={e => { e.preventDefault(); void submit() }}>
          <label htmlFor="email">Your email</label><input id="email" type="email" autoComplete="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} required />
          <label htmlFor="preferences">Good times and your time zone (optional)</label><textarea id="preferences" maxLength={500} rows={3} value={preferences} onChange={e => setPreferences(e.target.value)} />
          <div className="lv-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label></div>
          <label className="lv-consent"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} /><span>I agree that Levarum can store my intake and contact me about it. <a href="/privacy" target="_blank" rel="noreferrer">Privacy notice</a>.</span></label>
          {error && <p role="alert" className="lv-error">{error}</p>}<button className="lv-button" type="submit" disabled={busy}>{busy ? 'Saving your request…' : 'Send my call request'}</button>
        </form></> : <><h1 ref={heading} tabIndex={-1}>Call request received.</h1><p>Your request is saved. Levarum will contact <strong>{email}</strong> to arrange a time. This is not a confirmed appointment.</p><button className="lv-button" onClick={() => go('plan')}>Return to my Game Plan</button></>}
      </section>}
    </main><footer className="lv-footer"><button onClick={() => go(1)} disabled={busy}>LEVARUM</button><div><a href="/privacy">Privacy</a><a href="mailto:hello@levarum.com">hello@levarum.com</a><span>One lever, whole operation.</span></div></footer>
  </div>
}

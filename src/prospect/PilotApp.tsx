import { useRef, useState } from 'react'
import { BUSINESS_TYPES, HOURS_BANDS, PAINS } from '../domain/pains'
import type { HoursBand, PainId } from '../domain/types'
import './prospect.css'

type Stage = 'intake' | 'plan' | 'call' | 'received'

export function PilotApp() {
  const [stage, setStage] = useState<Stage>('intake')
  const [business, setBusiness] = useState('')
  const [hours, setHours] = useState<HoursBand | ''>('')
  const [pains, setPains] = useState<PainId[]>([])
  const [email, setEmail] = useState('')
  const [preferences, setPreferences] = useState('')
  const [website, setWebsite] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const locked = useRef(false)
  const requestIds = useRef({ plan: crypto.randomUUID(), call: crypto.randomUUID() })
  const selected = PAINS.filter(p => pains.includes(p.id))

  function go(next: Stage) { setStage(next); setError(''); window.scrollTo(0, 0) }

  async function submit(intent: 'plan' | 'call') {
    if (locked.current) return
    if (!business || !hours || !pains.length || !consent || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please complete the business details, select at least one challenge, and enter your email and consent.')
      return
    }
    locked.current = true; setBusy(true); setError('')
    try {
      const response = await fetch('/api/leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({ requestId: requestIds.current[intent], intent, business, hours, pains, email: email.trim(), preferences: intent === 'call' ? preferences : '', consent, website }),
      })
      if (!response.ok) throw new Error(response.status === 429 ? 'Please wait a minute before trying again.' : 'We could not confirm your request. Please try again or email hello@levarum.com.')
      const result = await response.json()
      if (result.saved !== true) throw new Error('Your request was not confirmed. Please try again.')
      go(intent === 'plan' ? 'plan' : 'received')
    } catch (cause) {
      setError(cause instanceof Error && cause.name !== 'TimeoutError' ? cause.message : 'The request timed out. Please try again; repeated submissions are safely deduplicated.')
    } finally { locked.current = false; setBusy(false) }
  }

  return <div className="p-canvas"><main className="p-frame pilot-frame">
    <header className="p-topbar"><a className="p-wordmark" href="/">Levarum</a><span className="p-step-count">One lever, whole operation.</span></header>
    {stage === 'intake' ? <>
      <div className="p-eyebrow">LESS REPETITION. MORE ROOM TO WORK.</div>
      <h1 className="p-h1">Find the work you can hand off.</h1>
      <p className="p-lede">Tell us where your week goes. Get a short Game Plan of opportunities to explore, then request a 15-minute conversation with Levarum.</p>
      <form onSubmit={e => { e.preventDefault(); void submit('plan') }}>
        <label className="p-field-label" htmlFor="business">What kind of business is this?</label>
        <select id="business" className="p-input" value={business} required onChange={e => setBusiness(e.target.value)}><option value="">Select your business type</option>{BUSINESS_TYPES.map(v => <option key={v}>{v}</option>)}</select>
        <label className="p-field-label" htmlFor="hours">Hours spent on back-office work each week</label>
        <select id="hours" className="p-input" value={hours} required onChange={e => setHours(e.target.value as HoursBand)}><option value="">Select your weekly hours</option>{HOURS_BANDS.map(v => <option key={v}>{v}</option>)}</select>
        <fieldset className="pilot-fieldset"><legend className="p-field-label">Where does that time go? Select at least one.</legend>
          <div className="p-pains">{PAINS.map(p => <label className="p-pain pilot-choice" key={p.id}><input type="checkbox" checked={pains.includes(p.id)} onChange={() => setPains(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])} /><span>{p.label}</span></label>)}</div>
        </fieldset>
        <label className="p-field-label" htmlFor="email">Your email</label>
        <input id="email" className="p-input" type="email" autoComplete="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@yourbusiness.com" />
        <div className="pilot-trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} /></label></div>
        <label className="pilot-consent"><input type="checkbox" checked={consent} required onChange={e => setConsent(e.target.checked)} /><span>I agree that Levarum can store my intake and contact me about it. <a href="/privacy" target="_blank" rel="noreferrer">Privacy notice</a>.</span></label>
        <button className="p-cta" disabled={busy} type="submit">{busy ? 'Saving your intake…' : 'Show my Game Plan'}</button>
        <p className="p-caption">Your plan appears here. No account, no payment, no marketing subscription.</p>
      </form>
    </> : null}
    {stage === 'plan' ? <>
      <div className="p-eyebrow">YOUR GAME PLAN</div><h1 className="p-h1">A little less on your plate.</h1>
      <p className="p-lede">Based on your {business.toLowerCase()} intake and {hours.toLowerCase()} back-office hours per week, these are the opportunities to investigate.</p>
      <div className="p-opps">{selected.map((p, i) => <section className="p-opp" key={p.id}><div className="p-opp-title">{i + 1}. {p.opp}</div><p>{p.discovery}</p></section>)}</div>
      <aside className="p-fix"><div className="p-fix-eyebrow">START WITH ONE REPEATED TASK</div><p>Choose the task you do most often, note how long it takes, and bring an example to the call. We’ll check what can be simplified and what needs a person.</p></aside>
      <p className="p-math">This is an initial checklist, not a savings forecast or quote. We need to understand your actual process before estimating time saved, costs, or a delivery timeline.</p>
      <button type="button" className="p-cta" onClick={() => go('call')}>Request a 15-minute call</button>
      <button type="button" className="p-cta p-cta--quiet" onClick={() => window.print()}>Print or save my plan</button>
      <p className="p-caption">Your intake is saved. A call is optional.</p>
    </> : null}
    {stage === 'call' ? <>
      <button type="button" className="p-back" onClick={() => go('plan')} disabled={busy}>← Back to my plan</button>
      <h1 className="p-h1">Let’s find a time.</h1><p className="p-lede">Request a 15-minute conversation. We’ll contact you at <strong>{email}</strong> to arrange a time. Nothing is booked yet.</p>
      <form onSubmit={e => { e.preventDefault(); void submit('call') }}>
        <label className="p-field-label" htmlFor="preferences">Good times and your time zone (optional)</label>
        <textarea id="preferences" className="p-input" maxLength={500} rows={3} placeholder="For example: weekday afternoons, Eastern time" value={preferences} onChange={e => setPreferences(e.target.value)} />
        <p className="p-caption">Please don’t include sensitive client or payment information.</p>
        <button type="submit" className="p-cta" disabled={busy}>{busy ? 'Saving your request…' : 'Send my call request'}</button>
      </form>
    </> : null}
    {stage === 'received' ? <>
      <div className="p-tick" aria-hidden="true">✓</div><h1 className="p-confirm-h">Call request received.</h1>
      <p className="p-confirm-sub">Your request is saved. Levarum will contact <strong>{email}</strong> to arrange a time. This is not a confirmed appointment.</p>
      <p>Need to add anything? Email <a href="mailto:hello@levarum.com">hello@levarum.com</a>.</p>
      <button type="button" className="p-cta p-cta--quiet" onClick={() => go('plan')}>Return to my Game Plan</button>
    </> : null}
    {error ? <p className="p-error" role="alert">{error}</p> : null}
    <footer className="pilot-footer"><p>Levarum helps small businesses simplify repetitive work.</p><a href="mailto:hello@levarum.com">hello@levarum.com</a><span> · </span><a href="/privacy">Privacy</a></footer>
  </main></div>
}

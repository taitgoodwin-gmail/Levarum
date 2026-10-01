import {useEffect, useRef, useState, type FormEvent} from 'react'
import {GUIDANCE} from '../domain/guidance'
import {SubmissionError,SubmissionForm} from './SubmissionForm'
import {useSubmission} from './useSubmission'

export type TaskId = keyof typeof GUIDANCE
export function ContactRequest({tasks=[],visible=true,onBack}:{tasks?:TaskId[];visible?:boolean;onBack?:()=>void}) {
 const [email,setEmail]=useState(''),[message,setMessage]=useState('')
 const [intent,setIntent]=useState<'plan'|'call'>('plan'),[preferences,setPreferences]=useState('')
 const [consent,setConsent]=useState(false),[website,setWebsite]=useState('')
 const [receipt,setReceipt]=useState<{email:string;intent:'plan'|'call'}|null>(null)
 const {submit,busy,error,setError}=useSubmission()
 const heading=useRef<HTMLHeadingElement>(null)
 const taskKey=tasks.join(',')
 useEffect(()=>{if(visible)heading.current?.focus({preventScroll:!receipt})},[visible,receipt])
 useEffect(()=>{setConsent(false);setReceipt(null)},[taskKey])
 async function send(event:FormEvent){
  event.preventDefault()
  if(!consent||!message.trim())return
  const sent={email:email.trim(),intent}
  const payload={schemaVersion:2,intent,email,pains:tasks,message,preferences:intent==='call'?preferences:'',consent,website}
  if(await submit('/api/leads',payload))setReceipt(sent)
 }
 return <section className={`lv-form-page lv-r2-contact${receipt?' lv-r2-receipt':''}`} hidden={!visible} aria-label="Contact request">
  <div className="lv-r2-contact-intro">
   <p className="lv-eyebrow">{receipt?'REQUEST RECEIVED':'LET’S TALK ABOUT YOUR WORK'}</p>
   <h1 tabIndex={-1} ref={heading}>{receipt?'Thanks — we’ve received your request.':<>Tell us what<br/>you need.</>}</h1>
   {!receipt&&<p className="lv-lead">Describe the work you want to make easier. We’ll review your request and reply by email.</p>}
  </div>
  {receipt?<div className="lv-r2-receipt-body lv-stack"><p>We’ll review what you shared and reply to <strong>{receipt.email}</strong>.</p>{receipt.intent==='call'&&<p>We’ll arrange a time by email. Your call is not booked yet.</p>}<a className="lv-button" href="/">Back to Levarum</a>{onBack&&<button className="lv-inline-button" onClick={onBack}>Back to task ideas</button>}</div>:<div className="lv-r2-form-wrap">
   {tasks.length>0&&<p className="lv-contact-context">Selected {tasks.length===1?'task':'tasks'}: {tasks.map(t=>GUIDANCE[t].task).join(', ')}</p>}
   <SubmissionForm busy={busy} onSubmit={send}>
    <div className="lv-field"><label htmlFor="message">What would you like help with?</label><textarea id="message" required maxLength={1000} value={message} onChange={e=>{setMessage(e.target.value);e.target.setCustomValidity(!e.target.value.trim()?'Describe the work you would like help with.':'')}} aria-describedby="message-help"/><p id="message-help" className="lv-small lv-muted">Tell us what happens today and which tools you use. Please leave out passwords, payment information and sensitive client details.</p></div>
    <div className="lv-field"><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></div>
    <label className="lv-r2-checkbox"><input id="prefer-call" type="checkbox" checked={intent==='call'} onChange={e=>{setIntent(e.target.checked?'call':'plan');setConsent(false);setError('')}}/>I’d prefer a call (optional)</label>
    {intent==='call'&&<div className="lv-field"><label htmlFor="preferences">Availability and timezone <span className="lv-muted">(optional)</span></label><textarea id="preferences" maxLength={500} value={preferences} onChange={e=>setPreferences(e.target.value)}/><p id="preferences-help" className="lv-small lv-muted">We’ll arrange a time by email. This does not book a call.</p></div>}
    <label className="lv-consent lv-r2-checkbox"><input id="consent" type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/>I agree that Levarum can store these details and contact me about this request.</label>
    <a className="lv-r2-privacy" href="/privacy" target="_blank" rel="noreferrer">Privacy notice<span className="lv-sr-only"> (opens a new tab)</span></a>
    <label className="lv-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label>
    <SubmissionError message={error}/>
    <button className="lv-button" disabled={busy}>{busy?'Sending…':'Send request'}</button>
    <p className="lv-small lv-muted lv-r2-draft-note">Your draft clears if you refresh this page.</p>
    {onBack&&<button type="button" className="lv-inline-button" disabled={busy} onClick={onBack}>Back to task ideas</button>}
   </SubmissionForm>
  </div>}
 </section>
}

import {useEffect, useRef, useState, type FormEvent} from 'react'
import {CURRENT_BUSINESSES} from '../domain/public'
import {GUIDANCE} from '../domain/guidance'
import {SubmissionError,SubmissionForm} from './SubmissionForm'
import {useSubmission} from './useSubmission'
export type TaskId = keyof typeof GUIDANCE
export function ContactRequest({tasks=[],visible=true,onBack}:{tasks?:TaskId[];visible?:boolean;onBack?:()=>void}) {
 const [email,setEmail]=useState(''),[message,setMessage]=useState(''),[business,setBusiness]=useState('')
 const [intent,setIntent]=useState<'plan'|'call'>('plan'),[preferences,setPreferences]=useState('')
 const [consent,setConsent]=useState(false),[website,setWebsite]=useState('')
 const [receipt,setReceipt]=useState<{email:string;intent:'plan'|'call'}|null>(null)
 const {submit,busy,error,setError}=useSubmission();const heading=useRef<HTMLHeadingElement>(null)
 useEffect(()=>{if(visible)heading.current?.focus()},[visible,receipt])
 useEffect(()=>{setConsent(false);setReceipt(null)},[tasks.join(',')])
 async function send(event:FormEvent){event.preventDefault();if(!consent)return
  const sent={email,intent};const payload={schemaVersion:2,intent,email,...(business?{business}:{}),pains:tasks,message,preferences:intent==='call'?preferences:'',consent,website}
  if(await submit('/api/leads',payload))setReceipt(sent)
 }
 return <section className="lv-form-page" hidden={!visible} aria-label="Contact request">
  <p className="lv-eyebrow">{receipt?'REQUEST RECEIVED':'LET’S TALK ABOUT YOUR WORK'}</p>
  <h1 tabIndex={-1} ref={heading}>{receipt?'Your request is saved.':'Discuss your work.'}</h1>
  {receipt?<div className="lv-card lv-stack"><p>Levarum will review your request and reply to <strong>{receipt.email}</strong>.</p><p>{receipt.intent==='call'?'Your call request is saved. We will agree a time by email. This is not a confirmed appointment.':'Your email follow-up request is saved. No automatic email has been sent.'}</p>{onBack?<button className="lv-button secondary" onClick={onBack}>Back to task ideas</button>:<a className="lv-button secondary" href="/start">Explore a task</a>}<a href="mailto:hello@levarum.com">hello@levarum.com</a></div>:<>
  <p className="lv-lead">Tell us what keeps repeating. We’ll review your request and reply by email.</p>
  {tasks.length>0&&<p className="lv-contact-context">Selected {tasks.length===1?'task':'tasks'}: {tasks.map(t=>GUIDANCE[t].task).join(', ')}</p>}
  <SubmissionForm busy={busy} onSubmit={send}>
   <div className="lv-field"><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></div>
   <div className="lv-field"><label htmlFor="message">What would you like help with? {tasks.length>0&&<span className="lv-muted">(Optional)</span>}</label><textarea id="message" required={!tasks.length} maxLength={1000} value={message} onChange={e=>{setMessage(e.target.value);e.target.setCustomValidity(!tasks.length&&!e.target.value.trim()?"Describe the work you would like help with.":"")}} aria-describedby="message-help"/><p id="message-help" className="lv-small lv-muted">Describe the task and the tools you use. Please leave out passwords, payment information and sensitive client details.</p></div>
   <div className="lv-field"><label htmlFor="business">Business type <span className="lv-muted">(Optional)</span></label><select id="business" value={business} onChange={e=>setBusiness(e.target.value)}><option value="">Leave unspecified</option>{CURRENT_BUSINESSES.map(b=><option key={b}>{b}</option>)}</select></div>
   <fieldset><legend>How would you like to follow up?</legend><div className="lv-stack">{([['plan','Email follow-up'],['call','Request a call']] as const).map(([value,label])=><label className="lv-native-choice" key={value}><input type="radio" name="intent" checked={intent===value} onChange={()=>{setIntent(value);setConsent(false);setError('')}}/>{label}</label>)}</div></fieldset>
   {intent==='call'&&<div className="lv-field"><label htmlFor="preferences">Availability and timezone <span className="lv-muted">(Optional)</span></label><textarea id="preferences" maxLength={500} value={preferences} onChange={e=>setPreferences(e.target.value)}/><p className="lv-small lv-muted">A request does not book an appointment. We arrange calls by email.</p></div>}
   <label className="lv-consent"><input id="consent" type="checkbox" required checked={consent} onChange={e=>setConsent(e.target.checked)}/>I agree that Levarum can store these details and contact me about this {intent==='call'?'call':'follow-up'} request. <a href="/privacy" target="_blank" rel="noreferrer">Privacy notice (opens a new tab)</a>.</label>
   <label className="lv-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label>
   <SubmissionError message={error}/>
   <button className="lv-button" disabled={busy}>{busy?'Saving your request…':intent==='call'?'Send my call request':'Send my follow-up request'}</button>
   <p className="lv-small lv-muted">Your request is saved privately for manual review. Drafts stay in this tab and clear when you refresh.</p>
   {onBack&&<button type="button" className="lv-button secondary" disabled={busy} onClick={onBack}>Back to task ideas</button>}
  </SubmissionForm></>}
 </section>
}

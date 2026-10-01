import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
/** Restore a useful keyboard position after disabling controls for an async save. */
export function SubmissionError({message}:{message:string}){
 const alert=useRef<HTMLParagraphElement>(null)
 useEffect(()=>{if(message)alert.current?.focus()},[message])
 return message?<p ref={alert} tabIndex={-1} role="alert" className="lv-error">{message}</p>:null
}
const FieldErrors=createContext<Record<string,string>>({})
export function FieldValidation({name}:{name:string}){
 const error=useContext(FieldErrors)[name]
 return error?<p className="lv-error" id={`${name}-validation`}>{error}</p>:null
}
function fieldMessage(input:HTMLInputElement){
 const key=input.id||input.name
 if(key==='email'||key==='partner-email')return input.validity.valueMissing?'Enter your email address.':'Enter a valid email address.'
 const messages:Record<string,string>={message:'Describe the work you would like help with.','partner-name':'Enter your name.',craft:'Describe your work and experience.',contribution:'Choose how you would like to contribute.',consent:'Confirm that Levarum may store these details and contact you.'}
 return messages[key]||input.validationMessage
}
/** Keep native validation and expose persistent, associated error text. */
export function SubmissionForm({children,onSubmit,busy=false}:{children:ReactNode;onSubmit:(event:FormEvent<HTMLFormElement>)=>void;busy?:boolean}){
 const [errors,setErrors]=useState<Record<string,string>>({})
 return <FieldErrors.Provider value={errors}><form className="lv-card" onSubmit={onSubmit} onInvalid={event=>{
  const input=event.target as HTMLInputElement
  const id=input.id||input.name
  if(!id)return
  const descriptions=new Set((input.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean))
  descriptions.add(`${id}-validation`)
  input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby',[...descriptions].join(' '))
  setErrors(values=>({...values,[id]:fieldMessage(input)}))
 }} onChange={event=>{
  const input=event.target
  if(!(input instanceof HTMLInputElement||input instanceof HTMLTextAreaElement||input instanceof HTMLSelectElement))return
  const id=input.id||input.name
  if(id&&input.validity?.valid){
   const peers=input instanceof HTMLInputElement&&input.type==='radio'?[...event.currentTarget.querySelectorAll<HTMLInputElement>('input[type=radio]')].filter(peer=>peer.name===input.name):[input]
   for(const peer of peers){
    peer.removeAttribute('aria-invalid')
    const descriptions=(peer.getAttribute('aria-describedby')||'').split(/\s+/).filter(value=>value&&value!==`${id}-validation`)
    if(descriptions.length)peer.setAttribute('aria-describedby',descriptions.join(' '));else peer.removeAttribute('aria-describedby')
   }
   setErrors(values=>{const copy={...values};delete copy[id];return copy})
  }
 }}><fieldset disabled={busy} className="lv-stack" style={{border:0,padding:0,margin:0,minWidth:0}}>{children}</fieldset></form></FieldErrors.Provider>
}

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
/** Restore a useful keyboard position after disabling controls for an async save. */
export function SubmissionError({message}:{message:string}){
 const alert=useRef<HTMLParagraphElement>(null)
 useEffect(()=>{if(message)alert.current?.focus()},[message])
 return message?<p ref={alert} tabIndex={-1} role="alert" className="lv-error">{message}</p>:null
}
/** Keep native validation and expose persistent, associated error text. */
export function SubmissionForm({children,onSubmit,busy=false}:{children:ReactNode;onSubmit:(event:FormEvent<HTMLFormElement>)=>void;busy?:boolean}){
 const [errors,setErrors]=useState<Record<string,string>>({})
 return <form className="lv-card" onSubmit={onSubmit} onInvalid={event=>{
  const input=event.target as HTMLInputElement
  const id=input.id||input.name
  if(!id)return
  const descriptions=new Set((input.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean))
  descriptions.add(`${id}-validation`)
  input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby',[...descriptions].join(' '))
  setErrors(values=>({...values,[id]:input.validationMessage}))
 }} onInput={event=>{
  const input=event.target as HTMLInputElement
  const id=input.id||input.name
  if(id&&input.validity?.valid){
   input.removeAttribute('aria-invalid')
   const descriptions=(input.getAttribute('aria-describedby')||'').split(/\s+/).filter(value=>value&&value!==`${id}-validation`)
   if(descriptions.length)input.setAttribute('aria-describedby',descriptions.join(' '));else input.removeAttribute('aria-describedby')
   setErrors(values=>{const copy={...values};delete copy[id];return copy})
  }
 }}><fieldset disabled={busy} className="lv-stack" style={{border:0,padding:0,margin:0,minWidth:0}}>{children}</fieldset>{Object.entries(errors).map(([id,message])=><p className="lv-error" id={`${id}-validation`} key={id}>{message}</p>)}</form>
}

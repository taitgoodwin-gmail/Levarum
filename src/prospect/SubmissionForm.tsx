import { useState, type FormEvent, type ReactNode } from 'react'
/** Keep native validation and expose persistent, associated error text. */
export function SubmissionForm({children,onSubmit,busy=false}:{children:ReactNode;onSubmit:(event:FormEvent<HTMLFormElement>)=>void;busy?:boolean}){
 const [errors,setErrors]=useState<Record<string,string>>({})
 return <form className="lv-card" onSubmit={onSubmit} onInvalid={event=>{
  const input=event.target as HTMLInputElement
  const id=input.id||input.name
  if(!id)return
  input.setAttribute('aria-invalid','true');input.setAttribute('aria-describedby',`${id}-validation`)
  setErrors(values=>({...values,[id]:input.validationMessage}))
 }} onInput={event=>{
  const input=event.target as HTMLInputElement
  const id=input.id||input.name
  if(id&&input.validity?.valid){input.removeAttribute('aria-invalid');input.removeAttribute('aria-describedby');setErrors(values=>{const copy={...values};delete copy[id];return copy})}
 }}><fieldset disabled={busy} className="lv-stack" style={{border:0,padding:0,margin:0,minWidth:0}}>{children}</fieldset>{Object.entries(errors).map(([id,message])=><p className="lv-error" id={`${id}-validation`} key={id}>{message}</p>)}</form>
}

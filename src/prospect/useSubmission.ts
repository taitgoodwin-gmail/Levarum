import { useRef, useState } from 'react'
export function useSubmission() {
 const ids=useRef<Record<string,string>>({})
 const active=useRef(false)
 const [busy,setBusy]=useState(false)
 const [error,setError]=useState('')
 async function submit(endpoint:string, body:Record<string,unknown>) {
  if(active.current)return false
  active.current=true;setBusy(true);setError('')
  const key=endpoint+JSON.stringify(body)
  const requestId=ids.current[key]??(ids.current[key]=crypto.randomUUID())
  try {
   const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,requestId}),signal:AbortSignal.timeout(20000)})
   if(!response.ok)throw new Error(response.status===429?'Please wait a moment, then try again. Your details are still here.':'We couldn’t confirm your request was received. Please try again, or email hello@levarum.com.')
   const result=await response.json()
   if(result?.saved!==true)throw new Error('We couldn’t confirm your request was received. Your details are still here. Please try again.')
   return true
  }catch(e){
   if(e instanceof Error&&e.name==='TimeoutError')setError('We couldn’t confirm your request was received. Your details are still here. Please try again.')
   else if(e instanceof TypeError)setError('We couldn’t connect. Check your connection and try again. Your details are still here.')
   else if(e instanceof SyntaxError)setError('We couldn’t confirm your request was received. Your details are still here. Please try again.')
   else setError(e instanceof Error?e.message:'We couldn’t confirm your request was received. Your details are still here. Please try again.')
   return false
  }
  finally{active.current=false;setBusy(false)}
 }
 return {submit,busy,error,setError}
}

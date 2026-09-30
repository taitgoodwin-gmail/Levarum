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
   if(!response.ok)throw new Error(response.status===429?'Please wait a minute before trying again.':'We could not save your request. Try again or email hello@levarum.com.')
   const result=await response.json()
   if(result.saved!==true)throw new Error('Your request was not confirmed. Please try again.')
   return true
  }catch(e){setError(e instanceof Error&&e.name!=='TimeoutError'?e.message:'The request timed out. Your answers are still here; you can retry safely.');return false}
  finally{active.current=false;setBusy(false)}
 }
 return {submit,busy,error,setError}
}

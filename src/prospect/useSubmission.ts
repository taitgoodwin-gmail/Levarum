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
  }catch(e){
   if(e instanceof Error&&e.name==='TimeoutError')setError('The request timed out. Your answers are still here; you can retry safely.')
   else if(e instanceof TypeError)setError('We could not connect. Your answers are still here. Check your connection and try again, or email hello@levarum.com.')
   else if(e instanceof SyntaxError)setError('We could not confirm whether your request was saved. Your answers are still here; you can retry safely.')
   else setError(e instanceof Error?e.message:'We could not confirm your request. Your answers are still here; please try again.')
   return false
  }
  finally{active.current=false;setBusy(false)}
 }
 return {submit,busy,error,setError}
}

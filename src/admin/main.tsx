import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider, SignIn, useAuth, useClerk } from '@clerk/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import '../styles/levarum/index.css'
import '../styles/site.css'
import './admin.css'

type Status = 'New' | 'Contacted' | 'Booked' | 'Done'
type Row = {id:string;kind:'plan'|'call'|'partner';received_at:string;status:Status;version:number}
type Inbox = {leads:Row[];total:number;counts:{status:Status;count:number}[];sync:{last_complete:string|null;in_progress:boolean}}
type Detail = {record:Row;lead:Record<string,unknown>;events:{old_status:Status;new_status:Status;actor:string;created_at:string;version:number}[]}
const statuses:Status[] = ['New','Contacted','Booked','Done']
const kinds = {plan:'Game Plan',call:'Call request',partner:'Partner interest'}
const date = (value:string) => new Date(value).toLocaleString()

function Dashboard() {
 const {isLoaded,isSignedIn,getToken,userId} = useAuth()
 const {signOut} = useClerk()
 const [inbox,setInbox] = useState<Inbox|null>(null), [detail,setDetail] = useState<Detail|null>(null)
 const [error,setError] = useState(''), [busy,setBusy] = useState(false), [denied,setDenied] = useState(false)
 const [page,setPage] = useState(0), [kind,setKind] = useState(''), [status,setStatus] = useState('')
 const [revision,setRevision] = useState(0), [signingOut,setSigningOut] = useState(false)
 const generation = useRef(0), active = useRef(false)
 const heading = useRef<HTMLHeadingElement>(null)
 const pendingMutation = useRef<{id:string;status:Status;version:number;mutationId:string}|null>(null)
 const clear = useCallback(() => { generation.current++; setInbox(null); setDetail(null); pendingMutation.current=null },[])
 const api = useCallback(async <T,>(action:string, body?:unknown):Promise<T> => {
  const token = await getToken()
  if (!token) { clear();setDenied(true);setBusy(false);setError('Session ended. Sign out, then sign in again.');throw new Error('Session ended. Please sign in again.') }
  const response = await fetch(`/api/admin?${action}`, {method:body===undefined?'GET':'POST',cache:'no-store',headers:{Authorization:`Bearer ${token}`,...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)})
  const data = await response.json()
  if (!response.ok) {
   if(response.status===401||response.status===403){clear();setDenied(true);setBusy(false);setError(data.error||'Access denied. Please sign in again.')}
   throw new Error(data.error||'Could not complete the request. Please retry.')
  }
  return data as T
 },[getToken,clear])
 useEffect(() => {clear();setDenied(false)},[userId,isSignedIn,clear])
 useEffect(() => {
  const hide=()=>clear()
  const show=()=>setRevision(v=>v+1)
  window.addEventListener('pagehide',hide);window.addEventListener('pageshow',show)
  return()=>{window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show)}
 },[clear])
 useEffect(() => {
  if(!isSignedIn||signingOut)return
  const epoch=++generation.current
  setBusy(true);setError('');setInbox(null);setDetail(null)
  const id=location.pathname.match(/^\/admin\/leads\/([a-f\d]{64})\/?$/)?.[1]
  const load=id?api<Detail>(`action=detail&id=${id}`).then(value=>{if(epoch===generation.current)setDetail(value)}):api<Inbox>(`page=${page}&kind=${kind}&status=${status}`).then(value=>{if(epoch===generation.current)setInbox(value)})
  void load.catch(e=>{if(epoch===generation.current)setError(e instanceof Error?e.message:'Request failed')}).finally(()=>{if(epoch===generation.current){setBusy(false);heading.current?.focus()}})
  return()=>{generation.current++}
 },[isSignedIn,signingOut,page,kind,status,revision,api])
 async function logout(){setSigningOut(true);clear();setError('');try{await signOut();location.replace('/admin/sign-in')}catch{setError('Sign-out could not complete. Retry to end your session.');setSigningOut(false);setDenied(true)}}
 async function mutate(action:'sync'|'status',next?:Status){
  if(active.current)return
  active.current=true;setBusy(true);setError('')
  const epoch=generation.current
  try{
   if(action==='status'&&detail&&next){
    const prior=pendingMutation.current
    const body=prior&&prior.id===detail.record.id&&prior.status===next&&prior.version===detail.record.version?prior:{id:detail.record.id,status:next,version:detail.record.version,mutationId:crypto.randomUUID()}
    pendingMutation.current=body
    await api('action=status',body)
    pendingMutation.current=null
   }else if(action==='sync')await api('action=sync',{})
   if(epoch===generation.current)setRevision(v=>v+1)
  }catch(e){if(epoch===generation.current)setError(e instanceof Error?e.message:'Request failed')}
  finally{active.current=false;if(epoch===generation.current)setBusy(false)}
 }
 if(!isLoaded)return <p role="status">Loading sign-in…</p>
 if(!isSignedIn)return <section className="lv-form-page"><p className="lv-eyebrow">PRIVATE OWNER ACCESS</p><h1>Sign in.</h1><p>Review requests and manage follow-up.</p><SignIn routing="hash" forceRedirectUrl="/admin" signUpUrl={undefined}/></section>
 return <><header className="admin-header"><a href="/admin" aria-label="Levarum inbox">Levarum <span>ADMIN</span></a><button className="lv-button secondary" onClick={()=>void logout()} disabled={signingOut}>Sign out</button></header><main className="lv-admin" id="admin-main"><p className="lv-eyebrow">SUBMISSIONS INBOX</p><h1 tabIndex={-1} ref={heading}>{detail?'Request details.':'A little less to carry.'}</h1>{error&&<div role="alert" className="lv-error"><p>{error}</p>{!denied&&<button className="lv-button secondary" onClick={()=>setRevision(v=>v+1)}>Refresh</button>}</div>}{busy&&<p role="status">Working…</p>}{!denied&&!signingOut&&<>
 {inbox&&<><p>Review new requests, reply personally, and keep track of the next step.</p><p className="lv-muted">Indexed requests only. Last full reconciliation: {inbox.sync.last_complete?date(inbox.sync.last_complete):'Not completed'}.{inbox.sync.in_progress?' More records remain to synchronize.':''}</p><div className="admin-counts">{statuses.map(s=><div className="lv-card" key={s}><span>{s}</span><strong>{inbox.counts.find(c=>c.status===s)?.count||0}</strong></div>)}</div><div className="lv-admin-toolbar"><label>Request type <select value={kind} onChange={e=>{setPage(0);setKind(e.target.value)}}><option value="">All types</option>{Object.entries(kinds).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label><label>Status <select value={status} onChange={e=>{setPage(0);setStatus(e.target.value)}}><option value="">All statuses</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></label><button className="lv-button secondary" disabled={busy} onClick={()=>void mutate('sync')}>{inbox.sync.in_progress?'Continue reconciliation':'Reconcile saved requests'}</button></div>{!inbox.leads.length&&<p className="lv-card">No indexed requests match these filters.</p>}{inbox.leads.map(r=><article className="lv-card lv-admin-row" key={r.id}><div><p className="lv-eyebrow">{r.status}</p><h2>{kinds[r.kind]}</h2><p>Received {date(r.received_at)}</p><p className="lv-muted">Reference {r.id.slice(0,12)}</p></div><a className="lv-button secondary" href={`/admin/leads/${r.id}`}>View request</a></article>)}<div className="lv-actions"><button className="lv-button secondary" disabled={page===0||busy} onClick={()=>setPage(v=>v-1)}>Previous</button><p>Page {page+1} · {inbox.total} matching requests</p><button className="lv-button secondary" disabled={(page+1)*25>=inbox.total||busy} onClick={()=>setPage(v=>v+1)}>Next</button></div></>}
 {detail&&<section className="lv-card lv-admin-detail"><a href="/admin">← Back to inbox</a><h2>{kinds[detail.record.kind]}</h2><p>{detail.record.status} · Received {date(detail.record.received_at)}</p><dl>{['name','email','business','hours','pains','craft','contribution','preferences','consent'].filter(key=>detail.lead[key]!==undefined).map(key=><div key={key}><dt>{key==='preferences'?'Availability requested (not a booking)':key}</dt><dd>{Array.isArray(detail.lead[key])?(detail.lead[key] as unknown[]).join(', '):String(detail.lead[key])}</dd></div>)}</dl>{typeof detail.lead.email==='string'&&<p><a href={`mailto:${encodeURIComponent(detail.lead.email)}`}>Reply by email</a></p>}<h3>Move to</h3><p>Status changes do not send email or create a meeting. Use Booked only after agreeing an appointment.</p><div className="lv-actions">{statuses.filter(s=>s!=='Booked'||detail.record.kind==='call').map(s=><button key={s} className="lv-button secondary" disabled={busy||s===detail.record.status} onClick={()=>void mutate('status',s)}>{s}</button>)}</div><h3>Status history</h3>{!detail.events.length?<p>No status changes yet.</p>:<ol className="lv-admin-history">{detail.events.map(event=><li key={event.version}>{event.old_status} → {event.new_status}<br/>{date(event.created_at)} · {event.actor}</li>)}</ol>}</section>}
 </>}</main></>
}
const root=document.getElementById('root')!
const key=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
createRoot(root).render(<StrictMode>{key?<ClerkProvider publishableKey={key} signInUrl="/admin/sign-in" afterSignOutUrl="/admin/sign-in"><Dashboard/></ClerkProvider>:<main className="lv-form-page"><p className="lv-eyebrow">PRIVATE OWNER ACCESS</p><h1>Admin setup is in progress.</h1><p>Secure sign-in is not configured for this environment yet. No requests are available here.</p><a href="/">Back to Levarum</a></main>}</StrictMode>)

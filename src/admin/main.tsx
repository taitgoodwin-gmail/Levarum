import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider, SignIn, SignUp, useAuth, useClerk } from '@clerk/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import '../styles/levarum/index.css'
import '../styles/site.css'
import './admin.css'
import { Logo } from '../ui/core/Logo.jsx'
import { PUBLIC_PAINS } from '../domain/public'
import { ThemeToggle } from '../ui/navigation/ThemeToggle.jsx'

type Status = 'New' | 'Contacted' | 'Booked' | 'Done'
type Row = {id:string;kind:'plan'|'call'|'partner';received_at:string;status:Status;version:number}
type Inbox = {leads:Row[];total:number;counts:{status:Status;count:number}[];sync:{last_complete:string|null;in_progress:boolean}}
type Detail = {record:Row;lead:Record<string,unknown>;events:{old_status:Status;new_status:Status;actor:string;created_at:string;version:number}[]}
const statuses:Status[] = ['New','Contacted','Booked','Done']
const kinds = {plan:'Follow-up request',call:'Call request',partner:'Partner interest'}
const date = (value:string) => new Date(value).toLocaleString()
const fieldLabels:Record<string,string> = {name:'Name',email:'Email',business:'Business type',hours:'Weekly hours on admin',pains:'Tasks to explore',craft:'Work and experience',contribution:'Interested in helping with',preferences:'Availability requested (not a booking)',consent:'Consent to store answers and respond'}
function fieldValue(key:string,value:unknown) {
 if(key==='consent')return value===true?'Given':'Not recorded'
 if(key==='pains'&&Array.isArray(value))return value.map(id=>PUBLIC_PAINS.find(p=>p.id===id)?.label||String(id)).join('\n')
 if(key==='hours')return `${String(value)} hours`
 return String(value||'Not supplied')
}
const initialFilters = new URLSearchParams(location.search)
const initialPage = Number(initialFilters.get('page')||'0')

function Dashboard() {
 const {isLoaded,isSignedIn,getToken,userId} = useAuth()
 const {signOut} = useClerk()
 const [inbox,setInbox] = useState<Inbox|null>(null), [detail,setDetail] = useState<Detail|null>(null)
 const [error,setError] = useState(''), [busy,setBusy] = useState(false), [denied,setDenied] = useState(false)
 const [page,setPage] = useState(Number.isSafeInteger(initialPage)&&initialPage>=0?initialPage:0), [kind,setKind] = useState(Object.hasOwn(kinds,initialFilters.get('kind')||'')?initialFilters.get('kind')! : ''), [status,setStatus] = useState(statuses.includes(initialFilters.get('status') as Status)?initialFilters.get('status')!:'')
 const [notice,setNotice] = useState('')
 const filterQuery = new URLSearchParams({page:String(page),kind,status}).toString()
 const [revision,setRevision] = useState(0), [signingOut,setSigningOut] = useState(false)
 const generation = useRef(0), active = useRef(false)
 const heading = useRef<HTMLHeadingElement>(null)
 const pendingMutation = useRef<{id:string;status:Status;version:number;mutationId:string}|null>(null)
 const hideContent = useCallback(() => { generation.current++; setInbox(null); setDetail(null) },[])
 const clear = useCallback(() => { hideContent(); pendingMutation.current=null },[hideContent])
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
 useEffect(() => {clear();setDenied(false);setNotice('')},[userId,isSignedIn,clear])
 useEffect(() => {history.replaceState(null,'',`${location.pathname}?${filterQuery}${location.hash}`)},[filterQuery])
 useEffect(() => {
  if(!isSignedIn||signingOut)return
  let lastRefresh=0
  const refresh=()=>{if(document.visibilityState!=='visible'||Date.now()-lastRefresh<300)return;lastRefresh=Date.now();hideContent();setRevision(v=>v+1)}
  const visibility=()=>{if(document.visibilityState==='hidden')hideContent();else refresh()}
  window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',visibility)
  return()=>{window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',visibility)}
 },[isSignedIn,signingOut,hideContent])
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
  active.current=true;setBusy(true);setError('');setNotice('')
  const epoch=generation.current
  try{
   if(action==='status'&&detail&&next){
    const prior=pendingMutation.current
    const body=prior&&prior.id===detail.record.id&&prior.status===next&&prior.version===detail.record.version?prior:{id:detail.record.id,status:next,version:detail.record.version,mutationId:crypto.randomUUID()}
    pendingMutation.current=body
    const result=await api<{status:Status}>('action=status',body)
    if(epoch===generation.current)setNotice(`Request status is ${result.status}. No email or calendar invitation was sent.`)
    pendingMutation.current=null
   }else if(action==='sync'){const result=await api<{hasMore:boolean}>('action=sync',{});if(epoch===generation.current)setNotice(result.hasMore?'This batch is checked. Continue checking to include the remaining saved requests.':'Check complete. Saved requests are included in the inbox.')}
   if(epoch===generation.current)setRevision(v=>v+1)
  }catch(e){if(epoch===generation.current)setError(e instanceof Error?e.message:'Request failed')}
  finally{active.current=false;if(epoch===generation.current)setBusy(false)}
 }
 if(!isLoaded)return <main className="lv-form-page"><p role="status">Loading sign-in…</p></main>
 if(!isSignedIn)return <main className="lv-form-page"><div className="admin-entry-brand"><Logo href="/" size={28}/><ThemeToggle/></div><p className="lv-eyebrow">PRIVATE OWNER ACCESS</p><h1>{location.pathname==='/admin/enroll'?'Set up owner access.':'Sign in.'}</h1><p>Review requests and manage follow-up.</p>{location.pathname==='/admin/enroll'?<SignUp routing="hash" forceRedirectUrl="/admin" signInUrl="/admin/sign-in"/>:<SignIn routing="hash" forceRedirectUrl="/admin" signUpUrl="/admin/enroll"/>}</main>
 return <><a className="admin-skip" href="#admin-main">Skip to requests</a><header className="admin-header"><div className="admin-brand"><Logo href={`/admin?${filterQuery}`} size={28}/><span>Owner dashboard</span></div><div className="admin-header-actions"><ThemeToggle/><button className="lv-button secondary" onClick={()=>void logout()} disabled={signingOut}>Sign out</button></div></header><main className="lv-admin" id="admin-main" tabIndex={-1}><p className="lv-eyebrow">SUBMISSIONS INBOX</p><h1 tabIndex={-1} ref={heading}>{detail?'Request details':'Requests'}</h1><p className="admin-notice" role="status" aria-live="polite" aria-atomic="true">{notice}</p>{error&&<div role="alert" className="lv-error"><p>{error}</p>{!denied&&<button className="lv-button secondary" onClick={()=>setRevision(v=>v+1)}>Refresh request data</button>}</div>}{busy&&<p role="status">Working…</p>}{!denied&&!signingOut&&<>
 {inbox&&<><p>Open a request, reply from hello@levarum.com, then update its status. Replies and scheduling are handled by email.</p><div className="admin-counts">{statuses.map(s=><div className="lv-card" key={s}><span>{s}</span><strong>{inbox.counts.find(c=>c.status===s)?.count||0}</strong></div>)}</div><div className="lv-admin-toolbar"><label>Request type <select value={kind} onChange={e=>{setPage(0);setKind(e.target.value)}}><option value="">All types</option>{Object.entries(kinds).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label><label>Status <select value={status} onChange={e=>{setPage(0);setStatus(e.target.value)}}><option value="">All statuses</option>{statuses.map(s=><option key={s}>{s}</option>)}</select></label></div>{!inbox.leads.length&&<p className="lv-card">No indexed requests match these filters.</p>}{inbox.leads.map(r=><article className="lv-card lv-admin-row" key={r.id}><div><p className="lv-eyebrow">{r.status}</p><h2>{kinds[r.kind]}</h2><p>Received {date(r.received_at)}</p><p className="lv-muted">Reference {r.id.slice(0,12)}</p></div><a className="lv-button secondary" href={`/admin/leads/${r.id}?${filterQuery}`}>View request</a></article>)}<div className="lv-actions"><button className="lv-button secondary" disabled={page===0||busy} onClick={()=>setPage(v=>v-1)}>Previous</button><p>Page {page+1} · {inbox.total} matching requests</p><button className="lv-button secondary" disabled={(page+1)*25>=inbox.total||busy} onClick={()=>setPage(v=>v+1)}>Next</button></div><details className="admin-maintenance"><summary>Check for missing requests</summary><p>Submissions are saved privately before they appear here. If a saved request is missing, check the private store to bring it into the inbox. This does not send email or change statuses.</p><p className="lv-muted">Last complete check: {inbox.sync.last_complete?date(inbox.sync.last_complete):'Not completed'}.{inbox.sync.in_progress?' More saved requests remain to check.':''}</p><button className="lv-button secondary" disabled={busy} onClick={()=>void mutate('sync')}>{inbox.sync.in_progress?'Continue checking':'Check saved requests'}</button></details></>}
 {detail&&<section className="lv-card lv-admin-detail"><a href={`/admin?${filterQuery}`}>← Back to requests</a><h2>{kinds[detail.record.kind]}</h2><p>{detail.record.status} · Received {date(detail.record.received_at)}</p><dl>{['name','email','business','hours','pains','craft','contribution','preferences','consent'].filter(key=>detail.lead[key]!==undefined).map(key=><div key={key}><dt>{fieldLabels[key]}</dt><dd>{fieldValue(key,detail.lead[key])}</dd></div>)}</dl>{typeof detail.lead.email==='string'&&<p><a href={`mailto:${encodeURIComponent(detail.lead.email)}`}>Reply by email</a></p>}<h3>Update status</h3><p>Status changes do not send email or create a meeting. Use Booked only after agreeing an appointment.</p><div className="lv-actions">{statuses.filter(s=>s!=='Booked'||detail.record.kind==='call').map(s=><button key={s} className="lv-button secondary" disabled={busy||s===detail.record.status} onClick={()=>void mutate('status',s)}>{s}</button>)}</div><h3>Status history</h3>{!detail.events.length?<p>No status changes yet.</p>:<ol className="lv-admin-history">{detail.events.map(event=><li key={event.version}>{event.old_status} → {event.new_status}<br/>{date(event.created_at)} · {event.actor}</li>)}</ol>}</section>}
 </>}</main></>
}
try { const theme=localStorage.getItem('levarum.theme.v1'); document.documentElement.dataset.theme=theme==='dark'||theme==='light'?theme:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light' } catch {}
const root=document.getElementById('root')!
const key=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
createRoot(root).render(<StrictMode>{key?<ClerkProvider publishableKey={key} signInUrl="/admin/sign-in" afterSignOutUrl="/admin/sign-in"><Dashboard/></ClerkProvider>:<main className="lv-form-page"><p className="lv-eyebrow">PRIVATE OWNER ACCESS</p><h1>Admin setup is in progress.</h1><p>Secure sign-in is not configured for this environment yet. No requests are available here.</p><a href="/">Back to Levarum</a></main>}</StrictMode>)

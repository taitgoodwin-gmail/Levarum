import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider, SignIn, useAuth, useClerk } from '@clerk/react'
import './admin.css'

type Status = 'new' | 'in-progress' | 'waiting' | 'closed'
type Row = { id: string; kind: string; received_at: string; status: Status; version: number; summary?: { sender: string; task: string } | null }
type Inbox = { leads: Row[]; total: number; counts: { status: Status; count: number }[]; sync: { last_complete: string | null; in_progress: boolean } }
type Detail = { record: Row; lead: Record<string, unknown>; source: { record: Row; lead: Record<string, unknown> } | null; events: { old_status: Status; new_status: Status; actor: string; created_at: string }[] }
const statuses: Status[] = ['new', 'in-progress', 'waiting', 'closed']
const pretty = (s: string) => s.replace(/-/g, ' ').replace(/^./, c => c.toUpperCase())

function Queue() {
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { signOut } = useClerk()
  const [inbox, setInbox] = useState<Inbox | null>(null)
  const [detail, setDetail] = useState<Detail | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [page, setPage] = useState(0)
  const [refresh, setRefresh] = useState(0)

  async function api<T>(query: string, body?: unknown): Promise<T> {
    const token = await getToken()
    if (!token) throw new Error('Sign in again to view the queue.')
    const response = await fetch(`/api/admin?${query}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: { Authorization: `Bearer ${token}`, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store', signal: AbortSignal.timeout(20000),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'The queue is unavailable. Try again.')
    return data as T
  }

  useEffect(() => {
    if (!isSignedIn) { setInbox(null); setDetail(null); return }
    let active = true
    setBusy(true); setError('')
    void api<Inbox>(`action=list&page=${page}`).then(result => { if (active) setInbox(result) }).catch(e => { if (active) setError(e instanceof Error ? e.message : 'The queue is unavailable.') }).finally(() => { if (active) setBusy(false) })
    return () => { active = false; setInbox(null); setDetail(null) }
  }, [isSignedIn, page, refresh])

  async function open(id: string) {
    setBusy(true); setError('')
    try { setDetail(await api<Detail>(`action=detail&id=${encodeURIComponent(id)}`)) }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not open the request.') }
    finally { setBusy(false) }
  }
  async function change(status: Status) {
    if (!detail) return
    setBusy(true); setError('')
    try {
      await api('action=status', { id: detail.record.id, status, version: detail.record.version, mutationId: crypto.randomUUID() })
      await open(detail.record.id)
      setRefresh(v => v + 1)
    } catch (e) { setError(e instanceof Error ? e.message : 'Status may have changed. Refresh this request before trying again.') }
    finally { setBusy(false) }
  }
  async function sync() {
    setBusy(true); setError('')
    try { await api('action=sync', {}); setRefresh(v => v + 1) }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not refresh saved requests.') }
    finally { setBusy(false) }
  }

  if (!isLoaded) return <main className="admin-shell">Loading sign in…</main>
  if (!isSignedIn) return <main className="admin-shell"><h1>Levarum private queue</h1><SignIn routing="hash" /></main>
  return <main className="admin-shell">
    <header><h1>Levarum private queue</h1><button onClick={() => { setInbox(null); setDetail(null); void signOut() }}>Sign out</button></header>
    <p>Saved requests are private. A call request is not a booking.</p>
    {error && <p role="alert" className="admin-error">{error}</p>}
    {detail ? <section aria-label="Request details">
      <button onClick={() => { setDetail(null); setRefresh(v => v + 1) }}>← Back to queue</button>
      <h2>{pretty(detail.record.kind)} request</h2>
      <p>Received {new Date(detail.record.received_at).toLocaleString()} · {pretty(detail.record.status)}</p>
      <dl>{Object.entries(detail.lead).filter(([key]) => !['website'].includes(key)).map(([key, value]) => <div key={key}><dt>{pretty(key)}</dt><dd>{Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value) : String(value ?? 'Not collected')}</dd></div>)}</dl>
      {detail.source && <section><h3>Source intake</h3><p>Saved {new Date(detail.source.record.received_at).toLocaleString()}</p><dl>{Object.entries(detail.source.lead).map(([key, value]) => <div key={key}><dt>{pretty(key)}</dt><dd>{Array.isArray(value) ? value.join(', ') : String(value ?? 'Not collected')}</dd></div>)}</dl></section>}
      <h3>Working status</h3><div className="admin-actions">{statuses.map(status => <button key={status} disabled={busy || status === detail.record.status} onClick={() => void change(status)}>{pretty(status)}</button>)}</div>
      <h3>Status history</h3><ul>{detail.events.map((event, index) => <li key={index}>{pretty(event.old_status)} → {pretty(event.new_status)} · {new Date(event.created_at).toLocaleString()}</li>)}</ul>
    </section> : <section>
      <div className="admin-actions"><button disabled={busy} onClick={() => void sync()}>Find saved requests</button><button disabled={busy} onClick={() => setRefresh(v => v + 1)}>Refresh</button></div>
      {busy && <p role="status">Loading…</p>}
      {inbox && <><p>{inbox.total} requests · {inbox.counts.map(c => `${pretty(c.status)}: ${c.count}`).join(' · ')}</p>
        <ul className="admin-list">{inbox.leads.map(row => <li key={row.id}><button onClick={() => void open(row.id)}><strong>{row.summary?.sender || 'Saved request'}</strong><span>{row.summary?.task || 'Open for details'}</span><small>{pretty(row.kind)} · {pretty(row.status)} · {new Date(row.received_at).toLocaleString()}</small></button></li>)}</ul>
        <div className="admin-actions"><button disabled={page === 0 || busy} onClick={() => setPage(p => p - 1)}>Previous</button><button disabled={(page + 1) * 25 >= inbox.total || busy} onClick={() => setPage(p => p + 1)}>Next</button></div>
      </>}
    </section>}
  </main>
}

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
createRoot(document.getElementById('root')!).render(<StrictMode>{key ? <ClerkProvider publishableKey={key}><Queue /></ClerkProvider> : <main className="admin-shell" role="alert">Private queue configuration is incomplete.</main>}</StrictMode>)

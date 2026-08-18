import type { Lead } from '../domain/types'

/**
 * Browser side of the console's auth and lead list.
 *
 * The console holds no secret and makes no decision about who is signed in: it
 * asks the server, which checks a signed HttpOnly cookie the browser cannot
 * read. That is the difference between this and the gate it replaces — the old
 * one was a boolean in React state, so "signed in" was a thing the client
 * decided about itself.
 *
 * Every call sends credentials, because the cookie is the whole session.
 */

export interface SessionState {
  signedIn: boolean
  /** False when no operator credential is set on this deployment. */
  configured: boolean
}

async function json<T>(res: Response): Promise<T> {
  const text = await res.text()
  return (text ? JSON.parse(text) : {}) as T
}

export async function readSession(): Promise<SessionState> {
  try {
    const res = await fetch('/api/session', { credentials: 'same-origin' })
    if (!res.ok) return { signedIn: false, configured: false }
    return await json<SessionState>(res)
  } catch {
    return { signedIn: false, configured: false }
  }
}

export interface SignInResult {
  ok: boolean
  error?: string
}

export async function signIn(user: string, password: string): Promise<SignInResult> {
  try {
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ user, password }),
    })
    if (res.ok) return { ok: true }
    const payload = await json<{ error?: string }>(res)
    return { ok: false, error: payload.error ?? 'That did not match.' }
  } catch {
    return { ok: false, error: 'Could not reach the server.' }
  }
}

export async function signOut(): Promise<void> {
  try {
    await fetch('/api/session', { method: 'DELETE', credentials: 'same-origin' })
  } catch {
    // The cookie expires on its own; a failed sign-out is not a stuck session.
  }
}

export interface LeadsResult {
  leads: Lead[]
  /** 'kv' when leads are durable, 'memory' when this instance is all there is. */
  storage: 'kv' | 'memory'
  error?: string
}

/**
 * Fetch the server's lead list.
 *
 * The server is the record of truth. The on-device store stays as the offline
 * fallback and the cross-tab change feed, so a failure here leaves the console
 * showing what the device knows rather than showing nothing.
 */
export async function fetchLeads(): Promise<LeadsResult | null> {
  try {
    const res = await fetch('/api/leads', { credentials: 'same-origin' })
    if (!res.ok) return null
    return await json<LeadsResult>(res)
  } catch {
    return null
  }
}

export async function patchLeadStatus(id: string, status: Lead['status']): Promise<boolean> {
  try {
    const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ status }),
    })
    return res.ok
  } catch {
    return false
  }
}

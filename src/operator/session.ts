import type { Lead } from '../domain/types'
import { hydrateLeads } from '../store/submissions'

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

/**
 * Why the endpoint could not be believed, when it could not be.
 *
 * The console used to return `configured: false` for every one of these, and
 * the sign-in screen rendered that as "no operator credential is set on this
 * deployment". So a missing function, a platform auth wall, an HTML error page
 * and a genuinely unset credential all produced the same sentence — one which
 * is only true for the last of them, and which sends the reader off to check
 * environment variables that were never the problem.
 *
 * A screen cannot report a cause it was never told. These are the causes.
 */
export type SessionFault =
  /** 404: no function answered. The endpoint is not deployed. */
  | 'missing'
  /** 401/403, or HTML where JSON belongs: something in front of the app
      intercepted the request. On Vercel that is Deployment Protection. */
  | 'protected'
  /** 2xx, but not JSON — an interstitial or error page served as success. */
  | 'not-json'
  /** 5xx: the function ran and failed. */
  | 'erroring'
  /** The request never completed. Offline, DNS, CORS. */
  | 'unreachable'

export interface SessionState {
  signedIn: boolean
  /**
   * Whether the *server* said a credential is configured. Only meaningful when
   * `fault` is null — otherwise nothing was heard from the server at all.
   */
  configured: boolean
  /** Null when the endpoint answered properly. */
  fault: SessionFault | null
  /** The status seen, for the fault message. */
  status?: number
}

async function json<T>(res: Response): Promise<T> {
  const text = await res.text()
  return (text ? JSON.parse(text) : {}) as T
}

export async function readSession(): Promise<SessionState> {
  let res: Response
  try {
    res = await fetch('/api/session', {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    })
  } catch {
    return { signedIn: false, configured: false, fault: 'unreachable' }
  }

  const type = res.headers.get('content-type') ?? ''
  const isJson = type.includes('application/json')

  if (!res.ok) {
    // 404 is the endpoint not existing. 401/403 on *this* route can only come
    // from in front of the app: /api/session answers 200 whether or not anyone
    // is signed in, so it never issues either itself.
    const fault: SessionFault =
      res.status === 404
        ? 'missing'
        : res.status === 401 || res.status === 403
          ? 'protected'
          : res.status >= 500
            ? 'erroring'
            : 'protected'
    return { signedIn: false, configured: false, fault, status: res.status }
  }

  // A 200 carrying HTML is an interstitial wearing a success code.
  if (!isJson) {
    return { signedIn: false, configured: false, fault: 'not-json', status: res.status }
  }

  try {
    const payload = await json<{ signedIn?: boolean; configured?: boolean }>(res)
    return {
      signedIn: Boolean(payload.signedIn),
      configured: Boolean(payload.configured),
      fault: null,
      status: res.status,
    }
  } catch {
    return { signedIn: false, configured: false, fault: 'not-json', status: res.status }
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
    const payload = await json<{ leads?: unknown; storage?: LeadsResult['storage'] }>(res)
    // The server stores the intake, not the derived draft, so every record has
    // to be hydrated before the console can render it. Same function the
    // on-device store uses, so both paths produce identical Leads.
    return { leads: hydrateLeads(payload.leads), storage: payload.storage ?? 'memory' }
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

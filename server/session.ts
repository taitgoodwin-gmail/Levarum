import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * Server-side auth for the operator console.
 *
 * This replaces the client-side gate, which was never authentication: it was a
 * boolean in React state, and anyone who opened the console could set it. The
 * console's own screen said so.
 *
 * What this is instead: a signed, HttpOnly, SameSite=Strict session cookie
 * issued only after a credential check against the environment, and required
 * by every read of the lead list. The signature is an HMAC over the expiry, so
 * the server holds no session table and a stolen cookie expires on its own.
 *
 * What it is deliberately not, yet: multi-user, revocable before expiry, or
 * rate-limited beyond the constant-time compare. It is one operator and one
 * credential, which is the shape of the business today. The next step, when
 * there is a second operator, is a real identity provider — not more of this.
 */

const COOKIE = 'lv_session'
const TTL_MS = 12 * 60 * 60 * 1000 // One working day, then sign in again.

export interface SessionConfig {
  user: string
  password: string
  secret: string
}

/**
 * Read the credential from the environment.
 *
 * Returns null when unset, which callers must treat as "the console is closed"
 * rather than "the console is open". An unconfigured deployment refusing every
 * sign-in is the safe failure; the alternative is a console with no door.
 */
export function sessionConfig(): SessionConfig | null {
  const user = process.env.OPERATOR_USER
  const password = process.env.OPERATOR_PASSWORD
  if (!user || !password) return null
  // With no explicit secret, derive one from the password. It is stable across
  // requests on one deployment, which is what signing needs, and it means a
  // password change invalidates every outstanding session.
  const secret = process.env.SESSION_SECRET || `derived:${password}`
  return { user, password, secret }
}

export function isAuthConfigured(): boolean {
  return sessionConfig() !== null
}

/** Constant-time string compare, so a wrong password leaks no timing. */
function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) {
    // Still compare something, so length alone is not a fast path.
    timingSafeEqual(left, left)
    return false
  }
  return timingSafeEqual(left, right)
}

export function checkCredentials(user: unknown, password: unknown): boolean {
  const config = sessionConfig()
  if (!config) return false
  if (typeof user !== 'string' || typeof password !== 'string') return false
  const userOk = safeEqual(user.trim().toLowerCase(), config.user.trim().toLowerCase())
  const passOk = safeEqual(password, config.password)
  // Both are evaluated before the && short-circuits on the result.
  return userOk && passOk
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function issueToken(): string {
  const config = sessionConfig()
  if (!config) throw new Error('Auth is not configured')
  const expires = Date.now() + TTL_MS
  // The nonce makes two sessions issued in the same millisecond distinct.
  const payload = `${expires}.${randomBytes(9).toString('base64url')}`
  return `${payload}.${sign(payload, config.secret)}`
}

export function verifyToken(token: string | undefined): boolean {
  const config = sessionConfig()
  if (!config || !token) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [expires, nonce, signature] = parts

  const expected = sign(`${expires}.${nonce}`, config.secret)
  if (!safeEqual(signature, expected)) return false

  const at = Number(expires)
  return Number.isFinite(at) && at > Date.now()
}

/** Pull one cookie out of a raw Cookie header. */
export function readCookie(header: string | undefined, name = COOKIE): string | undefined {
  if (!header) return undefined
  for (const part of header.split(';')) {
    const at = part.indexOf('=')
    if (at === -1) continue
    if (part.slice(0, at).trim() === name) return decodeURIComponent(part.slice(at + 1).trim())
  }
  return undefined
}

/**
 * HttpOnly so no script can read it, Strict so it never rides a cross-site
 * request, Secure everywhere but local http.
 */
export function sessionCookie(token: string, secure: boolean): string {
  const maxAge = Math.floor(TTL_MS / 1000)
  return [
    `${COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAge}`,
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}

export function clearCookie(secure: boolean): string {
  return [
    `${COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=0',
    secure ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ')
}

export const SESSION_COOKIE = COOKIE

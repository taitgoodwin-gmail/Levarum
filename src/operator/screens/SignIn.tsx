import { useState } from 'react'

import { signIn, type SessionFault } from '../session'
import { ThemeToggle } from '../../components/ThemeToggle'

/**
 * The console's own door.
 *
 * The credential is checked on the server against the environment, and what
 * comes back is a signed HttpOnly cookie this page cannot read — so there is
 * nothing here to set, spoof, or skip past in devtools.
 *
 * On reporting failure: this screen used to have one bad state and one
 * sentence for it — "no operator credential is set on this deployment" — shown
 * whenever /api/session did not come back clean, whatever the reason. That
 * sentence names a cause, and it was wrong for every reason but one. Someone
 * reading it went and checked environment variables that were already correct,
 * and had no way to find out that the request had not reached the server at
 * all. A screen that guesses at a cause is worse than one that admits it does
 * not know, so each fault now says what was actually observed and what to look
 * at next.
 */
interface SignInProps {
  configured: boolean
  fault: SessionFault | null
  status?: number
  onSignedIn: () => void
}

/** What was seen, what it means, and where to look. Never a guess. */
function faultNotice(fault: SessionFault, status?: number) {
  const seen = status ? ` (HTTP ${status})` : ''
  switch (fault) {
    case 'missing':
      return {
        title: `The sign-in endpoint is not deployed${seen}.`,
        body: 'Nothing answered at /api/session, so this build shipped without its serverless functions. This is not an environment-variable problem — check the deployment build log for a compile error in api/.',
      }
    case 'protected':
      return {
        title: `Something in front of the app blocked the request${seen}.`,
        body: '/api/session returns 200 whether or not anyone is signed in, so it never issues this itself — the response came from the platform. On Vercel that is Deployment Protection: turn off Vercel Authentication for Preview, or open this URL through a protection-bypass link.',
      }
    case 'not-json':
      return {
        title: 'The sign-in endpoint answered with a page, not data.',
        body: 'A success code carrying HTML is an interstitial — typically a login or error page served in front of the deployment. The console cannot act on it.',
      }
    case 'erroring':
      return {
        title: `The sign-in endpoint failed${seen}.`,
        body: 'The function ran and threw. The deployment’s runtime logs will have the stack trace.',
      }
    case 'unreachable':
      return {
        title: 'Could not reach the sign-in endpoint.',
        body: 'The request never completed. Check the connection, then reload.',
      }
  }
}

export function SignIn({ configured, fault, status, onSignedIn }: SignInProps) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const notice = fault ? faultNotice(fault, status) : null
  // Only block the form when the server itself said there is no credential.
  // A transport fault is not evidence about the credential either way.
  const closed = !fault && !configured
  const disabled = Boolean(fault) || closed

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user.trim() || !password) return
    setBusy(true)
    setError(null)
    const result = await signIn(user.trim(), password)
    setBusy(false)
    if (result.ok) onSignedIn()
    else setError(result.error ?? 'That did not match.')
  }

  return (
    <form className="op-signin" onSubmit={submit}>
      <div className="op-signin-form">
        <div className="op-signin-mark">
          <span className="op-dot" aria-hidden="true" />
          <span className="op-bar-title">Operator console</span>
          <span className="op-signin-toggle">
            <ThemeToggle />
          </span>
        </div>

        <h1 className="op-signin-h">Sign in.</h1>
        <p className="op-signin-sub">
          This is where Game Plan requests land, and where each one is moved through to a booked
          call. A separate door from the prospect surface, and not reachable from it.
        </p>

        {notice ? (
          <div className="op-signin-closed" role="alert">
            <strong>{notice.title}</strong>
            <p>{notice.body}</p>
            <p className="op-signin-diag">
              Diagnose it in one request: <code>curl -i https://&lt;this-host&gt;/api/health</code>
            </p>
          </div>
        ) : null}

        {closed ? (
          <p className="op-signin-closed" role="alert">
            The server reports that no operator credential is set on this deployment, so the console
            cannot be opened. Set <code>OPERATOR_USER</code> and <code>OPERATOR_PASSWORD</code> in
            the project's environment variables, for this environment, and redeploy.
          </p>
        ) : null}

        <label className="op-signin-label" htmlFor="op-user">
          User
        </label>
        <input
          id="op-user"
          className="op-signin-input"
          autoComplete="username"
          value={user}
          disabled={disabled}
          onChange={(e) => {
            setUser(e.target.value)
            setError(null)
          }}
        />

        <label className="op-signin-label" htmlFor="op-password">
          Password
        </label>
        <input
          id="op-password"
          className="op-signin-input"
          type="password"
          autoComplete="current-password"
          value={password}
          disabled={disabled}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(null)
          }}
        />

        {error ? (
          <p className="op-signin-error" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="op-signin-cta"
          disabled={disabled || busy || !user.trim() || !password}
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="op-signin-foot">
          The session is a signed, HttpOnly cookie issued by the server and good for one working
          day. Nothing about it is stored in this page.
        </p>
      </div>
    </form>
  )
}

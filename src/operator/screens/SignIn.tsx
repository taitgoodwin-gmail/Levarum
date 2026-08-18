import { useState } from 'react'

import { signIn } from '../session'
import { ThemeToggle } from '../../components/ThemeToggle'

/**
 * The console's own door.
 *
 * Real now. The credential is checked on the server against the environment,
 * and what comes back is a signed HttpOnly cookie this page cannot read — so
 * there is nothing here to set, spoof, or skip past in devtools. The screen no
 * longer has to carry a warning that it is only pretending.
 *
 * If the deployment has no credential set, the door stays shut and says why.
 * An unconfigured console that let anyone in would be worse than one that
 * refuses everyone.
 */
interface SignInProps {
  configured: boolean
  onSignedIn: () => void
}

export function SignIn({ configured, onSignedIn }: SignInProps) {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

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

        {configured ? null : (
          <p className="op-signin-closed" role="alert">
            No operator credential is set on this deployment, so the console cannot be opened. Set
            <code> OPERATOR_USER</code> and <code> OPERATOR_PASSWORD</code> in the project's
            environment variables and redeploy.
          </p>
        )}

        <label className="op-signin-label" htmlFor="op-user">
          User
        </label>
        <input
          id="op-user"
          className="op-signin-input"
          autoComplete="username"
          value={user}
          disabled={!configured}
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
          disabled={!configured}
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
          disabled={!configured || busy || !user.trim() || !password}
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

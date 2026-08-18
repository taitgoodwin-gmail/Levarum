import { useState } from 'react'
import { BRAND } from '../../brand'

/**
 * The console's own door.
 *
 * This is the entry point a prospect never sees a link to. Sign in is
 * simulated in this build and labelled as such: it gates the surface, it does
 * not authenticate anyone. Swap it for real auth before this goes anywhere
 * near production data.
 */
interface SignInProps {
  onSignIn: () => void
}

export function SignIn({ onSignIn }: SignInProps) {
  const [email, setEmail] = useState<string>(BRAND.operatorSignInEmail)
  const [code, setCode] = useState('482913')

  const ready = email.trim().length > 0 && code.trim().length > 0

  return (
    <form
      className="op-signin"
      onSubmit={(e) => {
        e.preventDefault()
        if (ready) onSignIn()
      }}
    >
      <div className="op-signin-form">
        <div className="op-signin-mark">
          <span className="op-dot" aria-hidden="true" />
          <span className="op-bar-title">Operator Console</span>
        </div>

        <h1 className="op-signin-h">Internal sign in.</h1>
        <p className="op-signin-sub">
          A separate door from the prospect tool. The console reads the submission store and is
          never reachable from a prospect's flow.
        </p>

        <label className="op-signin-label" htmlFor="op-email">
          Operator email
        </label>
        <input
          id="op-email"
          className="op-signin-input"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="op-signin-label" htmlFor="op-code">
          Passcode
        </label>
        <input
          id="op-code"
          className="op-signin-input op-signin-input--code"
          type="password"
          autoComplete="current-password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button type="submit" className="op-signin-cta" disabled={!ready}>
          Sign in
        </button>
        <p className="op-signin-foot">Simulated sign in. No real auth in this build.</p>
      </div>
    </form>
  )
}

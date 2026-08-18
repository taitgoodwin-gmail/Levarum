import { useState } from 'react'

import { Link, ROUTES } from '../../router'
import { CONTACT_EMAIL } from '../content/site'
import { Eyebrow, Section } from '../components/Section'
import { submitPartner } from '../../store/submit'

/**
 * Partners.
 *
 * The implementation-partner track from REQUIREMENTS.md §5. It needs its own
 * quiet path rather than a second CTA competing with the customer one, which
 * is why nothing on the customer surface links here except one small card
 * below the home CTA and a footer link — and why this page has no nav Start
 * button at all.
 *
 * The lead is written as a partner lead and lands in the same console inbox as
 * a Game Plan request, marked as a different kind, so there is one place to
 * work leads rather than two.
 */

const PLUGS = [
  'Building the automations',
  'Front-desk and ops setup',
  'Finding the businesses',
  'Not sure yet',
]

const PLAINLY = [
  'Paid delivery work on builds that are already sold, not unpaid pilots.',
  'A say in how the standard builds work, while there is still time for your opinion to change them.',
  'No exclusivity, no non-compete, no quota. Keep your own clients.',
  'Honest state of play: early, few clients, terms not finalised. If that is a dealbreaker, better to know now.',
]

export function Partners() {
  const [name, setName] = useState('')
  const [craft, setCraft] = useState('')
  const [plugIn, setPlugIn] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const validate = (): string => {
    if (!name.trim()) return 'A name would help.'
    if (!craft.trim()) return 'Tell me what you do, even roughly.'
    if (!plugIn) return 'Pick where you would plug in.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'That does not look like an email yet.'
    return ''
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const problem = validate()
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    setSending(true)
    await submitPartner({
      name: name.trim(),
      craft: craft.trim(),
      plugIn: plugIn as string,
      email: email.trim(),
    })
    setSending(false)
    setSent(name.trim())
  }

  const again = () => {
    setSent(null)
    setName('')
    setCraft('')
    setPlugIn(null)
    setEmail('')
    setError('')
  }

  return (
    <>
      <Section rung={1} prose>
        <Eyebrow>Implementation partners</Eyebrow>
        <h1 className="lv-h1">Help build these, and help decide how they work.</h1>
        <p className="lv-lead">
          There is more work here than one person can deliver, and plenty that is still undecided.
          If you build automations for small service businesses — or you run a shop that already
          does — put your name down and let us think it through together. Remote, wherever you are.
        </p>
      </Section>

      <Section rung={2} ruled prose>
        {sent ? (
          <div className="lv-card lv-partner__sent" role="status">
            <Eyebrow>On the list</Eyebrow>
            <h2 className="lv-h3">{sent}, you are on the list.</h2>
            <p className="lv-body">
              It has landed in the same inbox the customer requests land in, marked as a partner
              lead. You will hear from a person, not a sequence, and it will be a conversation
              rather than a pitch.
            </p>
            <div className="lv-partner__sentactions">
              <Link to={ROUTES.home} className="lv-textlink">
                Back to the site →
              </Link>
              <button type="button" className="lv-textlink" onClick={again}>
                Add another
              </button>
            </div>
          </div>
        ) : (
          <form className="lv-card lv-partner" onSubmit={submit} noValidate>
            <div>
              <label className="lv-label" htmlFor="p-name">
                Your name
              </label>
              <input
                id="p-name"
                className="lv-field"
                value={name}
                autoComplete="name"
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
              />
            </div>

            <div>
              <label className="lv-label" htmlFor="p-craft">
                What do you do?
              </label>
              <input
                id="p-craft"
                className="lv-field"
                placeholder="Automation shop, ops consultant, freelance builder…"
                value={craft}
                onChange={(e) => {
                  setCraft(e.target.value)
                  setError('')
                }}
              />
            </div>

            <fieldset className="lv-fieldset">
              <legend className="lv-label">Where would you plug in?</legend>
              <div className="lv-optiongrid">
                {PLUGS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="lv-option lv-option--wrap"
                    aria-pressed={plugIn === p}
                    onClick={() => {
                      setPlugIn(p)
                      setError('')
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label className="lv-label" htmlFor="p-email">
                Email
              </label>
              <input
                id="p-email"
                className="lv-field"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                aria-invalid={error ? true : undefined}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
              />
            </div>

            {error ? (
              <p className="lv-error" role="alert">
                {error}
              </p>
            ) : null}

            <button type="submit" className="lv-btn lv-btn--block" disabled={sending}>
              {sending ? 'Putting your name down…' : 'Put my name down'}
            </button>
            <p className="lv-meta">Four fields, no pitch deck. Nothing is shared with anyone else.</p>
          </form>
        )}
      </Section>

      <Section rung="dark">
        <Eyebrow>What this is, plainly</Eyebrow>
        <ul className="lv-list lv-list--arrow">
          {PLAINLY.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="lv-body lv-partner__contact">
          Questions before you sign up? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </Section>
    </>
  )
}

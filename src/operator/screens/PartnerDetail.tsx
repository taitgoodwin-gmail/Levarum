import type { PartnerLead, SubmissionStatus } from '../../domain/types'
import { timeAgo } from '../../domain/estimate'
import { ThemeToggle } from '../../components/ThemeToggle'

/**
 * One partner lead.
 *
 * Deliberately short. There is no intake behind a partner, so there is no plan
 * to draft and nothing to size — showing an empty Game Plan here would invent
 * work that does not exist. Four fields, the same status workflow as a
 * customer lead, and a reply link.
 */
interface PartnerDetailProps {
  lead: PartnerLead
  onBack: () => void
  onSignOut: () => void
  onStatus: (status: SubmissionStatus) => void
}

const STATUS_ACTIONS: { key: SubmissionStatus; label: string }[] = [
  { key: 'new', label: 'Mark new' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'archived', label: 'Archive' },
]

export function PartnerDetail({ lead, onBack, onSignOut, onStatus }: PartnerDetailProps) {
  return (
    <>
      <div className="op-bar">
        <div className="op-bar-row">
          <button type="button" className="op-link" onClick={onBack}>
            ‹ Inbox
          </button>
          <span className="op-bar-actions">
            <ThemeToggle />
            <button type="button" className="op-link" onClick={onSignOut}>
              Sign out
            </button>
          </span>
        </div>
        <div className="op-detail-head">{lead.name}</div>
        <div className="op-detail-meta">
          Partner lead · {timeAgo(lead.createdAt)}
        </div>
      </div>

      <div className="op-body">
        <section className="op-card">
          <div className="op-label">What they said</div>
          <div className="op-intake-grid">
            <div>
              <div className="op-intake-label">What they do</div>
              <div className="op-intake-value">{lead.craft}</div>
            </div>
            <div>
              <div className="op-intake-label">Where they would plug in</div>
              <div className="op-intake-value">{lead.plugIn}</div>
            </div>
            <div>
              <div className="op-intake-label">Email</div>
              <div className="op-intake-value">
                <a className="op-link" href={`mailto:${lead.email}`}>
                  {lead.email}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="op-card">
          <div className="op-label">Before you reply</div>
          <ul className="op-list">
            <li>
              <span>Terms are not finalised. Say so — it was said on the page they signed up on.</span>
            </li>
            <li>
              <span>Paid delivery on sold builds, no exclusivity, no quota.</span>
            </li>
            <li>
              <span>A conversation, not a pitch. They were promised a person.</span>
            </li>
          </ul>
        </section>

        <div className="op-label">Status</div>
        <div className="op-status">
          {STATUS_ACTIONS.map((action) => (
            <button
              key={action.key}
              type="button"
              aria-pressed={lead.status === action.key}
              onClick={() => onStatus(action.key)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

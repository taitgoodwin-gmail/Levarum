import type { Lead } from '../../domain/types'
import { isPlanSubmission } from '../../domain/types'
import { PAINS } from '../../domain/pains'
import { timeAgo } from '../../domain/estimate'
import { ThemeToggle } from '../../components/ThemeToggle'

/**
 * The inbox: every lead, newest first.
 *
 * Two kinds share it, as REQUIREMENTS.md §5 asks — a Game Plan request and an
 * implementation partner — because one place to work leads beats two. The kind
 * is on the row, so the difference is visible before it is opened.
 */

interface InboxProps {
  leads: Lead[]
  /** Where the list came from, stated rather than assumed. */
  storage: 'kv' | 'memory' | 'device'
  onOpen: (id: string) => void
  onSignOut: () => void
}

const STATUS_LABEL: Record<Lead['status'], string> = {
  new: 'New',
  contacted: 'Contacted',
  archived: 'Archived',
}

const STORAGE_NOTE: Record<InboxProps['storage'], string> = {
  kv: 'Stored server-side. Visible from any device.',
  memory:
    'Server has no KV attached, so leads live in the function’s memory and are lost on a cold start. Attach Vercel KV to make them durable.',
  device: 'Could not reach the server. Showing what this device has seen.',
}

function draftState(lead: Lead) {
  if (!isPlanSubmission(lead)) return { label: 'Partner lead', tone: 'partner' as const }
  if (lead.draft.status === 'pending') return { label: 'Drafting…', tone: 'wait' as const }
  if (lead.draft.source === 'fallback') return { label: 'Offline draft', tone: 'offline' as const }
  return { label: 'Draft ready', tone: 'ready' as const }
}

export function Inbox({ leads, storage, onOpen, onSignOut }: InboxProps) {
  const newCount = leads.filter((l) => l.status === 'new').length

  return (
    <>
      <div className="op-bar">
        <div className="op-bar-row">
          <span className="op-bar-mark">
            <span className="op-dot" aria-hidden="true" />
            <span className="op-bar-title">Operator console</span>
          </span>
          <span className="op-bar-actions">
            <ThemeToggle />
            <button type="button" className="op-link" onClick={onSignOut}>
              Sign out
            </button>
          </span>
        </div>
        <div className="op-bar-sub">
          <span className="op-bar-note">Internal. Not linked from the public navigation.</span>
          <span className="op-count">{newCount} new</span>
        </div>
      </div>

      <div className="op-body">
        {leads.length ? (
          <div className="op-inbox">
            {leads.map((lead) => {
              const state = draftState(lead)
              const title = isPlanSubmission(lead) ? lead.business : lead.name
              const detail = isPlanSubmission(lead)
                ? `${PAINS.filter((p) => lead.pains.includes(p.id)).length} named`
                : lead.plugIn
              return (
                <button
                  key={lead.id}
                  type="button"
                  className={lead.status === 'new' ? 'op-inbox-row is-new' : 'op-inbox-row'}
                  onClick={() => onOpen(lead.id)}
                >
                  <span className="op-inbox-top">
                    <span className="op-inbox-business">{title}</span>
                    <span className={`op-badge op-badge--${lead.status}`}>
                      {STATUS_LABEL[lead.status]}
                    </span>
                  </span>
                  <span className="op-inbox-email">{lead.email}</span>
                  <span className="op-inbox-foot">
                    <span>
                      {timeAgo(lead.createdAt)} · {detail}
                    </span>
                    <span className={`op-draft-state op-draft-state--${state.tone}`}>
                      <span className={`op-state-dot op-state-dot--${state.tone}`} />
                      {state.label}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="op-empty">
            <div className="op-empty-title">Nothing has come in yet.</div>
            <div className="op-empty-body">
              Run the intake and unlock a plan. The request lands here.
            </div>
            <a className="op-link" href="/start">
              Open the intake form
            </a>
          </div>
        )}
        <div className="op-foot" data-storage={storage}>
          {STORAGE_NOTE[storage]}
        </div>
      </div>
    </>
  )
}

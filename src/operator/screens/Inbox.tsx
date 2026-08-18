import type { Submission } from '../../domain/types'
import { PAINS } from '../../domain/pains'
import { timeAgo } from '../../domain/estimate'

/** The inbox: every intake that has been unlocked, newest first. */

interface InboxProps {
  submissions: Submission[]
  onOpen: (id: string) => void
  onSignOut: () => void
}

function draftState(sub: Submission) {
  if (sub.draft.status === 'pending') {
    return { label: 'Drafting…', tone: 'wait', color: 'var(--ink)' }
  }
  if (sub.draft.source === 'fallback') {
    return { label: 'Offline draft', tone: 'offline', color: 'var(--ink)' }
  }
  return { label: 'Draft ready', tone: 'ready', color: 'var(--go)' }
}

const STATUS_LABEL: Record<Submission['status'], string> = {
  new: 'New',
  contacted: 'Contacted',
  archived: 'Archived',
}

function statusStyle(status: Submission['status']) {
  if (status === 'new') {
    return { color: 'var(--white)', background: 'var(--ember)', border: '1px solid transparent' }
  }
  if (status === 'contacted') {
    return { color: 'var(--go)', background: 'var(--white)', border: '1px solid var(--go)' }
  }
  return {
    color: 'var(--ink)',
    background: 'var(--warm)',
    border: '1px solid var(--hairline-strong)',
  }
}

export function Inbox({ submissions, onOpen, onSignOut }: InboxProps) {
  const newCount = submissions.filter((s) => s.status === 'new').length

  return (
    <>
      <div className="op-bar">
        <div className="op-bar-row">
          <span className="op-bar-mark">
            <span className="op-dot" aria-hidden="true" />
            <span className="op-bar-title">Operator Console</span>
          </span>
          <button type="button" className="op-link" onClick={onSignOut}>
            Sign out
          </button>
        </div>
        <div className="op-bar-sub">
          <span className="op-bar-note">Intake inbox. Internal, not shown to the prospect.</span>
          <span className="op-count">{newCount} new</span>
        </div>
      </div>

      <div className="op-body">
        {submissions.length ? (
          <div className="op-inbox">
            {submissions.map((sub) => {
              const state = draftState(sub)
              const shorts = PAINS.filter((p) => sub.pains.includes(p.id)).map((p) => p.short)
              return (
                <button
                  key={sub.id}
                  type="button"
                  className={sub.status === 'new' ? 'op-inbox-row is-new' : 'op-inbox-row'}
                  onClick={() => onOpen(sub.id)}
                >
                  <span className="op-inbox-top">
                    <span className="op-inbox-business">{sub.business}</span>
                    <span className="op-badge" style={statusStyle(sub.status)}>
                      {STATUS_LABEL[sub.status]}
                    </span>
                  </span>
                  <span className="op-inbox-email">{sub.email}</span>
                  <span className="op-inbox-foot">
                    <span>
                      {timeAgo(sub.createdAt)} · {shorts.length}{' '}
                      {shorts.length === 1 ? 'pain' : 'pains'}
                    </span>
                    <span className="op-draft-state" style={{ color: state.color }}>
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
            <div className="op-empty-title">No submissions yet</div>
            <div className="op-empty-body">
              Run the prospect flow and unlock a plan. The record lands here.
            </div>
          </div>
        )}
        <div className="op-foot">Stored on this device. Refresh-safe.</div>
      </div>
    </>
  )
}

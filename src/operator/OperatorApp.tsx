import { useCallback, useEffect, useMemo, useState } from 'react'

import './operator.css'

import type { Lead, PainId, SubmissionStatus } from '../domain/types'
import { isPlanSubmission } from '../domain/types'
import { loadSubmissions, mergeServerLeads, subscribe, updateSubmission } from '../store/submissions'
import { resumeStalledDrafts, runDraft } from '../ai/drafting'
import { fetchLeads, patchLeadStatus, readSession, signOut, type SessionFault } from './session'

import { SignIn } from './screens/SignIn'
import { Inbox } from './screens/Inbox'
import { Detail } from './screens/Detail'
import { PartnerDetail } from './screens/PartnerDetail'

/**
 * The operator console.
 *
 * Reached only at /operator, behind server-side auth. It imports nothing from
 * the prospect surface and offers no route back into it: the two surfaces share
 * the lead types and the design tokens, and nothing else.
 *
 * The session is a signed HttpOnly cookie the server issues and this component
 * only ever asks about — see ./session.ts. On load it asks once, so a refresh
 * inside the session window does not mean signing in again, and a console
 * opened without one renders the sign-in screen instead of an inbox.
 */

/** How often the console re-reads the server list while it is open. */
const POLL_MS = 20_000

export function OperatorApp() {
  const [session, setSession] = useState<'checking' | 'out' | 'in'>('checking')
  const [configured, setConfigured] = useState(true)
  // Why /api/session could not be believed, if it could not be. Kept distinct
  // from `configured`: a transport fault says nothing about the credential.
  const [fault, setFault] = useState<SessionFault | null>(null)
  const [faultStatus, setFaultStatus] = useState<number | undefined>(undefined)
  const [leads, setLeads] = useState<Lead[]>([])
  const [storage, setStorage] = useState<'kv' | 'memory' | 'device'>('device')
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    void readSession().then((state) => {
      setConfigured(state.configured)
      setFault(state.fault)
      setFaultStatus(state.status)
      setSession(state.signedIn ? 'in' : 'out')
    })
  }, [])

  /**
   * Pull the server list, falling back to the device store.
   *
   * The server is the record of truth for who exists and where each lead is in
   * the workflow, so its list is reconciled into the local mirror when it
   * answers — see mergeServerLeads, which keeps a finished draft rather than
   * letting a poll undo it. When the server does not answer, the device store
   * still has whatever this browser has seen: a console with a stale list beats
   * a console with none.
   */
  const sync = useCallback(async () => {
    const result = await fetchLeads()
    if (result) {
      const merged = mergeServerLeads(result.leads)
      setLeads(merged)
      setStorage(result.storage)
      // Only the ones still without a finished draft, so a poll does not
      // re-run the drafting call across the whole inbox every twenty seconds.
      resumeStalledDrafts(merged)
      return
    }
    const local = loadSubmissions()
    setLeads(local)
    setStorage('device')
    resumeStalledDrafts(local)
  }, [])

  useEffect(() => {
    if (session !== 'in') return
    void sync()
    // Follow the device store too, so an intake completed in another tab shows
    // up immediately rather than on the next poll.
    const unsubscribe = subscribe(setLeads)
    const timer = window.setInterval(() => void sync(), POLL_MS)
    return () => {
      unsubscribe()
      clearInterval(timer)
    }
  }, [session, sync])

  const open = useMemo(() => leads.find((l) => l.id === openId) ?? null, [openId, leads])

  const setStatus = useCallback(
    (status: SubmissionStatus) => {
      if (!openId) return
      // Optimistic locally, authoritative on the server: the operator sees the
      // change immediately and the next sync confirms it.
      updateSubmission(openId, { status })
      setLeads((prev) => prev.map((l) => (l.id === openId ? { ...l, status } : l)))
      void patchLeadStatus(openId, status).then((ok) => {
        if (ok) void sync()
      })
    },
    [openId, sync],
  )

  const swap = useCallback(
    (painId: PainId, optionId: string) => {
      if (!openId) return
      const updated = updateSubmission(openId, (prev) => {
        if (!isPlanSubmission(prev)) return {}
        return {
          draft: {
            ...prev.draft,
            stack: prev.draft.stack.map((item) =>
              item.painId === painId ? { ...item, optionId } : item,
            ),
          },
        }
      })
      if (updated) setLeads((prev) => prev.map((l) => (l.id === openId ? updated : l)))
    },
    [openId],
  )

  const out = useCallback(() => {
    setOpenId(null)
    setSession('out')
    void signOut()
  }, [])

  if (session === 'checking') {
    return (
      <div className="op-canvas">
        <main className="op-frame">
          <p className="op-checking" role="status">
            Checking your session…
          </p>
        </main>
      </div>
    )
  }

  if (session === 'out') {
    return (
      <div className="op-canvas">
        <main className="op-frame">
          <SignIn
            configured={configured}
            fault={fault}
            status={faultStatus}
            onSignedIn={() => setSession('in')}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="op-canvas">
      <main className="op-frame">
        {open && isPlanSubmission(open) ? (
          <Detail
            submission={open}
            onBack={() => setOpenId(null)}
            onSignOut={out}
            onRegenerate={() => void runDraft(open.id)}
            onStatus={setStatus}
            onSwap={swap}
          />
        ) : open ? (
          <PartnerDetail lead={open} onBack={() => setOpenId(null)} onSignOut={out} onStatus={setStatus} />
        ) : (
          <Inbox leads={leads} storage={storage} onOpen={setOpenId} onSignOut={out} />
        )}
      </main>
    </div>
  )
}

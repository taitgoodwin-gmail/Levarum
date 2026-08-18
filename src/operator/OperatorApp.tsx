import { useCallback, useEffect, useMemo, useState } from 'react'

import './operator.css'

import type { PainId, Submission, SubmissionStatus } from '../domain/types'
import { loadSubmissions, subscribe, updateSubmission } from '../store/submissions'
import { resumeStalledDrafts, runDraft } from '../ai/drafting'

import { SignIn } from './screens/SignIn'
import { Inbox } from './screens/Inbox'
import { Detail } from './screens/Detail'

/**
 * The operator console.
 *
 * Reached only at /operator, behind its own sign in. It imports nothing from
 * the prospect surface and offers no route back into it: the two surfaces
 * share the submission store and the brand tokens, and nothing else.
 *
 * The session is deliberately not persisted, so closing the tab signs out.
 */
export function OperatorApp() {
  const [signedIn, setSignedIn] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [openId, setOpenId] = useState<string | null>(null)

  // Follow the store while the console is open, including writes from the
  // prospect surface in another tab.
  useEffect(() => {
    if (!signedIn) return
    const list = loadSubmissions()
    setSubmissions(list)
    // A tab that closed mid-generation leaves a record pending. Pick those up
    // rather than let them sit at "Drafting..." forever.
    resumeStalledDrafts(list)
    return subscribe(setSubmissions)
  }, [signedIn])

  const open = useMemo(
    () => submissions.find((s) => s.id === openId) ?? null,
    [openId, submissions],
  )

  const setStatus = useCallback(
    (status: SubmissionStatus) => {
      if (openId) updateSubmission(openId, { status })
    },
    [openId],
  )

  const swap = useCallback(
    (painId: PainId, optionId: string) => {
      if (!openId) return
      updateSubmission(openId, (prev) => ({
        draft: {
          ...prev.draft,
          stack: prev.draft.stack.map((item) =>
            item.painId === painId ? { ...item, optionId } : item,
          ),
        },
      }))
    },
    [openId],
  )

  const signOut = useCallback(() => {
    setOpenId(null)
    setSignedIn(false)
  }, [])

  if (!signedIn) {
    return (
      <div className="op-canvas">
        <main className="op-frame">
          <SignIn onSignIn={() => setSignedIn(true)} />
        </main>
      </div>
    )
  }

  return (
    <div className="op-canvas">
      <main className="op-frame">
        {open ? (
          <Detail
            submission={open}
            onBack={() => setOpenId(null)}
            onSignOut={signOut}
            onRegenerate={() => void runDraft(open.id)}
            onStatus={setStatus}
            onSwap={swap}
          />
        ) : (
          <Inbox submissions={submissions} onOpen={setOpenId} onSignOut={signOut} />
        )}
      </main>
    </div>
  )
}

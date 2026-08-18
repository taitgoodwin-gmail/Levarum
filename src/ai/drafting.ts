import type { Draft, DraftResponse, PainId, StackItem, Submission } from '../domain/types'
import { baseDraft } from '../domain/estimate'
import { isValidOption } from '../domain/catalog'
import { getSubmission, updateSubmission } from '../store/submissions'

/**
 * Browser side of the intelligence layer. It calls the app's own endpoint,
 * never the Claude API directly, so no credential is ever in the bundle.
 *
 * Failure is a supported state: if the endpoint is unconfigured or unreachable
 * the deterministic draft stands and is labelled "Offline draft", so the
 * console is never empty and never lies about where the words came from.
 */
const ENDPOINT = import.meta.env.VITE_DRAFT_ENDPOINT ?? '/api/draft'

/** One generation per submission at a time. */
const inFlight = new Set<string>()

export function isDrafting(id: string): boolean {
  return inFlight.has(id)
}

async function fetchDraft(sub: Submission): Promise<DraftResponse | null> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business: sub.business,
        hours: sub.hours,
        pains: sub.pains,
      }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as Partial<DraftResponse>
    if (!data || typeof data.summary !== 'string' || !Array.isArray(data.phases)) return null
    if (!data.summary.trim() || data.phases.length === 0) return null
    return {
      summary: data.summary,
      phases: data.phases,
      picks: Array.isArray(data.picks) ? data.picks : [],
    }
  } catch {
    return null
  }
}

/** Apply Claude's picks over the deterministic stack, ignoring anything unknown. */
function applyPicks(stack: StackItem[], picks: DraftResponse['picks']): StackItem[] {
  return stack.map((item) => {
    const pick = picks.find((p) => p.pain === item.painId)
    if (!pick) return item
    const optionId = isValidOption(item.painId as PainId, pick.option) ? pick.option : item.optionId
    const why = pick.why?.trim() ? pick.why.replace(/\s+/g, ' ').trim() : item.why
    return { ...item, optionId, why }
  })
}

/**
 * Generate (or regenerate) the draft approach for one submission.
 * Resolves once the record has been written back either way.
 */
export async function runDraft(id: string): Promise<void> {
  if (inFlight.has(id)) return
  const sub = getSubmission(id)
  if (!sub) return

  inFlight.add(id)
  // Back to the skeleton first, so a regenerate visibly starts over.
  const skeleton = baseDraft(sub.pains)
  updateSubmission(id, { draft: skeleton })

  try {
    const result = await fetchDraft(sub)
    updateSubmission(id, (prev): Partial<Submission> => {
      const draft: Draft = { ...prev.draft }
      if (!result) {
        draft.status = 'ready'
        draft.source = 'fallback'
        return { draft }
      }
      draft.summary = result.summary
      draft.phases = result.phases.slice(0, 3).map((phase, i) => ({
        n: i + 1,
        title: phase.title,
        detail: phase.detail,
      }))
      draft.stack = applyPicks(draft.stack, result.picks)
      draft.status = 'ready'
      draft.source = 'ai'
      return { draft }
    })
  } finally {
    inFlight.delete(id)
  }
}

/**
 * Pick up drafts left pending by a tab that closed mid-generation. The console
 * calls this on load so a record never sits at "Drafting..." forever.
 */
export function resumeStalledDrafts(subs: Submission[]): void {
  for (const sub of subs) {
    if (sub.draft.status === 'pending' && !inFlight.has(sub.id)) {
      void runDraft(sub.id)
    }
  }
}

import type { HoursBand, Lead, PainId, Submission, SubmissionStatus } from '../domain/types'
import { baseDraft } from '../domain/estimate'
import { defaultStackItem } from '../domain/catalog'
import { isPainId, painsOrDefault } from '../domain/pains'
import { BRAND } from '../brand'

/**
 * The on-device lead store.
 *
 * This is no longer the record of truth — POST /api/submit is, and the console
 * reads the server list first (see src/store/leads.ts). What survives here is
 * the job it was always best at: an offline fallback so a submission made on a
 * phone with no signal is not lost, and a cross-tab change feed so an open
 * console sees a new intake without a reload.
 *
 * Refresh-safe, quota-tolerant, and migrating on read rather than on write, so
 * a record written before a field existed still renders.
 */
const STORE_KEY = `${BRAND.slug}.submissions.v1`

type Listener = (list: Lead[]) => void

let cache: Lead[] | null = null
const listeners = new Set<Listener>()

function readRaw(): unknown {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function write(list: Lead[]): void {
  cache = list
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(list))
  } catch {
    // Private mode or a full quota: the session still works, it just will not
    // survive a refresh. Not worth interrupting the flow over.
  }
  for (const fn of listeners) fn(list)
}

/**
 * Turn raw records into Leads, filling in whatever is missing.
 *
 * Two callers, one job. Records written before a field existed still have to
 * render — `kind` pre-dates the partner track and defaults to a plan. And the
 * server stores the intake only, not the draft: a draft is derived from the
 * answers and regenerable at any time, so persisting one would be storing a
 * cache. Either way, a plan lead arriving without a draft gets the
 * deterministic skeleton here, which is the same one baseDraft() would build
 * and the same one /api/draft later replaces.
 */
export function hydrateLeads(value: unknown): Lead[] {
  if (!Array.isArray(value)) return []
  const out: Lead[] = []
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue
    const rec = raw as Record<string, unknown>
    if (typeof rec.id !== 'string') continue

    if (rec.kind === 'partner') {
      out.push({
        id: rec.id,
        createdAt: typeof rec.createdAt === 'number' ? rec.createdAt : Date.now(),
        kind: 'partner',
        name: String(rec.name ?? ''),
        craft: String(rec.craft ?? ''),
        plugIn: String(rec.plugIn ?? ''),
        email: String(rec.email ?? ''),
        status: (rec.status ?? 'new') as SubmissionStatus,
      })
      continue
    }

    const sub = raw as Partial<Submission>
    const pains = Array.isArray(sub.pains) ? sub.pains.filter(isPainId) : []
    // No draft on the record means it came from the server, which stores the
    // intake and nothing derived. Build the skeleton; runDraft replaces it.
    const draft = sub.draft ? { ...sub.draft } : baseDraft(pains)
    if (!Array.isArray(draft.stack) || draft.stack.length === 0) {
      draft.stack = painsOrDefault(pains).map((p) => defaultStackItem(p.id))
    }
    out.push({
      ...(sub as Submission),
      kind: 'plan',
      createdAt: typeof sub.createdAt === 'number' ? sub.createdAt : Date.now(),
      business: String(sub.business ?? 'Unknown business'),
      email: String(sub.email ?? ''),
      rate: typeof sub.rate === 'number' ? sub.rate : 60,
      pains,
      draft,
      status: (sub.status ?? 'new') as SubmissionStatus,
    })
  }
  return out
}

function seed(): Lead[] {
  const now = Date.now()
  const make = (
    id: string,
    minsAgo: number,
    business: string,
    hours: HoursBand,
    pains: PainId[],
    email: string,
    status: SubmissionStatus,
  ): Submission => {
    const draft = baseDraft(pains)
    // Seeded examples are derived, not generated, so they are labelled as the
    // offline draft they are. "Regenerate" on any of them runs the live call.
    draft.status = 'ready'
    draft.source = 'fallback'
    return {
      id,
      createdAt: now - minsAgo * 60_000,
      kind: 'plan',
      business,
      hours,
      pains,
      email,
      rate: 60,
      status,
      draft,
    }
  }
  return [
    make(
      'seed-2',
      26,
      'Medical, dental or vet practice',
      '15 to 30',
      ['booking', 'questions', 'invoices'],
      'dana@rivergateclinic.com',
      'new',
    ),
    make(
      'seed-1',
      190,
      'Agency or consultancy',
      '5 to 15',
      ['invoices', 'copying'],
      'marcus@haleaccounting.com',
      'contacted',
    ),
  ]
}

/** Newest first, which is the only order the inbox ever wants. */
function sorted(list: Lead[]): Lead[] {
  return [...list].sort((a, b) => b.createdAt - a.createdAt)
}

export function loadSubmissions(): Lead[] {
  if (cache) return sorted(cache)
  const migrated = hydrateLeads(readRaw())
  const list = migrated.length ? migrated : seed()
  write(list)
  return sorted(list)
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORE_KEY) return
    cache = hydrateLeads(readRaw())
    fn(sorted(cache))
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(fn)
    window.removeEventListener('storage', onStorage)
  }
}

export function addSubmission(lead: Lead): void {
  write([lead, ...loadSubmissions().filter((l) => l.id !== lead.id)])
}

/**
 * Reconcile the server's list into the local mirror.
 *
 * The server owns the intake and the workflow — status, booked slot, who
 * exists at all — so its version of those wins outright. The draft is the one
 * thing it does not own: drafts are derived on the client and never persisted
 * server-side, so a straight replace would throw away a finished draft and
 * leave every lead looking pending again. On a 20-second poll that would mean
 * re-running the drafting call for the whole inbox, forever.
 *
 * So a ready draft on the device is kept over the skeleton that arrived with
 * the server record. Anything the server has and the device does not is added;
 * anything the device has and the server does not is dropped, because the
 * server is the record of who exists.
 */
export function mergeServerLeads(list: Lead[]): Lead[] {
  const local = new Map(loadSubmissions().map((l) => [l.id, l]))
  const merged = list.map((incoming) => {
    const known = local.get(incoming.id)
    if (!known || incoming.kind !== 'plan' || known.kind !== 'plan') return incoming
    // Only a finished draft is worth keeping; a pending one is not progress.
    if (known.draft.status !== 'ready') return incoming
    return { ...incoming, draft: known.draft }
  })
  write(merged)
  return merged
}

export function updateSubmission(
  id: string,
  patch: Partial<Lead> | ((prev: Lead) => Partial<Lead>),
): Lead | undefined {
  const list = loadSubmissions().map((s) =>
    s.id === id ? ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) } as Lead) : s,
  )
  write(list)
  return list.find((s) => s.id === id)
}

export function getSubmission(id: string): Lead | undefined {
  return loadSubmissions().find((s) => s.id === id)
}

/** Test and demo helper: wipe the store so the seeds come back. */
export function resetStore(): void {
  cache = null
  try {
    localStorage.removeItem(STORE_KEY)
  } catch {
    /* nothing to clear */
  }
  loadSubmissions()
}

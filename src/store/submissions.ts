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
 * Records written before a field existed still have to render. Rather than
 * versioning the whole payload, fill in what is missing on read — including
 * `kind`, which pre-dates the partner track and defaults to a plan.
 */
function migrate(value: unknown): Lead[] {
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

    if (!rec.draft) continue
    const sub = raw as Partial<Submission>
    const pains = Array.isArray(sub.pains) ? sub.pains.filter(isPainId) : []
    const draft = { ...(sub.draft as Submission['draft']) }
    if (!Array.isArray(draft.stack) || draft.stack.length === 0) {
      draft.stack = painsOrDefault(pains).map((p) => defaultStackItem(p.id))
    }
    out.push({
      ...(sub as Submission),
      kind: 'plan',
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
  const migrated = migrate(readRaw())
  const list = migrated.length ? migrated : seed()
  write(list)
  return sorted(list)
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORE_KEY) return
    cache = migrate(readRaw())
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

/** Replace the local mirror with the server's list, keeping the change feed. */
export function replaceAll(list: Lead[]): void {
  write(list)
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

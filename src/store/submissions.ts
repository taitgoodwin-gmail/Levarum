import type { HoursBand, PainId, Submission, SubmissionStatus } from '../domain/types'
import { baseDraft } from '../domain/estimate'
import { defaultStackItem } from '../domain/catalog'
import { isPainId, painsOrDefault } from '../domain/pains'
import { BRAND } from '../brand'

/**
 * The submission store. Stands in for the database: unlocking a plan writes a
 * record here, and the operator console reads it as an inbox. On-device and
 * refresh-safe, with a change feed so an open console sees new intakes without
 * a reload (including from another tab).
 */
const STORE_KEY = `${BRAND.slug}.submissions.v1`

type Listener = (list: Submission[]) => void

let cache: Submission[] | null = null
const listeners = new Set<Listener>()

function readRaw(): unknown {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function write(list: Submission[]): void {
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
 * versioning the whole payload, fill in what is missing on read.
 */
function migrate(value: unknown): Submission[] {
  if (!Array.isArray(value)) return []
  const out: Submission[] = []
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue
    const sub = raw as Partial<Submission>
    if (typeof sub.id !== 'string' || !sub.draft) continue
    const pains = Array.isArray(sub.pains) ? sub.pains.filter(isPainId) : []
    const draft = { ...sub.draft }
    if (!Array.isArray(draft.stack) || draft.stack.length === 0) {
      draft.stack = painsOrDefault(pains).map((p) => defaultStackItem(p.id))
    }
    out.push({
      ...(sub as Submission),
      pains,
      draft,
      status: (sub.status ?? 'new') as SubmissionStatus,
    })
  }
  return out
}

function seed(): Submission[] {
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
      'Health and wellness clinic',
      '15 to 30',
      ['booking', 'questions', 'invoices'],
      'dana@rivergateclinic.com',
      'new',
    ),
    make(
      'seed-1',
      190,
      'Professional services (legal, accounting)',
      '5 to 15',
      ['invoices', 'copying'],
      'marcus@haleaccounting.com',
      'contacted',
    ),
  ]
}

/** Newest first, which is the only order the inbox ever wants. */
function sorted(list: Submission[]): Submission[] {
  return [...list].sort((a, b) => b.createdAt - a.createdAt)
}

export function loadSubmissions(): Submission[] {
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

export function addSubmission(sub: Submission): void {
  write([sub, ...loadSubmissions()])
}

export function updateSubmission(
  id: string,
  patch: Partial<Submission> | ((prev: Submission) => Partial<Submission>),
): Submission | undefined {
  const list = loadSubmissions().map((s) =>
    s.id === id ? { ...s, ...(typeof patch === 'function' ? patch(s) : patch) } : s,
  )
  write(list)
  return list.find((s) => s.id === id)
}

export function getSubmission(id: string): Submission | undefined {
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

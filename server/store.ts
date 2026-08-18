/**
 * Server-side lead storage.
 *
 * Two backends behind one interface. When a Vercel KV (Upstash Redis)
 * integration is attached, KV_REST_API_URL and KV_REST_API_TOKEN appear in the
 * environment and every write goes there — durable, shared across regions and
 * across devices, which is the whole point of moving off localStorage.
 *
 * With no KV configured the store falls back to process memory. That is enough
 * for `npm run dev` and for a preview deploy to be genuinely testable, and it
 * is honest about what it is: `backend()` reports which one is live, the
 * console shows it, and nobody is left thinking a lead is safe when it is one
 * cold start away from gone.
 *
 * Talking to KV over its REST API with plain fetch rather than through the SDK
 * keeps the function dependency-free and cold-starting fast.
 *
 * Leads are a hash keyed by id, not a list. A list reads slightly more neatly
 * but has no way to update one member: patching a status would mean rewriting
 * the whole key, and a failure partway through that would take every lead with
 * it. A hash makes a status change one HSET that cannot touch anything else.
 * Ordering is by createdAt at read time, which is where it belongs — the store
 * does not need to know that the inbox wants newest first.
 */

const KEY = 'levarum:leads:v1'
/** Enough history for the console to be useful; not a data warehouse. */
const MAX_LEADS = 500

export interface StoredLead {
  id: string
  createdAt: number
  kind: 'plan' | 'partner'
  status: 'new' | 'contacted' | 'archived'
  [field: string]: unknown
}

function kvConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  return url && token ? { url: url.replace(/\/$/, ''), token } : null
}

export function isDurable(): boolean {
  return kvConfig() !== null
}

/** Where a lead just went, so the caller can tell the truth about it. */
export type Backend = 'kv' | 'memory'

export function backend(): Backend {
  return isDurable() ? 'kv' : 'memory'
}

async function kv<T>(command: unknown[]): Promise<T> {
  const config = kvConfig()
  if (!config) throw new Error('KV is not configured')

  const res = await fetch(config.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })
  if (!res.ok) throw new Error(`KV replied ${res.status}`)
  const payload = (await res.json()) as { result?: T; error?: string }
  if (payload.error) throw new Error(payload.error)
  return payload.result as T
}

/** The in-process fallback. Module scope, so it survives within one instance. */
const memory = new Map<string, StoredLead>()

function newestFirst(list: StoredLead[]): StoredLead[] {
  return list.sort((a, b) => b.createdAt - a.createdAt)
}

export async function listLeads(): Promise<StoredLead[]> {
  if (!isDurable()) return newestFirst([...memory.values()])

  // HGETALL comes back as a flat [field, value, field, value, …] array over
  // the REST API; the values are the JSON we stored.
  const flat = await kv<unknown[]>(['HGETALL', KEY])
  const out: StoredLead[] = []
  for (let i = 1; i < (flat?.length ?? 0); i += 2) {
    const raw = flat[i]
    try {
      out.push(typeof raw === 'string' ? (JSON.parse(raw) as StoredLead) : (raw as StoredLead))
    } catch {
      // One unparseable row must not take the whole inbox down.
    }
  }
  return newestFirst(out)
}

/**
 * Keep the key from growing without bound.
 *
 * Only runs when the hash is actually over the cap, and only ever deletes the
 * oldest entries past it — so a write can trim history but can never lose the
 * lead it was called for.
 */
async function evictOldest(): Promise<void> {
  const size = await kv<number>(['HLEN', KEY])
  if (!size || size <= MAX_LEADS) return
  const all = await listLeads()
  const surplus = all.slice(MAX_LEADS).map((l) => l.id)
  if (surplus.length) await kv(['HDEL', KEY, ...surplus])
}

export async function addLead(lead: StoredLead): Promise<void> {
  if (!isDurable()) {
    memory.set(lead.id, lead)
    if (memory.size > MAX_LEADS) {
      for (const stale of newestFirst([...memory.values()]).slice(MAX_LEADS)) {
        memory.delete(stale.id)
      }
    }
    return
  }
  await kv(['HSET', KEY, lead.id, JSON.stringify(lead)])
  await evictOldest()
}

/**
 * Patch one lead in place.
 *
 * Read one field, merge, write one field. Nothing else in the key is read or
 * touched, so a failure here can only ever fail this one lead.
 */
export async function patchLead(
  id: string,
  patch: Partial<StoredLead>,
): Promise<StoredLead | null> {
  if (!isDurable()) {
    const found = memory.get(id)
    if (!found) return null
    const updated = { ...found, ...patch, id: found.id }
    memory.set(id, updated)
    return updated
  }

  const raw = await kv<string | null>(['HGET', KEY, id])
  if (!raw) return null

  let current: StoredLead
  try {
    current = typeof raw === 'string' ? (JSON.parse(raw) as StoredLead) : (raw as StoredLead)
  } catch {
    return null
  }

  // id is re-pinned last so a patch can never move a lead to another key.
  const updated: StoredLead = { ...current, ...patch, id: current.id }
  await kv(['HSET', KEY, id, JSON.stringify(updated)])
  return updated
}

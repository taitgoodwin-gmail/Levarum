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
 * is honest about what it is: `isDurable()` reports which backend is live, the
 * console shows it, and nobody is left thinking a lead is safe when it is one
 * cold start away from gone.
 *
 * Talking to KV over its REST API with plain fetch rather than through the SDK
 * keeps the function dependency-free and cold-starting fast; the API is three
 * commands wide and stable.
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
const memory: StoredLead[] = []

export async function listLeads(): Promise<StoredLead[]> {
  if (!isDurable()) return [...memory].sort((a, b) => b.createdAt - a.createdAt)

  const rows = await kv<string[]>(['LRANGE', KEY, '0', String(MAX_LEADS - 1)])
  const out: StoredLead[] = []
  for (const row of rows ?? []) {
    try {
      out.push(JSON.parse(row) as StoredLead)
    } catch {
      // One unparseable row must not take the whole inbox down.
    }
  }
  return out.sort((a, b) => b.createdAt - a.createdAt)
}

export async function addLead(lead: StoredLead): Promise<void> {
  if (!isDurable()) {
    memory.unshift(lead)
    memory.splice(MAX_LEADS)
    return
  }
  await kv(['LPUSH', KEY, JSON.stringify(lead)])
  await kv(['LTRIM', KEY, '0', String(MAX_LEADS - 1)])
}

/**
 * Patch one lead in place.
 *
 * A list is the wrong shape for an update, so this reads, edits and rewrites.
 * At this volume that is fine and it keeps the read path — which runs far more
 * often — as one LRANGE. Revisit if the inbox ever gets busy enough to race.
 */
export async function patchLead(
  id: string,
  patch: Partial<StoredLead>,
): Promise<StoredLead | null> {
  if (!isDurable()) {
    const found = memory.find((l) => l.id === id)
    if (!found) return null
    Object.assign(found, patch)
    return found
  }

  const all = await listLeads()
  const found = all.find((l) => l.id === id)
  if (!found) return null
  const updated = { ...found, ...patch }
  const rewritten = all.map((l) => (l.id === id ? updated : l))

  await kv(['DEL', KEY])
  // Rewritten oldest-first so LPUSH leaves the list newest-first again.
  for (const lead of [...rewritten].reverse()) {
    await kv(['LPUSH', KEY, JSON.stringify(lead)])
  }
  return updated
}

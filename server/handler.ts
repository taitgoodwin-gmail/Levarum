import type { IncomingMessage, ServerResponse } from 'node:http'
import { DraftUnavailableError, generateDraft, isDraftConfigured, parseDraftRequest } from './draft.ts'

/**
 * Transport-free request handling, shared by the Vite dev middleware and the
 * standalone server so both behave identically.
 */

const MAX_BODY_BYTES = 16 * 1024

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString('utf8')
      if (body.length > MAX_BODY_BYTES) {
        reject(new DraftUnavailableError('Body too large'))
        req.destroy()
      }
    })
    req.on('end', () => resolve(body))
    req.on('error', reject)
  })
}

/** Shared by every host that mounts this endpoint, including the Vercel Function. */
export function send(res: ServerResponse, status: number, payload: unknown): void {
  const body = JSON.stringify(payload)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(body)
}

export const DRAFT_PATH = '/api/draft'

/** True when this request is for the draft endpoint. */
export function isDraftRequest(req: IncomingMessage): boolean {
  const path = (req.url ?? '').split('?')[0]
  return path === DRAFT_PATH
}

export async function handleDraftRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    send(res, 405, { error: 'Use POST' })
    return
  }

  // No credential is a normal state, not a failure: the app falls back to the
  // deterministic draft and labels it. Say so plainly rather than 500-ing.
  if (!isDraftConfigured()) {
    send(res, 503, { error: 'Drafting is not configured', configured: false })
    return
  }

  try {
    const parsed = parseDraftRequest(JSON.parse(await readBody(req)))
    send(res, 200, await generateDraft(parsed))
  } catch (error) {
    if (error instanceof DraftUnavailableError) {
      send(res, 502, { error: error.message })
      return
    }
    if (error instanceof SyntaxError) {
      send(res, 400, { error: 'Body must be valid JSON' })
      return
    }
    send(res, 500, { error: 'Unexpected error while drafting' })
  }
}

import type { IncomingMessage, ServerResponse } from 'node:http'

import {
  DraftUnavailableError,
  generateDraft,
  isDraftConfigured,
  parseDraftRequest,
} from '../server/draft.ts'
import { send } from '../server/handler.ts'

/**
 * POST /api/draft, as a Vercel Function.
 *
 * This is the production counterpart to the Vite dev middleware. It exists
 * because `dist/` is static: without a function here, the endpoint is simply
 * absent in production and every draft silently falls back to the offline one.
 *
 * It calls the domain functions directly rather than reusing
 * `handleDraftRequest`, because Vercel's Node runtime consumes and pre-parses
 * the request stream. Re-reading it the way a raw Node server does would hang
 * waiting for an 'end' event that has already fired.
 *
 * Requires ANTHROPIC_API_KEY in the project's environment variables.
 */

/** Vercel's Node runtime attaches the parsed body to the request. */
type DraftApiRequest = IncomingMessage & { body?: unknown }

const MAX_BODY_BYTES = 16 * 1024

/** Prefer the pre-parsed body; fall back to the stream on hosts that don't. */
async function readBody(req: DraftApiRequest): Promise<unknown> {
  if (req.body !== undefined && req.body !== null) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  }

  const raw = await new Promise<string>((resolve, reject) => {
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

  return JSON.parse(raw)
}

export default async function handler(
  req: DraftApiRequest,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    send(res, 405, { error: 'Use POST' })
    return
  }

  // No key is a normal state, not a failure: the app falls back to the
  // deterministic draft and labels it.
  if (!isDraftConfigured()) {
    send(res, 503, { error: 'Drafting is not configured', configured: false })
    return
  }

  try {
    send(res, 200, await generateDraft(parseDraftRequest(await readBody(req))))
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

import type { IncomingMessage, ServerResponse } from 'node:http'

import { handleApiRequest } from '../server/api'

/**
 * The API, as Vercel Functions.
 *
 * `dist/` is static, so without a function per route these endpoints are
 * simply absent in production: submissions would 404, the console would have
 * no list to read, and the site would look like it worked while losing every
 * lead. api/submit.ts, api/leads.ts, api/session.ts and api/events.ts each
 * re-export the shared handler below; the routing itself lives in
 * server/api.ts so the dev middleware and this run identical code.
 *
 * Vercel's Node runtime consumes and pre-parses the request stream, so the
 * body arrives on the request rather than as a stream to read. Re-reading it
 * the way a raw Node server does would hang waiting for an 'end' event that
 * has already fired — the same trap api/draft.ts documents.
 */

type ApiRequest = IncomingMessage & { body?: unknown }

function body(req: ApiRequest): unknown {
  if (req.body === undefined || req.body === null) return undefined
  if (typeof req.body !== 'string') return req.body
  if (!req.body.trim()) return undefined
  return JSON.parse(req.body)
}

export function createHandler() {
  return async function handler(req: ApiRequest, res: ServerResponse): Promise<void> {
    try {
      await handleApiRequest(req, res, body(req))
    } catch (error) {
      if (error instanceof SyntaxError) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: 'Body must be valid JSON' }))
        return
      }
      throw error
    }
  }
}

export default createHandler()

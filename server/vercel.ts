import type { IncomingMessage, ServerResponse } from 'node:http'

import { send } from './handler'

/**
 * The Vercel Function adapter.
 *
 * One rule: a function bound to a file must call *its own* handler and nothing
 * else. It must never re-derive which endpoint it is from `req.url`.
 *
 * The previous version did exactly that — every api/ file exported the same
 * generic handler, which matched `req.url` against a list of paths and fell
 * through to `send(res, 404, …)` when nothing matched. That makes correct
 * delivery of a request to the right function insufficient: if the platform
 * hands over a path in any shape but the exact literal `/api/session` — a
 * trailing slash, a rewritten path, a base path — the function answers 404
 * while looking, from the outside, like a route that does not exist. There is
 * no way to observe the difference from a browser, and the console upstream
 * read that 404 as "no credential is configured".
 *
 * Binding each route to its handler removes the entire class. `api/session.ts`
 * is the session endpoint because of where the file is; the code no longer has
 * an opinion about the URL it was reached by.
 *
 * The dev middleware and the standalone server still route by path, because
 * they genuinely are one process serving many paths — see handleApiRequest.
 */

/** Vercel's Node runtime attaches the parsed body to the request. */
export type ApiRequest = IncomingMessage & { body?: unknown }

export type RouteHandler = (
  req: ApiRequest,
  res: ServerResponse,
  body: unknown,
) => void | Promise<void>

/**
 * Vercel pre-parses the request body, so it arrives on the request rather than
 * as a stream. Re-reading it the way a raw Node server does would hang waiting
 * for an 'end' event that has already fired.
 */
function readBody(req: ApiRequest): unknown {
  if (req.body === undefined || req.body === null) return undefined
  if (typeof req.body !== 'string') return req.body
  if (!req.body.trim()) return undefined
  return JSON.parse(req.body)
}

export function vercelRoute(handler: RouteHandler) {
  return async function route(req: ApiRequest, res: ServerResponse): Promise<void> {
    try {
      await handler(req, res, readBody(req))
    } catch (error) {
      if (error instanceof SyntaxError) {
        send(res, 400, { error: 'Body must be valid JSON' })
        return
      }
      // A thrown error must still leave the caller with JSON. An unhandled
      // throw becomes an opaque platform error page, and the console cannot
      // tell that apart from the endpoint not existing.
      console.error('API error', error)
      send(res, 500, { error: 'Something went wrong on our side.' })
    }
  }
}

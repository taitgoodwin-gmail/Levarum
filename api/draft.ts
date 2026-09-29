import type { IncomingMessage, ServerResponse } from 'node:http'

// Disabled for the public pilot. Internal drafting requires authenticated access.
export default function handler(_req: IncomingMessage, res: ServerResponse) {
  res.statusCode = 404
  res.setHeader('Cache-Control', 'no-store')
  res.end('Not found')
}

import type { IncomingMessage, ServerResponse } from 'node:http'
import { releaseIdentity } from '../server/release.ts'
export default function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') { res.statusCode = 405; res.setHeader('Allow', 'GET'); return res.end(JSON.stringify({ error: 'Use GET' })) }
  const identity = releaseIdentity()
  res.statusCode = identity ? 200 : 503
  res.end(JSON.stringify(identity ?? { error: 'Release identity unavailable' }))
}

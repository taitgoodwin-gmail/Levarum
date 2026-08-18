import { createServer } from 'node:http'
import { handleDraftRequest, isDraftRequest } from './handler.ts'
import { isDraftConfigured } from './draft.ts'

/**
 * Standalone draft API, for production or alongside `vite preview`.
 * Run with: npm run serve:api
 */
const port = Number(process.env.DRAFT_API_PORT ?? 8787)

const server = createServer((req, res) => {
  // The browser bundle may be served from another origin in this setup, so the
  // endpoint answers preflight for the single method it accepts.
  const origin = process.env.DRAFT_API_ORIGIN ?? '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (!isDraftRequest(req)) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ error: 'Not found' }))
    return
  }

  void handleDraftRequest(req, res)
})

server.listen(port, () => {
  const state = isDraftConfigured()
    ? 'ANTHROPIC_API_KEY found'
    : 'no ANTHROPIC_API_KEY, drafts will fall back to the offline draft'
  console.log(`Draft API listening on http://localhost:${port}/api/draft (${state})`)
})

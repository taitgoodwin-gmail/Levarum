import { createServer } from 'node:http'
import { handleDraftRequest, isDraftRequest } from './handler'
import { handleApiRequest, isApiRequest, readBody } from './api'
import { isDraftConfigured } from './draft'
import { isAuthConfigured } from './session'
import { backend } from './store'

/**
 * Standalone API, for production hosts other than Vercel or alongside
 * `vite preview`. Run with: npm run serve:api
 */
const port = Number(process.env.DRAFT_API_PORT ?? 8787)

const server = createServer((req, res) => {
  // The browser bundle may be served from another origin in this setup. The
  // session cookie rides these requests, so credentials must be allowed and
  // the origin cannot be a wildcard when it is.
  const origin = process.env.DRAFT_API_ORIGIN
  res.setHeader('Access-Control-Allow-Origin', origin ?? '*')
  if (origin) res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (isDraftRequest(req)) {
    void handleDraftRequest(req, res)
    return
  }

  if (isApiRequest(req)) {
    void (async () => {
      const raw = req.method === 'GET' || req.method === 'DELETE' ? '' : await readBody(req)
      await handleApiRequest(req, res, raw ? JSON.parse(raw) : undefined)
    })()
    return
  }

  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(port, () => {
  console.log(`Levarum API listening on http://localhost:${port}`)
  console.log(`  drafting: ${isDraftConfigured() ? 'live' : 'offline draft (no ANTHROPIC_API_KEY)'}`)
  console.log(`  console:  ${isAuthConfigured() ? 'credential set' : 'CLOSED (no OPERATOR_USER)'}`)
  console.log(`  storage:  ${backend()}`)
})

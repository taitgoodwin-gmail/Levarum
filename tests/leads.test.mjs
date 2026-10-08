import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { parseLead, leadPath } from '../server/leads.ts'
import { createLeadHandler } from '../api/leads.ts'

const valid = () => ({ requestId: randomUUID(), intent: 'plan', email: 'pilot-test@example.com', business: 'Trades and contracting', hours: 'Under 5', pains: ['booking'], preferences: '', consent: true, website: '' })
function response() {
  return { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k] = v }, end(body) { this.body = JSON.parse(body) } }
}
function request(body, options = {}) {
  return { method: 'POST', headers: { host: 'localhost:5173', origin: 'http://localhost:5173', 'content-type': 'application/json' }, socket: { remoteAddress: '127.0.0.1' }, body, ...options }
}
const deps = (overrides = {}) => ({ configured: () => true, save: async () => {}, notify: async () => {}, ...overrides })

test('rejects empty selections, invalid email, missing consent, unknown values and honeypot', () => {
  for (const patch of [{ pains: [] }, { email: 'a@b.com other' }, { consent: false }, { business: 'other' }, { hours: 'hundreds' }, { website: 'bot' }, { preferences: 'x'.repeat(501) }]) {
    assert.throws(() => parseLead({ ...valid(), ...patch }))
  }
})
test('canonical requests are idempotent and cannot overwrite different personal data', () => {
  const input = valid()
  assert.equal(leadPath(parseLead(input)), leadPath(parseLead({ ...input, email: ' PILOT-TEST@example.com ' })))
  assert.notEqual(leadPath(parseLead(input)), leadPath(parseLead({ ...input, email: 'other@example.com' })))
  assert.ok(!leadPath(parseLead(input)).includes('@'))
})
test('confirms only after durable save and does not expose a storage URL', async () => {
  let saved = false
  const handler = createLeadHandler(deps({ save: async () => { saved = true } }))
  const res = response(); await handler(request(valid()), res)
  assert.ok(saved); assert.equal(res.statusCode, 200); assert.equal(res.body.saved, true)
  assert.deepEqual(Object.keys(res.body).sort(), ['reference', 'saved'])
})
test('storage failure never reports success', async () => {
  const res = response()
  await createLeadHandler(deps({ save: async () => { throw new Error('offline') } }))(request(valid()), res)
  assert.equal(res.statusCode, 503); assert.notEqual(res.body.saved, true)
})
test('notification failure does not lose a saved lead', async () => {
  const res = response()
  await createLeadHandler(deps({ notify: async () => { throw new Error('offline') } }))(request(valid()), res)
  assert.equal(res.statusCode, 200); assert.equal(res.body.saved, true)
})
test('fails closed when storage is not configured', async () => {
  const res = response(); await createLeadHandler(deps({ configured: () => false }))(request(valid()), res)
  assert.equal(res.statusCode, 503)
})
test('rejects malformed, oversized, cross-origin, non-JSON and read requests', async () => {
  const handler = createLeadHandler(deps())
  for (const [req, expected] of [
    [request('{'), 400], [request('x'.repeat(9000)), 400],
    [request(valid(), { headers: { host: 'localhost:5173', origin: 'https://other.test', 'content-type': 'application/json' } }), 403],
    [request(valid(), { headers: {} }), 415], [request(valid(), { method: 'GET' }), 405],
  ]) { const res = response(); await handler(req, res); assert.equal(res.statusCode, expected) }
})
test('throttles repeated requests on an instance', async () => {
  const handler = createLeadHandler(deps())
  for (let i = 0; i < 11; i++) {
    const res = response(); await handler(request(valid()), res)
    assert.equal(res.statusCode, i < 10 ? 200 : 429)
  }
})
test('production origin and declared body limits reject before durable writes', async () => {
  const prior = { env: process.env.VERCEL_ENV, origins: process.env.PUBLIC_ALLOWED_ORIGINS }
  process.env.VERCEL_ENV = 'production'; process.env.PUBLIC_ALLOWED_ORIGINS = 'https://levarum.example'
  let writes = 0
  const handler = createLeadHandler(deps({ save: async () => { writes++ } }))
  try {
    const missing = response(); await handler(request(valid(), { headers: { host: 'levarum.example', 'content-type': 'application/json' } }), missing)
    assert.equal(missing.statusCode, 403)
    const foreign = response(); await handler(request(valid(), { headers: { host: 'levarum.example', origin: 'https://other.example', 'content-type': 'application/json' } }), foreign)
    assert.equal(foreign.statusCode, 403)
    const oversize = response(); await handler(request(valid(), { headers: { host: 'levarum.example', origin: 'https://levarum.example', 'content-type': 'application/json', 'content-length': '9000' } }), oversize)
    assert.equal(oversize.statusCode, 413)
    assert.equal(writes, 0)
    const allowed = response(); await handler(request(valid(), { headers: { host: 'levarum.example', origin: 'https://levarum.example', 'content-type': 'application/json' } }), allowed)
    assert.equal(allowed.statusCode, 200)
    assert.equal(writes, 1)
  } finally {
    if (prior.env === undefined) delete process.env.VERCEL_ENV; else process.env.VERCEL_ENV = prior.env
    if (prior.origins === undefined) delete process.env.PUBLIC_ALLOWED_ORIGINS; else process.env.PUBLIC_ALLOWED_ORIGINS = prior.origins
  }
})

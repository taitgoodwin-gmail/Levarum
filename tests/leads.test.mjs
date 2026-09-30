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

test('a direct call request can be saved without a preceding plan submission', async () => {
  const input = { ...valid(), intent: 'call', preferences: 'Weekday mornings, Eastern time' }
  const records = []
  const handler = createLeadHandler(deps({ save: async lead => { records.push(lead) } }))
  const res = response()
  await handler(request(input), res)
  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, { saved: true, reference: input.requestId })
  assert.equal(records.length, 1)
  assert.equal(records[0].intent, 'call')
  assert.equal(records[0].preferences, input.preferences)
})

test('neither follow-up purpose saves or notifies without explicit consent', async () => {
  for (const intent of ['plan', 'call']) for (const consent of [false, undefined, 'true']) {
    let touched = false
    const handler = createLeadHandler(deps({ save: async () => { touched = true }, notify: async () => { touched = true } }))
    const res = response()
    await handler(request({ ...valid(), intent, consent }), res)
    assert.equal(res.statusCode, 400)
    assert.equal(touched, false)
    assert.notEqual(res.body.saved, true)
  }
})

test('pending storage cannot acknowledge or notify a request before it is durable', async () => {
  let releaseSave
  let notifyCalled = false
  const saveGate = new Promise(resolve => { releaseSave = resolve })
  const handler = createLeadHandler(deps({ save: () => saveGate, notify: async () => { notifyCalled = true } }))
  const res = response()
  const pending = handler(request(valid()), res)
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(res.body, undefined)
  assert.equal(notifyCalled, false)
  releaseSave()
  await pending
  assert.equal(res.body.saved, true)
  assert.equal(notifyCalled, true)
})

test('follow-up and call remain separate records while equivalent answer retries keep their identity', () => {
  const input = { ...valid(), pains: ['invoices', 'booking'] }
  const plan = parseLead(input)
  const equivalentRetry = parseLead({ ...input, pains: ['booking', 'invoices'], preferences: 'Not applicable to a follow-up request' })
  assert.equal(leadPath(plan), leadPath(equivalentRetry))
  const call = parseLead({ ...input, intent: 'call', preferences: 'Eastern mornings' })
  assert.notEqual(leadPath(plan), leadPath(call))
  assert.equal(call.preferences, 'Eastern mornings')
  assert.notEqual(leadPath(call), leadPath(parseLead({ ...call, preferences: 'Pacific afternoons' })))
})

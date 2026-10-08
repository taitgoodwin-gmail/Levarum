import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { createAdminHandler } from '../api/admin.ts'
import { AdminError, requireOwner } from '../server/admin-auth.ts'
import { parseStatusChange } from '../server/admin-store.ts'

const response = () => ({ statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k] = v }, end(body) { this.body = JSON.parse(body) } })
const request = (url, method = 'GET', body) => ({ url, method, headers: { host: 'localhost', origin: 'http://localhost', 'content-type': 'application/json' }, body })
const fake = (overrides = {}) => ({ authorize: async () => 'owner', inbox: async () => ({ leads: [], total: 0 }), detail: async () => ({ record: {}, lead: {} }), sync: async () => ({ hasMore: false }), update: async () => ({ saved: true }), ...overrides })

test('private queue rejects missing and mismatched owner before reading records', async () => {
  assert.throws(() => requireOwner(null, 'owner'), { status: 401 })
  assert.throws(() => requireOwner('intruder', 'owner'), { status: 403 })
  let read = false
  const handler = createAdminHandler(fake({ authorize: async () => { throw new AdminError(401, 'Sign in') }, inbox: async () => { read = true } }))
  const res = response(); await handler(request('/api/admin?action=list'), res)
  assert.equal(res.statusCode, 401); assert.equal(read, false); assert.equal(res.headers['Cache-Control'], 'private, no-store')
})

test('status updates require a known state, version, id and same-origin POST', async () => {
  const body = { id: 'a'.repeat(64), status: 'in-progress', version: 0, mutationId: randomUUID() }
  assert.equal(parseStatusChange(body).status, 'in-progress')
  for (const patch of [{ status: 'Booked' }, { status: 'other' }, { version: -1 }, { id: 'bad' }]) assert.throws(() => parseStatusChange({ ...body, ...patch }))
  let updated = false
  const handler = createAdminHandler(fake({ update: async () => { updated = true; return { saved: true } } }))
  const res = response(); await handler({ ...request('/api/admin?action=status', 'POST', body), headers: { host: 'localhost', origin: 'https://other.example', 'content-type': 'application/json' } }, res)
  assert.equal(res.statusCode, 403); assert.equal(updated, false)
})

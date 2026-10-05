import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash, randomUUID } from 'node:crypto'
import { WORKLOADS } from '../src/domain/intake.ts'
import { parseLead, leadPath } from '../server/leads.ts'
import { createLeadHandler } from '../api/leads.ts'

const intake = () => ({ schemaVersion: 3, requestId: randomUUID(), intent: 'call', email: 'pilot-test@example.com', business: 'Trades and contracting', workload: WORKLOADS[1], pains: ['invoices'], preferences: 'Afternoons, Eastern time', consent: true, website: '' })

test('qualitative answers survive validation without being converted to hours', () => {
  for (const workload of WORKLOADS) {
    const lead = parseLead({ ...intake(), workload })
    assert.equal(lead.workload, workload)
    assert.equal(lead.schemaVersion, 3)
    assert.equal(Object.hasOwn(lead, 'hours'), false)
  }
})

test('version boundary rejects unknown schemas and mixed numeric/qualitative meanings', () => {
  for (const patch of [{ schemaVersion: 4 }, { schemaVersion: null }, { workload: '5 to 15' }, { workload: undefined }, { hours: '5 to 15' }, { consent: false }, { pains: [] }]) {
    assert.throws(() => parseLead({ ...intake(), ...patch }))
  }
})

test('legacy normalized content and storage paths retain the original contract', () => {
  const legacy = { requestId: '12345678-1234-4234-8234-123456789abc', intent: 'plan', email: 'pilot-test@example.com', business: 'Trades and contracting', hours: 'Under 5', pains: ['booking', 'invoices'], preferences: '', consent: true }
  const result = parseLead({ ...legacy, email: ' PILOT-TEST@example.com ', pains: ['invoices', 'booking', 'booking'], website: '' })
  assert.equal(JSON.stringify(result), JSON.stringify(legacy))
  const digest = createHash('sha256').update(JSON.stringify(legacy)).digest('hex')
  assert.equal(leadPath(result), `leads/plan/${legacy.requestId}-${digest}.json`)
})

test('schema 3 uses the existing durable-save and notification-failure boundary', async () => {
  const input = intake()
  let saved
  const handler = createLeadHandler({ configured: () => true, save: async lead => { saved = lead }, notify: async () => { throw new Error('offline') } })
  const response = { statusCode: 0, setHeader() {}, end(body) { this.body = JSON.parse(body) } }
  await handler({ method: 'POST', headers: { host: 'localhost', origin: 'http://localhost', 'content-type': 'application/json' }, socket: { remoteAddress: '127.0.0.1' }, body: input }, response)
  assert.equal(response.statusCode, 200)
  assert.equal(response.body.saved, true)
  assert.equal(saved.workload, WORKLOADS[1])
  assert.equal(Object.hasOwn(saved, 'hours'), false)
  assert.equal(leadPath(saved), leadPath(parseLead(input)))
  assert.notEqual(leadPath(saved), leadPath(parseLead({ ...input, workload: WORKLOADS[2] })))
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { releaseIdentity, releaseConfigured } from '../server/release.ts'
import releaseHandler from '../api/release.ts'
const valid = { VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_SHA: 'a'.repeat(40), VERCEL_DEPLOYMENT_ID: 'dpl_123ABC' }
const response = () => ({ statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k] = v }, end(body) { this.body = JSON.parse(body) } })
test('production requires a source revision and deployment identity', () => {
  assert.deepEqual(releaseIdentity(valid), { sourceRevision: 'a'.repeat(40), deploymentId: 'dpl_123ABC' })
  assert.equal(releaseConfigured(valid), true)
  assert.equal(releaseConfigured({ ...valid, VERCEL_GIT_COMMIT_SHA: '' }), false)
  assert.equal(releaseConfigured({ ...valid, VERCEL_DEPLOYMENT_ID: '' }), false)
  assert.equal(releaseConfigured({ VERCEL_ENV: 'preview' }), true)
})
test('release endpoint never returns an identity when configuration is missing', () => {
  const prior = { sha: process.env.VERCEL_GIT_COMMIT_SHA, id: process.env.VERCEL_DEPLOYMENT_ID }
  delete process.env.VERCEL_GIT_COMMIT_SHA; delete process.env.VERCEL_DEPLOYMENT_ID
  try {
    const res = response(); releaseHandler({ method: 'GET' }, res)
    assert.equal(res.statusCode, 503)
    assert.deepEqual(res.body, { error: 'Release identity unavailable' })
  } finally {
    if (prior.sha === undefined) delete process.env.VERCEL_GIT_COMMIT_SHA; else process.env.VERCEL_GIT_COMMIT_SHA = prior.sha
    if (prior.id === undefined) delete process.env.VERCEL_DEPLOYMENT_ID; else process.env.VERCEL_DEPLOYMENT_ID = prior.id
  }
})

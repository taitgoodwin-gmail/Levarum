import assert from 'node:assert/strict'
import {mkdirSync, writeFileSync} from 'node:fs'
import {preview} from 'vite'

const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const out = process.env.TEST_OUT || 'work/submission-body'
mkdirSync(out, {recursive: true})
const requests = new Map(), sockets = new Set()
// Serve the built app and synthetic streaming responses only. No application API,
// .env, provider, credential, private-store write or external request is used.
const server = await preview({configFile: false, envDir: false, preview: {host: '127.0.0.1', port: 0}, plugins: [{
 name: 'synthetic-submission-body',
 configurePreviewServer(server) {
  server.middlewares.use(async (req, res, next) => {
   if (!/^\/api\/(leads|partners)$/.test(req.url || '')) return next()
   if (req.method !== 'POST') {res.statusCode = 405; res.end(); return}
   let bytes = ''
   for await (const chunk of req) bytes += chunk
   const body = JSON.parse(bytes)
   assert.match(body.email, /^synthetic-body-.*@example\.com$/)
   const attempts = requests.get(body.email) || []
   attempts.push(body); requests.set(body.email, attempts)
   res.setHeader('Content-Type', 'application/json')
   res.setHeader('Cache-Control', 'no-store')
   if (attempts.length === 1) {
    // HTTP success headers and partial JSON are insufficient to confirm saving.
    res.write('{"saved":')
    return
   }
   res.end(JSON.stringify(attempts.length === 2 ? {saved: false} : {saved: true, reference: body.requestId}))
  })
 }
}]})
server.httpServer.on('connection', socket => {sockets.add(socket); socket.on('close', () => sockets.delete(socket))})
const base = `http://127.0.0.1:${server.httpServer.address().port}`
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH, headless: true})
const results = [], errors = []
try {
 const checks = await Promise.allSettled(['/contact', '/partners'].flatMap(path => ['light', 'dark'].map(async theme => {
  const width = theme === 'light' ? 320 : 1440
  const context = await browser.newContext({viewport: {width, height: 900}, reducedMotion: 'reduce'})
  const page = await context.newPage()
  page.on('pageerror', error => errors.push(error.message))
  await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort())
  await context.addInitScript(theme => localStorage.setItem('levarum.theme.v1', theme), theme)
  const email = `synthetic-body-${path.slice(1)}-${theme}@example.com`
  const partner = path === '/partners'
  try {
   await page.goto(base + path)
   await page.locator(partner ? '#partner-email' : '#email').fill(email)
   if (partner) {
    await page.locator('#partner-name').fill('Synthetic body test')
    await page.locator('#craft').fill('Synthetic response test only. Do not contact.')
    await page.locator('input[name="contribution"]').first().check()
   } else await page.locator('#message').fill('Synthetic response test only. Do not contact.')
   await page.locator('#consent').check()
   const button = page.getByRole('button', {name: partner ? 'Send partner interest' : /^(Send request|Try again)$/, exact: true})
   const started = Date.now()
   await button.click()
   await page.getByRole('alert').waitFor({timeout: 28000})
   const elapsed = Date.now() - started
   const text = await page.getByRole('alert').innerText()
   results.push({path, theme, width, elapsed, error: text})
   await page.screenshot({path: `${out}/${path.slice(1)}-${theme}-timeout.png`, fullPage: true})
   assert.ok(elapsed >= 19000 && elapsed < 28000, 'The existing 20-second budget must include the response body')
   assert.match(text, /couldn’t confirm.*received/i, 'A stalled response body needs honest retry copy, not a raw browser exception')
   for (const attempt of [1, 2]) {
    assert.ok(await button.isEnabled())
    assert.equal(await page.locator(partner ? '#partner-email' : '#email').inputValue(), email)
    assert.ok(await page.locator('#consent').isChecked())
    assert.equal(await page.getByRole('heading', {name: /saved|received your request/i}).count(), 0)
    assert.ok(await page.getByRole('alert').evaluate(el => el === document.activeElement))
    await page.keyboard.press('Tab')
    assert.ok(await button.evaluate(el => el === document.activeElement))
    await button.click()
    if (attempt === 1) await page.getByRole('alert').waitFor()
   }
   await page.getByRole('heading', {name: /saved|received your request/i}).waitFor()
   const bodies = requests.get(email)
   assert.equal(bodies.length, 3)
   assert.deepEqual(bodies[0], bodies[1]); assert.deepEqual(bodies[1], bodies[2])
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
   Object.assign(results.find(row => row.path === path && row.theme === theme), {retainedInputAndConsent: true, noFalseReceipt: true, stableRetryBody: true, keyboardRecovery: true, noOverflow: true})
  } finally {await context.close()}
 })))
 const failures = checks.filter(check => check.status === 'rejected').map(check => String(check.reason))
 assert.deepEqual(failures, [])
 assert.deepEqual(errors, [])
 console.log('PASS four real localhost partial-body timeouts, saved:false rejection and unchanged successful retries. Synthetic responses only; no private saving.')
} finally {
 writeFileSync(`${out}/results.json`, JSON.stringify({results, errors, limits: 'Built UI with synthetic localhost responses. No real saving or provider access.'}, null, 2))
 await browser.close()
 for (const socket of sockets) socket.destroy()
 await new Promise(resolve => server.httpServer.close(resolve))
}

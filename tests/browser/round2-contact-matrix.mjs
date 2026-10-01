import assert from 'node:assert/strict'
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs'

const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5174'
const out = process.env.TEST_OUT || 'work/round2-contact-matrix'
mkdirSync(out, {recursive: true})
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH, headless: true})
const results = []
const errors = []
const axeResults = []
async function audit(page, theme, width, intent, state) {
 if (!process.env.AXE_CORE_PATH || ![320, 1440].includes(width)) return
 if (!await page.evaluate(() => Boolean(window.axe))) await page.addScriptTag({path: process.env.AXE_CORE_PATH})
 const violations = await page.evaluate(async () => (await window.axe.run(document, {runOnly: {type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"]}})).violations)
 writeFileSync(`${out}/axe-${theme}-${width}-${intent}-${state}.json`, JSON.stringify(violations, null, 2))
 assert.equal(violations.length, 0, `Axe ${theme}/${width}/${intent}/${state}: ${violations.map(v => v.id).join(", ")}`)
 axeResults.push({theme, width, intent, state, violations: 0})
}
const email = `${'u'.repeat(62)}@${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(58)}.test`
const message = 'Synthetic verification only. Do not contact. '.repeat(25).slice(0, 1000)
const preferences = 'Synthetic availability only. Do not contact. '.repeat(12).slice(0, 500)
assert.equal(email.length, 254)
assert.equal(message.length, 1000)
assert.equal(preferences.length, 500)

try {
 for (const theme of ['light', 'dark']) for (const width of [320, 390, 768, 1440]) for (const intent of ['plan', 'call']) {
  const context = await browser.newContext({viewport: {width, height: 900}, reducedMotion: 'reduce'})
  const page = await context.newPage()
  let releasePending
  const requests = []
  try {
   if (process.env.TEST_ACCESS_URL_FILE) await page.goto(readFileSync(process.env.TEST_ACCESS_URL_FILE, 'utf8').trim())
   await context.addInitScript(theme => localStorage.setItem('levarum.theme.v1', theme), theme)
   page.on('pageerror', error => errors.push({theme, width, intent, message: error.message}))
   let requestReceived
   const intercepted = new Promise(resolve => { requestReceived = resolve })
   await page.route(/\/api\/leads$/, async route => {
    requests.push(route.request().postDataJSON())
    await new Promise(resolve => {releasePending = resolve; requestReceived()})
    await route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({saved: true, reference: requests[0].requestId})})
   })
   await page.goto(base + '/')
   await page.getByRole('heading', {name: 'Spend less time on repeat admin.', exact: true}).waitFor()
   // Home's visible primary action always opens the genuine contact form.
   const headerContact = page.locator('header a[href="/contact"]:visible').first()
   if (await headerContact.count()) await headerContact.click()
   else {
    await page.locator('header summary').focus()
    await page.keyboard.press('Enter')
    await page.locator('header a[href="/contact"]:visible').first().click()
   }
   await page.getByRole('heading', {name: 'Tell us what you need.', exact: true}).waitFor()
   assert.equal(new URL(page.url()).pathname, '/contact')
   assert.equal(await page.locator('html').getAttribute('data-theme'), theme)
   assert.equal(await page.locator('#business, input[name="hours"]').count(), 0)
   assert.equal(await page.locator('#message').getAttribute('maxlength'), '1000')
   assert.equal(await page.locator('#email').getAttribute('maxlength'), '254')
   assert.equal(await page.locator('#email').getAttribute('autocomplete'), 'email')
   assert.equal(await page.locator('#preferences').count(), 0)
   const call = page.getByRole('checkbox', {name: /I[’']d prefer a call/})
   assert.ok(!await call.isChecked())
   assert.match(await call.getAttribute('aria-label') || await call.locator('..').innerText(), /optional/i)
   assert.ok(!await page.locator('#consent').isChecked())

   await page.locator('#message').fill(message)
   await page.locator('#email').fill(email)
   if (intent === 'call') {
    await call.focus(); await page.keyboard.press('Space')
    assert.ok(await page.locator('#preferences').isVisible())
    assert.equal(await page.locator('#preferences').getAttribute('maxlength'), '500')
    await page.locator('#preferences').fill(preferences)
   }
   await page.locator('#consent').check()
   const popupPromise = context.waitForEvent('page')
   await page.getByRole('link', {name: /Privacy notice/}).click()
   const popup = await popupPromise
   await popup.waitForLoadState()
   assert.equal(new URL(popup.url()).pathname, '/privacy')
   await popup.locator('h1').waitFor()
   await popup.close()
   assert.equal(await page.locator('#message').inputValue(), message)
   assert.equal(await page.locator('#email').inputValue(), email)
   assert.ok(await page.locator('#consent').isChecked())
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Filled form overflow ${width}/${theme}/${intent}`)

   await audit(page, theme, width, intent, 'filled')
   const submit = page.getByRole('button', {name: 'Send request', exact: true})
   await submit.focus(); await page.keyboard.press('Enter')
   await Promise.race([intercepted, new Promise((_, reject) => setTimeout(() => reject(Error('Submission not intercepted')), 10000))])
   const pending = page.getByRole('button', {name: 'Sending…', exact: true})
   assert.ok(await pending.isDisabled())
   for (const id of ['message', 'email', 'consent', ...(intent === 'call' ? ['preferences'] : [])]) assert.ok(await page.locator('#' + id).isDisabled(), 'Pending lock: ' + id)
   assert.ok(await call.isDisabled())
   assert.equal(await page.getByRole('heading', {name: /^Thanks.*received your request\.$/}).count(), 0)
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Pending form overflow ${width}/${theme}/${intent}`)
   if ([320, 1440].includes(width)) await page.screenshot({path: `${out}/${theme}-${width}-${intent}-pending.png`, fullPage: true})
   assert.equal(requests.length, 1)
   assert.equal(requests[0].schemaVersion, 2)
   assert.equal(requests[0].intent, intent)
   assert.equal(requests[0].email, email)
   assert.equal(requests[0].message, message)
   assert.equal(requests[0].preferences, intent === 'call' ? preferences : '')
   assert.equal(requests[0].consent, true)
   assert.deepEqual(requests[0].pains, [])
   assert.equal('business' in requests[0], false)
   assert.equal('hours' in requests[0], false)
   releasePending(); releasePending = undefined
   const receipt = page.getByRole('heading', {name: /^Thanks.*received your request\.$/})
   await receipt.waitFor()
   assert.ok(await receipt.evaluate(element => element === document.activeElement), 'Receipt receives focus')
   const text = await page.locator('main').innerText()
   assert.ok(text.includes(email))
   if (intent === 'call') assert.match(text, /call is not booked yet/i)
   assert.doesNotMatch(text, /(?:email|invitation|plan) (?:was|has been) sent/i)
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Receipt overflow ${width}/${theme}/${intent}`)
   if ([320, 1440].includes(width)) await page.screenshot({path: `${out}/${theme}-${width}-${intent}-receipt.png`, fullPage: true})
   await audit(page, theme, width, intent, 'receipt')
   await page.getByRole('link', {name: 'Back to Levarum', exact: true}).click()
   await page.getByRole('heading', {name: 'Spend less time on repeat admin.', exact: true}).waitFor()
   results.push({theme, width, intent, maxLengthForm: true, privacyRetainsDraft: true, pendingLocked: true, exactPayload: true, noOverflow: true, receiptFocused: true})
  } finally {
   releasePending?.()
   await context.close()
  }
 }
 assert.deepEqual(errors, [])
 console.log(`PASS: ${results.length} Home→Contact maximum-content, pending/payload, privacy and receipt cases. All submissions mocked.`)
} finally {
 writeFileSync(out + '/results.json', JSON.stringify({mocked: true, results, axeResults, errors}, null, 2))
 await browser.close()
}

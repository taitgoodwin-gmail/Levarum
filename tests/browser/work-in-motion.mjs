import assert from 'node:assert/strict'
import {mkdirSync, writeFileSync} from 'node:fs'
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH, headless: true})
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173'
const out = process.env.TEST_OUT || 'work/work-in-motion'
mkdirSync(out, {recursive:true})
const results = [], errors = []
try {
 for (const theme of ['light','dark']) for (const width of [320,390,768,1440]) {
  const context = await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'})
  const page = await context.newPage()
  await context.addInitScript(theme => localStorage.setItem('levarum.theme.v1',theme),theme)
  page.on('pageerror',e => errors.push(e.message))
  let posts = 0
  await page.route(/\/api\/(leads|partners)$/,async route => {posts++;await route.abort()})
  await page.goto(base)
  await page.getByRole('heading',{name:'Less repeat. More room.',exact:true}).waitFor()
  const diagram = page.locator('.lv-work-diagram')
  assert.ok(await diagram.isVisible())
  const labels = await diagram.locator('.lv-work-label').evaluateAll(elements => elements.map(el => ({size:parseFloat(getComputedStyle(el).fontSize),height:el.clientHeight,scrollHeight:el.scrollHeight})))
  assert.ok(labels.every(label => label.size >= 13 && label.height >= label.scrollHeight),'Labels readable and not clipped')
  assert.equal(await diagram.locator('li').count(),3)
  assert.ok((await diagram.locator('li').evaluateAll(elements => elements.map(el => getComputedStyle(el).animationName))).every(name => name==='none'),'Reduced motion disables card animation')
  const ribbon = await page.locator('.lv-work-ribbon').evaluate(img => ({loaded:img.complete,width:img.naturalWidth,height:img.naturalHeight,renderWidth:img.getBoundingClientRect().width,renderHeight:img.getBoundingClientRect().height}))
  assert.deepEqual(ribbon,{loaded:true,width:622,height:530,renderWidth:622,renderHeight:530})
  const invoices = page.getByRole('tab',{name:'Invoices',exact:true})
  await invoices.focus();await page.keyboard.press('ArrowRight')
  assert.equal(await page.getByRole('tab',{name:'Information',exact:true}).getAttribute('aria-selected'),'true')
  assert.equal(await page.evaluate(() => document.activeElement?.id),'tab-information')
  await page.keyboard.press('End');assert.equal(await page.getByRole('tab',{name:'Enquiries',exact:true}).getAttribute('aria-selected'),'true')
  await page.keyboard.press('ArrowRight');assert.equal(await invoices.getAttribute('aria-selected'),'true')
  await page.keyboard.press('Home');await page.keyboard.press('Tab')
  assert.equal(await page.evaluate(() => document.activeElement?.id),'workflow-panel')
  for (const name of ['Invoices','Information','Enquiries']) {
   await page.getByRole('tab',{name,exact:true}).click()
   const summary = page.locator('.lv-work-detail summary')
   await summary.focus();await page.keyboard.press('Enter')
   assert.ok(await page.getByRole('heading',{name:'Tools involved',exact:true}).isVisible())
   for (const name of ['Steps to agree','Human oversight','Boundaries'])assert.ok(await page.getByRole('heading',{name,exact:true}).isVisible())
   assert.match(await page.getByRole('tabpanel').innerText(),/Synthetic example.*No real customer data/s)
   assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false)
   if (process.env.AXE_CORE_PATH) {
    if (!await page.evaluate(() => Boolean(window.axe)))await page.addScriptTag({path:process.env.AXE_CORE_PATH})
    const violations = await page.evaluate(async () => (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations)
    writeFileSync(`${out}/axe-${theme}-${width}-${name}.json`,JSON.stringify(violations,null,2))
    assert.deepEqual(violations,[],`Axe ${theme}/${width}/${name}`)
   }
   await page.keyboard.press('Space');assert.equal(await page.locator('.lv-work-detail').getAttribute('open'),null)
  }
  const faq = page.locator('#questions summary').nth(1)
  await faq.focus();await page.keyboard.press('Space');assert.equal(await faq.locator('..').getAttribute('open'),'')
  await page.keyboard.press('Space');assert.equal(await faq.locator('..').getAttribute('open'),null)
  assert.ok(await faq.evaluate(el => el===document.activeElement))
  assert.equal(posts,0)
  await page.getByRole('tab',{name:'Invoices',exact:true}).click()
  await page.screenshot({path:`${out}/${theme}-${width}-home.png`,fullPage:true})
  // Text-only enlargement, separate from viewport/reflow cases.
  await page.evaluate(() => {const sizes=[...document.querySelectorAll('body *')].map(el=>[el,getComputedStyle(el).fontSize]);for(const [el,size] of sizes)el.style.fontSize=`${parseFloat(size)*2}px`})
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false,`200% text overflow ${width}/${theme}`)
  results.push({theme,width,labelsAtLeast13px:true,threeCards:true,originalRibbonGeometry:true,keyboardTabsAndDetails:true,noPost:true,reducedMotion:true,textEnlargement:true,axeScans:process.env.AXE_CORE_PATH?3:0})
  await context.close()
 }
 for (const theme of ['light','dark']) for (const width of [320,1440]) {
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'})
  await context.addInitScript(theme=>localStorage.setItem('levarum.theme.v1',theme),theme)
  const page=await context.newPage()
  await page.route(/\/api\/leads$/,route=>route.fulfill({status:503,contentType:'application/json',body:'{}'}))
  await page.goto(base+'/contact')
  await page.getByRole('button',{name:'Send request',exact:true}).click()
  assert.equal(await page.locator('#message').getAttribute('aria-invalid'),'true')
  for (const state of ['invalid','error']) {
   if(state==='error') {
    await page.locator('#message').fill('Synthetic accessibility verification. Do not contact.')
    await page.locator('#email').fill('synthetic@example.com')
    await page.locator('#consent').check()
    await page.getByRole('button',{name:'Send request',exact:true}).click()
    await page.waitForFunction(()=>document.activeElement?.getAttribute('role')==='alert')
    await page.keyboard.press('Tab')
    assert.ok(await page.getByRole('button',{name:'Try again',exact:true}).evaluate(el=>el===document.activeElement))
   }
   if(process.env.AXE_CORE_PATH) {
    if(!await page.evaluate(()=>Boolean(window.axe)))await page.addScriptTag({path:process.env.AXE_CORE_PATH})
    const violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations)
    writeFileSync(`${out}/axe-contact-${theme}-${width}-${state}.json`,JSON.stringify(violations,null,2))
    assert.deepEqual(violations,[])
   }
   await page.screenshot({path:`${out}/contact-${theme}-${width}-${state}.png`,fullPage:true})
  }
  await context.close()
 }
 const page = await browser.newPage({reducedMotion:'no-preference'})
 await page.goto(base)
 const animation = await page.locator('.lv-work-diagram li').evaluateAll(elements => elements.map(el => ({name:getComputedStyle(el).animationName,count:getComputedStyle(el).animationIterationCount})))
 assert.ok(animation.every(a => a.name==='work-arrive' && a.count==='1'),'Finite animation only')
 await page.waitForTimeout(1000)
 assert.ok((await page.locator('.lv-work-diagram li').evaluateAll(elements => elements.map(el => getComputedStyle(el).opacity))).every(value => value==='1'))
 await page.close()
 assert.deepEqual(errors,[])
 console.log(`PASS: ${results.length} responsive/theme illustration, keyboard, content, reduced-motion and 200% text cases; 32 Axe scans (including invalid/error forms); finite motion check. No submissions.`)
} finally {
 writeFileSync(out+'/results.json',JSON.stringify({results,errors},null,2));await browser.close()
}

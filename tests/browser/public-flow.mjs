const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
if(process.env.RUN_LIVE_SUBMISSIONS!=='1')throw new Error('This test saves synthetic records. Set RUN_LIVE_SUBMISSIONS=1 explicitly.')
import assert from 'node:assert/strict'
import {writeFileSync,mkdirSync,readFileSync} from 'node:fs'
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true})
const page=await browser.newPage({viewport:{width:1440,height:1000}})
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:5174'
if(process.env.TEST_COOKIE_FILE){
 const cookies=readFileSync(process.env.TEST_COOKIE_FILE,'utf8').split('\n').filter(line=>line.includes('\t')&&(!line.startsWith('#')||line.startsWith('#HttpOnly_'))).map(line=>{const p=line.replace('#HttpOnly_','').split('\t');return {domain:p[0],path:p[2],secure:p[3]==='TRUE',name:p[5],value:p[6],httpOnly:line.startsWith('#HttpOnly_')}})
 await page.context().addCookies(cookies)
}
const out=process.env.TEST_OUT||'work/browser-evidence';mkdirSync(out,{recursive:true})
const evidence=[],submissions=[],errors=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('request',r=>{if(r.method()==='POST'&&/\/api\/(leads|partners)$/.test(r.url()))submissions.push({endpoint:new URL(r.url()).pathname,body:r.postDataJSON()})})
for(const width of [320,390,768,1440]){
 await page.setViewportSize({width,height:900})
 for(const path of ['/','/how-it-works','/what-we-automate','/questions','/partners','/start','/privacy','/admin','/not-found']){
  await page.goto(base+path);await page.locator('h1').first().waitFor()
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)
  assert.equal(overflow,false,`Overflow ${path} at ${width}`)
  assert.ok((await page.locator('h1').first().innerText()).length)
  evidence.push({path,width,overflow})
  if([320,1440].includes(width)&&['/','/partners','/admin','/start'].includes(path)){await page.waitForTimeout(1000);await page.screenshot({path:`${out}/${width}-${path==='/'?'home':path.slice(1)}.png`,fullPage:true})}
 }
}
await page.goto(base+'/');await page.getByRole('button',{name:'Switch to dark theme'}).click();await page.reload()
assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');await page.getByRole('button',{name:'Switch to light theme'}).click()
await page.getByLabel('What kind of business is this?').selectOption('Online shop');await page.getByRole('link',{name:'Build my Game Plan',exact:true}).first().click()
assert.equal(await page.getByLabel('What kind of business is this?').inputValue(),'Online shop')
await page.getByRole('radio',{name:'Under 5 hours',exact:true}).focus();await page.keyboard.press('ArrowRight');assert.ok(await page.getByRole('radio',{name:'5 to 15 hours',exact:true}).isChecked())
await page.getByRole('button',{name:'Next',exact:true}).click();await page.getByRole('button',{name:'Next',exact:true}).click();assert.ok(await page.getByRole('alert').isVisible())
await page.getByRole('checkbox',{name:'Chasing invoices and payments'}).check();await page.getByRole('button',{name:'Next',exact:true}).click();await page.getByRole('button',{name:'Build my Game Plan',exact:true}).click()
await page.getByRole('button',{name:'← Back a step'}).focus();await page.keyboard.press('Enter');assert.match(await page.locator('h1').first().innerText(),/put together/)
await page.getByRole('button',{name:'Build my Game Plan',exact:true}).click()
await page.getByRole('button',{name:'Save and view my plan'}).click();assert.equal(await page.getByLabel('Email',{exact:true}).getAttribute('aria-invalid'),'true')
await page.getByLabel('Email',{exact:true}).fill('levarum-preview-check@example.com');await page.locator('#consent').check()
await page.route('**/api/leads',route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"synthetic failure"}'}))
await page.getByRole('button',{name:'Save and view my plan'}).click();await page.getByRole('alert').waitFor();assert.equal(await page.getByLabel('Email',{exact:true}).inputValue(),'levarum-preview-check@example.com');assert.match(await page.locator('h1').first().innerText(),/ready/)
await page.unroute('**/api/leads')
await page.getByRole('button',{name:'Save and view my plan'}).click();await page.getByRole('heading',{name:'A few jobs worth exploring.'}).waitFor({timeout:30000})
assert.equal(submissions[0].body.requestId,submissions[1].body.requestId)
await page.screenshot({path:`${out}/saved-plan.png`,fullPage:true})
await page.getByRole('button',{name:'Request a 15-minute call'}).click();await page.locator('#preferences').fill('Synthetic verification only. Do not contact. Eastern time.')
await page.getByRole('button',{name:'Send my call request'}).click();await page.getByRole('heading',{name:'Call request received.'}).waitFor({timeout:30000});assert.match(await page.locator('main').innerText(),/not a confirmed appointment/)
await page.goto(base+'/partners');await page.getByLabel('Your name').fill('Synthetic release verification — do not contact');await page.getByLabel('What do you do?').fill('Synthetic test record for preview verification only.');await page.getByRole('radio',{name:'Building the automations'}).check();await page.getByLabel('Email',{exact:true}).fill('levarum-preview-check@example.com');await page.locator('#consent').check();await page.getByRole('button',{name:'Put my name down'}).click();await page.getByRole('heading',{name:'Thanks. Your interest is saved.'}).waitFor({timeout:30000})
await page.goto(base+'/questions');const faq=page.getByRole('button',{name:'What does it cost?'});await faq.focus();const before=await faq.getAttribute('aria-expanded');await page.keyboard.press('Space');assert.notEqual(await faq.getAttribute('aria-expanded'),before)
await page.goto(base+'/');await page.keyboard.press('Tab');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement?.id),'lv-main')
assert.deepEqual(errors,[])
writeFileSync(`${out}/submissions.json`,JSON.stringify(submissions,null,2));writeFileSync(`${out}/results.json`,JSON.stringify({routes:evidence,errors,themeReload:true,choiceTransfer:true,keyboardRadio:true,keyboardBack:true,failedSaveRetained:true,retrySameId:true,planSaved:true,callTruthful:true,partnerSaved:true},null,2))
console.log('PASS: 36 responsive route checks; theme reload; choice transfer; keyboard radio/Back/FAQ/skip; validation; failed save and stable retry; real plan/call/partner saves.')
await browser.close()

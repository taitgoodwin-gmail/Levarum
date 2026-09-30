import assert from 'node:assert/strict'
import {writeFileSync,mkdirSync,readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const live=process.env.RUN_LIVE_SUBMISSIONS==='1'
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true})
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
const page=await context.newPage()
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:5174'
if(process.env.TEST_COOKIE_FILE){
 const cookies=readFileSync(process.env.TEST_COOKIE_FILE,'utf8').split('\n').filter(line=>line.includes('\t')&&(!line.startsWith('#')||line.startsWith('#HttpOnly_'))).map(line=>{const p=line.replace('#HttpOnly_','').split('\t');return {domain:p[0],path:p[2],secure:p[3]==='TRUE',name:p[5],value:p[6],httpOnly:line.startsWith('#HttpOnly_')}})
 await context.addCookies(cookies)
}
const out=process.env.TEST_OUT||'work/browser-evidence';mkdirSync(out,{recursive:true})
const evidence=[],submissions=[],errors=[],checks={}
let mode='success',releasePending,requestPending
page.on('pageerror',e=>errors.push(e.message))
page.on('request',request=>{if(request.method()==='POST'&&/\/api\/(leads|partners)$/.test(request.url()))submissions.push({endpoint:new URL(request.url()).pathname,body:request.postDataJSON()})})
await page.route(/\/api\/(leads|partners)$/,async route=>{
 if(mode==='failure'){await route.fulfill({status:503,contentType:'application/json',body:'{"error":"Synthetic storage failure"}'});return}
 if(mode==='pending'){await new Promise(resolve=>{releasePending=resolve;requestPending?.()})}
 if(live)await route.continue()
 else await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({saved:true,reference:route.request().postDataJSON().requestId})})
})
const heading=name=>page.getByRole('heading',{name,exact:true})
const submitIdeas=()=>page.getByRole('button',{name:'See my ideas'}).click()
try{
 await page.goto(base+'/')
 for(const theme of ['light','dark']){
  await page.evaluate(theme=>localStorage.setItem('levarum.theme.v1',theme),theme)
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900})
   for(const path of ['/','/how-it-works','/what-we-automate','/questions','/partners','/start','/privacy','/admin','/not-found']){
    await page.goto(base+path);await page.locator('h1').first().waitFor()
    await page.evaluate(()=>document.fonts.ready)
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow ${path} ${width} ${theme}`)
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme,`Theme ${path}`)
    if(path==='/admin'){
     // Clerk renders a separate sign-in widget heading; audit the application heading independently.
     const appHeading=page.locator('.lv-form-page > h1, #admin-main > h1')
     assert.equal(await appHeading.count(),1,'One admin application heading')
     assert.match(await appHeading.innerText(),/^(Sign in\.|Requests|Admin setup is in progress\.)$/)
    }else assert.equal(await page.locator('h1').count(),1,`Single main heading ${path}`)
    evidence.push({path,width,theme,overflow:false})
    if([320,1440].includes(width)&&['/','/partners','/admin','/start'].includes(path))await page.screenshot({path:`${out}/${theme}-${width}-${path==='/'?'home':path.slice(1)}.png`,fullPage:true})
   }
  }
 }
 checks.responsiveRoutes=evidence.length
 await page.setViewportSize({width:320,height:900});await page.goto(base+'/')
 const mobileMenu=page.locator('header details').first(),menuSummary=mobileMenu.locator('summary')
 await menuSummary.focus();await page.keyboard.press('Enter');assert.equal(await mobileMenu.getAttribute('open'),'')
 await page.keyboard.press('Escape');assert.equal(await mobileMenu.getAttribute('open'),null)
 assert.ok(await menuSummary.evaluate(el=>el===document.activeElement));checks.mobileMenuKeyboard=true
 await page.setViewportSize({width:1440,height:1000})
 await page.goto(base+'/')
 await page.getByRole('button',{name:'Switch to light theme'}).click();await page.reload()
 assert.equal(await page.locator('html').getAttribute('data-theme'),'light')
 await page.getByRole('button',{name:'Switch to dark theme'}).click();await page.reload()
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');checks.themePersistence=true
 await page.getByRole('button',{name:'Switch to light theme'}).click()
 await page.goto(base+'/start');await submitIdeas()
 assert.equal(await page.locator('#business').getAttribute('aria-invalid'),'true')
 assert.equal(submissions.length,0)
 await page.locator('#business').selectOption('Online shop')
 await page.getByRole('radio',{name:'Under 5 hours',exact:true}).focus();await page.keyboard.press('ArrowRight')
 assert.ok(await page.getByRole('radio',{name:'5 to 15 hours',exact:true}).isChecked());checks.keyboardRadio=true
 await submitIdeas();await page.getByRole('alert').waitFor()
 assert.match(await page.getByRole('alert').innerText(),/Choose at least one task/)
 assert.equal(await page.evaluate(()=>document.activeElement?.tagName),'FIELDSET')
 await page.getByRole('checkbox',{name:'Chasing invoices and payments'}).check()
 await page.getByRole('checkbox',{name:'Booking people in and sending reminders'}).check()
 await submitIdeas();await heading('A few places to start.').waitFor()
 await heading('Keep invoice follow-up consistent.').waitFor();await heading('Reduce scheduling back-and-forth.').waitFor()
 assert.equal(await page.locator('article.lv-guidance').count(),2)
 assert.equal(submissions.length,0);assert.equal(await page.getByLabel('Email',{exact:true}).count(),0)
 assert.match(await page.locator('main').innerText(),/Nothing has been submitted/);checks.guidanceBeforeContact=true
 await page.getByRole('button',{name:'Edit answers',exact:true}).click()
 assert.equal(await page.locator('#business').inputValue(),'Online shop')
 assert.ok(await page.getByRole('radio',{name:'5 to 15 hours',exact:true}).isChecked())
 assert.ok(await page.getByRole('checkbox',{name:'Chasing invoices and payments'}).isChecked());checks.editRetainsAnswers=true
 await submitIdeas();await page.getByRole('button',{name:'Discuss these ideas',exact:true}).click()
 await page.getByRole('button',{name:'Send my follow-up request',exact:true}).click()
 assert.equal(await page.locator('#email').getAttribute('aria-invalid'),'true');assert.equal(submissions.length,0)
 await page.locator('#email').fill('levarum-redesign-test@example.com')
 await page.locator('#consent').check();await page.getByRole('radio',{name:'Request a 15-minute call',exact:true}).check()
 assert.equal(await page.locator('#consent').isChecked(),false)
 await page.locator('#preferences').fill('Synthetic verification only. Do not contact. Eastern time.')
 await page.locator('#consent').check();await page.getByRole('radio',{name:'Email me about these ideas',exact:true}).check()
 assert.equal(await page.locator('#consent').isChecked(),false)
 await page.getByRole('button',{name:'Send my follow-up request',exact:true}).click()
 assert.equal(submissions.length,0);checks.consentPurposeReset=true
 await page.locator('#consent').check();mode='failure'
 await page.getByRole('button',{name:'Send my follow-up request',exact:true}).click();await page.getByRole('alert').waitFor()
 assert.equal(await page.locator('#email').inputValue(),'levarum-redesign-test@example.com')
 assert.ok(await page.locator('#consent').isChecked());assert.ok(await heading('Talk through the next step.').isVisible())
 assert.equal(submissions.length,1);assert.equal(submissions[0].body.preferences,'');checks.failedSaveRetainsInput=true
 mode='pending';const waiting=new Promise(resolve=>{requestPending=resolve})
 await page.getByRole('button',{name:'Send my follow-up request',exact:true}).click();await Promise.race([waiting,new Promise((_,reject)=>setTimeout(()=>reject(Error('Pending submission was not intercepted')),10000))])
 assert.ok(await page.locator('#email').isDisabled());assert.ok(await page.locator('#consent').isDisabled())
 assert.ok(await page.getByRole('radio',{name:'Request a 15-minute call',exact:true}).isDisabled())
 assert.ok(await page.getByRole('button',{name:'Back to my ideas',exact:true}).isDisabled())
 assert.ok(await page.getByRole('button',{name:'Saving your request…',exact:true}).isDisabled())
 assert.equal(await heading('Your request is saved.').count(),0)
 assert.equal(submissions[0].body.requestId,submissions[1].body.requestId)
 checks.pendingDisablesChanges=true;checks.stableRetryId=true;releasePending();mode='success'
 await heading('Your request is saved.').waitFor({timeout:30000})
 assert.match(await page.locator('main').innerText(),/follow-up request is saved/)
 assert.match(await page.locator('main').innerText(),/not been automatically emailed/);checks.followupReceipt=true
 await page.screenshot({path:`${out}/followup-receipt.png`,fullPage:true})
 await page.getByRole('button',{name:'Back to my ideas',exact:true}).click()
 assert.match(await page.locator('main').innerText(),/earlier follow-up request/)
 await page.getByRole('button',{name:'Discuss these ideas',exact:true}).click()
 assert.equal(await page.locator('#consent').isChecked(),false)
 await page.getByRole('radio',{name:'Request a 15-minute call',exact:true}).check()
 assert.equal(await page.locator('#preferences').inputValue(),'Synthetic verification only. Do not contact. Eastern time.')
 await page.locator('#consent').check();await page.getByRole('button',{name:'Send my call request',exact:true}).click()
 await heading('Your request is saved.').waitFor({timeout:30000})
 assert.match(await page.locator('main').innerText(),/call request is saved/)
 assert.match(await page.locator('main').innerText(),/not a confirmed appointment/)
 assert.equal(submissions[2].body.intent,'call');assert.notEqual(submissions[1].body.requestId,submissions[2].body.requestId);checks.callReceipt=true
 await page.goto(base+'/partners')
 await page.getByLabel('Your name').fill('Synthetic redesign verification — do not contact')
 await page.getByLabel('What do you do?').fill('Synthetic test record for preview verification only.')
 await page.getByRole('radio',{name:'Building the automations'}).check()
 await page.getByLabel('Email',{exact:true}).fill('levarum-redesign-test@example.com')
 await page.getByRole('button',{name:'Send partner interest',exact:true}).click();assert.equal(submissions.length,3)
 await page.locator('#consent').check();await page.getByRole('button',{name:'Send partner interest',exact:true}).click()
 await heading('Your partner interest is saved.').waitFor({timeout:30000})
 assert.match(await page.locator('main').innerText(),/not an offer of work/);assert.equal(submissions.length,4);assert.ok(submissions.every(s=>s.body.consent===true));checks.partnerReceipt=true
 await page.goto(base+'/questions')
 const faq=page.locator('details').filter({has:page.locator('summary',{hasText:'What does it cost?'})}).first()
 await faq.locator('summary').focus();await page.keyboard.press('Space');assert.equal(await faq.getAttribute('open'),'')
 await page.keyboard.press('Space');assert.equal(await faq.getAttribute('open'),null);checks.nativeFaqKeyboard=true
 await page.goto(base+'/');await page.keyboard.press('Tab');await page.keyboard.press('Enter')
 assert.equal(await page.evaluate(()=>document.activeElement?.id),'lv-main');checks.skipLink=true
 let axePath
 try{axePath=process.env.AXE_CORE_PATH||createRequire(import.meta.url).resolve('axe-core/axe.min.js')}catch{}
 if(axePath){
  await page.addScriptTag({path:axePath})
  const audit=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}))
  writeFileSync(`${out}/axe-home.json`,JSON.stringify(audit.violations,null,2));assert.equal(audit.violations.length,0,'Axe home violations');checks.axeHome='passed'
 }else checks.axeHome='not installed; automated audit not run'
 assert.deepEqual(errors,[])
 writeFileSync(`${out}/results.json`,JSON.stringify({mode:live?'live synthetic saves':'mocked saves',routes:evidence,checks,errors},null,2))
 console.log(`PASS: ${evidence.length} responsive route/theme checks; guidance before contact; consent; failed/pending saves; stable retries; distinct receipts; partner; keyboard navigation. Saves: ${live?'LIVE synthetic':'MOCKED'}.`)
}finally{
 writeFileSync(`${out}/submissions.json`,JSON.stringify(submissions,null,2))
 await browser.close()
}

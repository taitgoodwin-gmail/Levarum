import assert from 'node:assert/strict'
import {writeFileSync,mkdirSync,readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const live=process.env.RUN_LIVE_SUBMISSIONS==='1'
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true})
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'})
const page=await context.newPage()
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:5174'
if(process.env.TEST_ACCESS_URL_FILE){
 try{await page.goto(readFileSync(process.env.TEST_ACCESS_URL_FILE,'utf8').trim())}
 catch{throw Error('Could not open the temporary preview access link')}
}
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
const syntheticEmail='levarum-reimagination-test@example.com'
try{
 await page.goto(base+'/')
 for(const theme of ['light','dark']){
  await page.evaluate(theme=>localStorage.setItem('levarum.theme.v1',theme),theme)
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900})
   for(const path of ['/','/how-it-works','/what-we-automate','/questions','/partners','/start','/contact','/privacy','/admin','/not-found']){
    await page.goto(base+path);await page.locator('h1:visible').first().waitFor()
    await page.evaluate(()=>document.fonts.ready)
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow ${path} ${width} ${theme}`)
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme,`Theme ${path}`)
    if(path==='/admin'){
     const appHeading=page.locator('.lv-form-page > h1:visible, #admin-main > h1:visible')
     assert.equal(await appHeading.count(),1,'One admin application heading')
     assert.match(await appHeading.innerText(),/^(Sign in\.|Requests|Admin setup is in progress\.)$/)
    }else assert.equal(await page.locator('h1:visible').count(),1,`Single visible main heading ${path}`)
    evidence.push({path,width,theme,overflow:false})
    if([320,1440].includes(width)&&['/','/partners','/admin','/start','/contact'].includes(path))await page.screenshot({path:`${out}/${theme}-${width}-${path==='/'?'home':path.slice(1)}.png`,fullPage:true})
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
 // Native scenario radios expose meaningful different outcomes and never send data.
 await page.getByRole('radio',{name:'Routine invoice',exact:true}).focus()
 await heading('Use the approved reminder').waitFor()
 await page.keyboard.press('ArrowRight')
 assert.ok(await page.getByRole('radio',{name:'Disputed invoice',exact:true}).isChecked())
 await heading('Ask a person to review').waitFor()
 assert.match(await page.locator('.lv-human-boundary').innerText(),/human judgment/)
 await page.keyboard.press('ArrowRight')
 assert.ok(await page.getByRole('radio',{name:'Missing payment data',exact:true}).isChecked())
 await heading('Pause and flag the missing data').waitFor()
 assert.match(await page.locator('.lv-human-boundary').innerText(),/Missing information/)
 assert.equal(submissions.length,0);checks.scenarioKeyboardAndNoPost=true
 // Guidance is available immediately, without business/hours/email collection.
 await page.goto(base+'/start')
 await heading('One task. A clearer next step.').waitFor()
 assert.equal(await page.locator('#business:visible, input[name="hours"]:visible, #email:visible').count(),0)
 await page.getByRole('button',{name:'Invoices and payments',exact:true}).focus();await page.keyboard.press('Enter')
 await heading('Keep invoice follow-up consistent.').waitFor()
 assert.equal(await page.getByRole('button',{name:'Invoices and payments',exact:true}).getAttribute('aria-pressed'),'true')
 assert.match(await page.locator('#task-guidance').innerText(),/Pause reminders for disputed invoices/)
 await page.getByRole('button',{name:'Booking and reminders',exact:true}).click()
 await heading('Reduce scheduling back-and-forth.').waitFor()
 assert.match(await page.locator('#task-guidance').innerText(),/change appointments/)
 assert.equal(await page.getByRole('button',{name:'Invoices and payments',exact:true}).getAttribute('aria-pressed'),'false')
 assert.equal(submissions.length,0);checks.guidanceBeforeContact=true;checks.taskSpecificGuidance=true
 await page.goto(base+'/start?task=invoices');await heading('Keep invoice follow-up consistent.').waitFor();checks.taskDeepLink=true
 await page.getByRole('button',{name:'Discuss this task',exact:true}).click();await heading('Discuss your work.').waitFor()
 assert.equal(await page.locator('#message').getAttribute('required'),null)
 assert.equal(await page.locator('#business').getAttribute('required'),null)
 await page.getByRole('button',{name:'Send my follow-up request',exact:true}).click()
 assert.equal(await page.locator('#email').getAttribute('aria-invalid'),'true');assert.equal(submissions.length,0)
 await page.locator('#email').fill(syntheticEmail)
 await page.locator('#message').fill('Synthetic verification only. Do not contact.')
 await page.locator('#consent').check()
 await page.getByRole('button',{name:'Back to task ideas',exact:true}).click()
 await page.getByRole('button',{name:'Customer questions',exact:true}).click()
 await page.getByRole('button',{name:'Discuss this task',exact:true}).click()
 assert.equal(await page.locator('#email').inputValue(),syntheticEmail)
 assert.equal(await page.locator('#message').inputValue(),'Synthetic verification only. Do not contact.')
 assert.equal(await page.locator('#consent').isChecked(),false);checks.taskChangeConsentReset=true;checks.backRetainsDraft=true
 await page.locator('#consent').check();await page.getByRole('radio',{name:'Request a call',exact:true}).check()
 assert.equal(await page.locator('#consent').isChecked(),false)
 await page.locator('#preferences').fill('Synthetic verification only. Eastern time. Do not contact.')
 await page.locator('#consent').check();await page.getByRole('radio',{name:'Email follow-up',exact:true}).check()
 assert.equal(await page.locator('#consent').isChecked(),false)
 await page.getByRole('button',{name:'Send my follow-up request',exact:true}).click()
 assert.equal(submissions.length,0);checks.consentPurposeReset=true
 await page.locator('#consent').check();mode='failure'
 await page.getByRole('button',{name:'Send my follow-up request',exact:true}).click();await page.getByRole('alert').waitFor()
 await page.waitForFunction(()=>document.activeElement?.getAttribute('role')==='alert')
 await page.keyboard.press('Tab')
 assert.equal(await page.evaluate(()=>document.activeElement?.textContent),'Send my follow-up request')
 checks.failedSaveFocusRecovery=true
 assert.equal(await page.locator('#email').inputValue(),syntheticEmail)
 assert.ok(await page.locator('#consent').isChecked());assert.ok(await heading('Discuss your work.').isVisible())
 assert.equal(submissions.length,1);assert.equal(submissions[0].body.preferences,'')
 assert.equal(submissions[0].body.schemaVersion,2);assert.deepEqual(submissions[0].body.pains,['questions'])
 assert.equal('hours' in submissions[0].body,false);assert.equal('business' in submissions[0].body,false)
 checks.failedSaveRetainsInput=true;checks.noFabricatedContext=true
 mode='pending';const waiting=new Promise(resolve=>{requestPending=resolve})
 await page.getByRole('button',{name:'Send my follow-up request',exact:true}).click();await Promise.race([waiting,new Promise((_,reject)=>setTimeout(()=>reject(Error('Pending submission was not intercepted')),10000))])
 for(const id of ['email','message','business','consent'])assert.ok(await page.locator(`#${id}`).isDisabled(),`Pending lock ${id}`)
 assert.ok(await page.getByRole('radio',{name:'Request a call',exact:true}).isDisabled())
 assert.ok(await page.getByRole('button',{name:'Back to task ideas',exact:true}).isDisabled())
 assert.ok(await page.getByRole('button',{name:'Saving your request…',exact:true}).isDisabled())
 assert.equal(await heading('Your request is saved.').count(),0)
 assert.equal(submissions[0].body.requestId,submissions[1].body.requestId)
 checks.pendingDisablesChanges=true;checks.stableRetryId=true;releasePending();releasePending=undefined;mode='success'
 await heading('Your request is saved.').waitFor({timeout:30000})
 assert.match(await page.locator('main').innerText(),/email follow-up request is saved/)
 assert.match(await page.locator('main').innerText(),/No automatic email has been sent/);checks.followupReceipt=true
 await page.screenshot({path:`${out}/followup-receipt.png`,fullPage:true})
 // Direct contact bypasses exploration but requires a real description.
 await page.goto(base+'/contact')
 await heading('Discuss your work.').waitFor()
 await page.locator('#email').fill(syntheticEmail);await page.locator('#consent').check()
 await page.getByRole('button',{name:'Send my follow-up request',exact:true}).click()
 assert.equal(await page.locator('#message').getAttribute('aria-invalid'),'true');assert.equal(submissions.length,2)
 await page.locator('#message').fill('Synthetic direct-contact verification. Do not contact. Please test inquiry routing.')
 await page.getByRole('radio',{name:'Request a call',exact:true}).check();assert.equal(await page.locator('#consent').isChecked(),false)
 await page.locator('#preferences').fill('Synthetic verification. Eastern time; do not contact.')
 await page.locator('#consent').check();await page.getByRole('button',{name:'Send my call request',exact:true}).click()
 await heading('Your request is saved.').waitFor({timeout:30000})
 assert.match(await page.locator('main').innerText(),/call request is saved/)
 assert.match(await page.locator('main').innerText(),/not a confirmed appointment/)
 assert.equal(submissions[2].body.intent,'call');assert.deepEqual(submissions[2].body.pains,[])
 assert.notEqual(submissions[1].body.requestId,submissions[2].body.requestId);checks.callReceipt=true;checks.directContactMessageRequired=true
 await page.goto(base+'/partners')
 await page.getByLabel('Your name').fill('Synthetic reimagination verification — do not contact')
 await page.getByLabel('What do you do?').fill('Synthetic test record for preview verification only.')
 await page.getByRole('radio',{name:'Building the automations'}).check()
 await page.getByLabel('Email',{exact:true}).fill(syntheticEmail)
 await page.getByRole('button',{name:'Send partner interest',exact:true}).click();assert.equal(submissions.length,3)
 await page.locator('#consent').check();await page.getByRole('button',{name:'Send partner interest',exact:true}).click()
 await heading('Your partner interest is saved.').waitFor({timeout:30000})
 assert.match(await page.locator('main').innerText(),/not an offer of work/);assert.equal(submissions.length,4);assert.ok(submissions.every(s=>s.body.consent===true));checks.partnerReceipt=true
 // Refresh honestly clears drafts; arbitrary query values cannot select a task.
 await page.goto(base+'/contact');await page.locator('#email').fill(syntheticEmail);await page.locator('#message').fill('Unsaved synthetic draft');await page.reload()
 assert.equal(await page.locator('#email').inputValue(),'');assert.equal(await page.locator('#message').inputValue(),'');checks.refreshClearsDraft=true
 await page.goto(base+'/start?task=not-a-task');await heading('One task. A clearer next step.').waitFor();checks.invalidTaskRecovery=true
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
 console.log(`PASS: ${evidence.length} responsive route/theme checks; scenario demo; task-first guidance; direct contact; consent; failed/pending saves; stable retries; receipts; partner; keyboard. Saves: ${live?'LIVE synthetic':'MOCKED'}.`)
}finally{
 releasePending?.()
 writeFileSync(`${out}/submissions.json`,JSON.stringify(submissions,null,2))
 await browser.close()
}

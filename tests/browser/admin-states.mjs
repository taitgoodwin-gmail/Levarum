import assert from 'node:assert/strict'
import {mkdirSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {createServer} from 'vite'
import react from '@vitejs/plugin-react'
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const out=process.env.TEST_OUT||'work/admin-states';mkdirSync(out,{recursive:true})
// Isolated frontend only: no real API middleware, credentials, provider or customer data.
const server=await createServer({configFile:false,envDir:false,plugins:[react(),{name:'synthetic-admin-route',configureServer(s){s.middlewares.use((req,res,next)=>{if(req.url?.startsWith('/api/')){res.statusCode=503;res.end('Fixture interception required');return}if(req.url?.startsWith('/admin'))req.url='/admin.html';next()})}}],resolve:{alias:{'@clerk/react':resolve('tests/fixtures/admin-auth.tsx')}},define:{'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY':JSON.stringify('synthetic-key')},server:{host:'127.0.0.1',port:0}})
await server.listen();const base=`http://127.0.0.1:${server.httpServer.address().port}`
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true}),results=[],errors=[]
const id='a'.repeat(64)
const row={id,kind:'call',received_at:'2026-10-01T12:00:00Z',status:'New',version:0,summary:{sender:'alex@example.com',task:'Review invoice admin'}}
const inbox={leads:[row],total:1,counts:[{status:'New',count:1}],sync:{last_complete:null,in_progress:false}}
const detail={record:row,lead:{email:'synthetic@example.com',message:'Synthetic private fixture',consent:true},events:[]}
const flush=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))
async function setup(width=390,theme='dark'){
 const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'})
 await context.addInitScript(theme=>localStorage.setItem('levarum.theme.v1',theme),theme)
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message))
 await page.route('**/*',route=>new URL(route.request().url()).origin===base?route.continue():route.abort())
 let handler=async route=>route.fulfill({json:route.request().url().includes('action=detail')?detail:inbox})
 await page.route('**/api/admin?**',route=>handler(route))
 return {page,context,setHandler:fn=>{handler=fn}}
}
try{
 // Regression: an old request must not deny a newer successfully loaded view.
 const race=await setup();let queued=[],defer=true,ready
 const requestStarted=new Promise(resolve=>{ready=resolve})
 race.setHandler(route=>defer?new Promise(resolve=>{queued.push({route,resolve});ready()}):route.fulfill({json:detail}))
 await race.page.goto(`${base}/admin/leads/${id}`);await race.page.getByText('Working…',{exact:true}).waitFor()
 await requestStarted
 assert.ok(queued.length)
 defer=false;await race.page.evaluate(()=>window.dispatchEvent(new Event('focus')))
 await race.page.getByText('Synthetic private fixture',{exact:true}).waitFor()
 for(const item of queued){await item.route.fulfill({status:401,json:{error:'Expired older request'}});item.resolve()}
 await flush(race.page)
 assert.ok(await race.page.getByText('Synthetic private fixture',{exact:true}).isVisible(),'Late denial must not clear a newer successful view')
 assert.equal(await race.page.getByRole('alert').count(),0)
 results.push('late stale denial ignored');await race.context.close()

 const identify=await setup()
 identify.setHandler(route=>route.fulfill({json:{...inbox,leads:[row,{...row,id:'b'.repeat(64),summary:{sender:'blair@example.com',task:'Booking reminders'}},{...row,id:'c'.repeat(64),summary:null}],total:3,counts:[{status:'New',count:12}]}}))
 await identify.page.goto(base+'/admin?kind=call');await identify.page.getByText('alex@example.com',{exact:true}).waitFor()
 assert.equal(await identify.page.locator('article').filter({hasText:'alex@example.com'}).count(),1)
 assert.equal(await identify.page.locator('article').filter({hasText:'blair@example.com'}).count(),1)
 assert.ok(await identify.page.getByText('Summary unavailable. Open request for details.',{exact:true}).isVisible())
 assert.match(await identify.page.locator('.admin-counts').innerText(),/12/)
 assert.ok(await identify.page.getByText('All indexed requests · counts include every type and status, regardless of filters.',{exact:true}).isVisible())
 results.push('recognizable independent senders/tasks, unavailable fallback and explicit global counts');await identify.context.close()
 for(const width of [320,390,1440])for(const theme of ['light','dark']){
 const {page,context,setHandler}=await setup(width,theme)
 await page.goto(`${base}/admin`);await page.getByRole('link',{name:'View request'}).waitFor()
 assert.equal(await page.evaluate(()=>!!document.querySelector('vite-error-overlay')),false)
 await page.getByLabel('Request type').selectOption('call');await page.getByRole('link',{name:'View request'}).waitFor()
 assert.match(page.url(),/kind=call/)
 assert.ok(await page.getByText('alex@example.com',{exact:true}).isVisible())
 assert.ok(await page.getByText('Review invoice admin',{exact:true}).isVisible())
 assert.ok(await page.getByText('All indexed requests · counts include every type and status, regardless of filters.',{exact:true}).isVisible())
 await page.getByRole('link',{name:'View request'}).click();await page.getByText('Synthetic private fixture',{exact:true}).waitFor()
 assert.ok(await page.getByRole('button',{name:'Booked',exact:true}).isVisible())
 assert.ok(await page.locator('h1').evaluate(el=>el===document.activeElement))
 let mutationBodies=[],release,postCount=0
 setHandler(async route=>{if(route.request().method()==='POST'){mutationBodies.push(route.request().postDataJSON());postCount++;if(postCount===1){await new Promise(r=>{release=r});return route.fulfill({status:503,json:{error:'Synthetic temporary failure'}})}return route.fulfill({status:409,json:{error:'This request changed. Refresh its details before trying again.'}})}return route.fulfill({json:detail})})
 await page.getByRole('button',{name:'Contacted',exact:true}).click();await page.getByText('Working…',{exact:true}).waitFor()
 assert.ok(await page.getByRole('button',{name:'Done',exact:true}).isDisabled());assert.equal(postCount,1)
 release();await page.getByRole('alert').waitFor()
 await page.getByRole('button',{name:'Contacted',exact:true}).click();await page.getByText('This request changed. Refresh its details before trying again.',{exact:true}).waitFor()
 assert.equal(mutationBodies[0].mutationId,mutationBodies[1].mutationId,'Unchanged retry preserves mutation ID')
 setHandler(route=>route.fulfill({json:{...detail,record:{...row,status:'Done',version:1}}}))
 await page.getByRole('button',{name:'Refresh request data'}).click();await page.getByText('Done · Received',{exact:false}).waitFor()
 assert.ok(await page.getByRole('button',{name:'Done',exact:true}).isDisabled())
 if(process.env.AXE_CORE_PATH){await page.addScriptTag({path:process.env.AXE_CORE_PATH});const violations=await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations);assert.deepEqual(violations,[])}
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 await page.screenshot({path:`${out}/detail-${width}-${theme}.png`})
 // Current denials clear records and prevent further reads until a new session.
 let reads=0;setHandler(route=>{reads++;return route.fulfill({status:403,json:{error:'Synthetic current session denied'}})})
 await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await page.getByText('Access denied. Sign out, then sign in again.',{exact:true}).waitFor()
 assert.equal(await page.getByText('Synthetic private fixture',{exact:true}).count(),0)
 const deniedReads=reads
 await page.evaluate(()=>window.dispatchEvent(new Event('pageshow')));await flush(page)
 assert.equal(reads,deniedReads,'Denied session must not re-fetch on pageshow')
 // Sign-out failure remains denied and cannot silently reload private content.
 setHandler(route=>route.fulfill({json:detail}))
 await page.evaluate(()=>window.adminFixture.update({signOutFails:true}))
 await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByText('Sign-out could not complete. Retry to end your session.',{exact:true}).waitFor()
 assert.equal(await page.getByText('Synthetic private fixture',{exact:true}).count(),0)
 results.push({width,theme,loading:true,retry:true,conflict:true,focus:true,denial:true,logoutFailure:true,axeScans:process.env.AXE_CORE_PATH?1:0})
 await context.close()
 }
 // Empty/error recovery, lifecycle clearing and same-signed-in account changes.
 const {page,context,setHandler}=await setup()
 setHandler(route=>route.fulfill({status:503,json:{error:'Synthetic unavailable'}}))
 await page.goto(`${base}/admin`);await page.getByRole('alert').waitFor()
 setHandler(route=>route.fulfill({json:{...inbox,leads:[],total:0,counts:[]}}))
 await page.getByRole('button',{name:'Refresh request data'}).click();await page.getByText('No indexed requests match these filters.',{exact:true}).waitFor()
 setHandler(route=>route.fulfill({json:inbox}))
 await page.evaluate(()=>window.adminFixture.update({userId:'synthetic-second-owner',sessionId:'synthetic-second-session'}))
 await page.getByRole('link',{name:'View request'}).waitFor()
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await flush(page)
 assert.equal(await page.getByRole('link',{name:'View request'}).count(),0)
 await page.evaluate(()=>window.dispatchEvent(new Event('pageshow')));await page.getByRole('link',{name:'View request'}).waitFor()
 await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByText('Synthetic sign-in fixture',{exact:true}).waitFor()
 assert.equal(await page.getByRole('link',{name:'View request'}).count(),0)
 results.push('empty/error recovery, account change, pagehide/pageshow, logout');await context.close()
 // A proxy/provider can return an HTML denial instead of JSON.
 for(const deniedStatus of [401,403]){
 const malformed=await setup();await malformed.page.goto(`${base}/admin/leads/${id}`);await malformed.page.getByText('Synthetic private fixture',{exact:true}).waitFor()
 malformed.setHandler(route=>route.fulfill({status:deniedStatus,contentType:'text/html',body:'<html>Synthetic denial</html>'}))
 await malformed.page.getByRole('button',{name:'Contacted',exact:true}).click();await malformed.page.getByRole('alert').waitFor()
 assert.equal(await malformed.page.getByText('Synthetic private fixture',{exact:true}).count(),0,'Non-JSON denial must clear private content')
 assert.ok(await malformed.page.getByText('Access denied. Sign out, then sign in again.',{exact:true}).isVisible())
 await malformed.page.screenshot({path:`${out}/non-json-denial-${deniedStatus}.png`})
 results.push(`non-JSON ${deniedStatus} denial clears private data`);await malformed.context.close()
 }
 // A missing response body must not imply a mutation failed or succeeded.
 const uncertain=await setup();let attempts=[]
 uncertain.setHandler(route=>{if(route.request().method()==='POST'){attempts.push(route.request().postDataJSON());return attempts.length===1?route.fulfill({status:200,contentType:'text/html',body:'<html>synthetic invalid response</html>'}):route.fulfill({json:{saved:true,status:'Contacted',version:1}})}return route.fulfill({json:detail})})
 await uncertain.page.goto(`${base}/admin/leads/${id}`);await uncertain.page.getByText('Synthetic private fixture',{exact:true}).waitFor()
 await uncertain.page.getByRole('button',{name:'Contacted',exact:true}).click();await uncertain.page.getByRole('alert').waitFor()
 assert.match(await uncertain.page.getByRole('alert').innerText(),/couldn’t read the server response.*may already have saved/s)
 assert.equal(await uncertain.page.locator('.admin-notice').innerText(),'')
 await uncertain.page.getByRole('button',{name:'Contacted',exact:true}).click();await uncertain.page.getByText('Request status is Contacted. No email or calendar invitation was sent.',{exact:true}).waitFor()
 assert.equal(attempts[0].mutationId,attempts[1].mutationId)
 results.push('malformed success response remains uncertain; unchanged mutation retry keeps ID');await uncertain.context.close()
 // The actual 20-second budget includes provider-token retrieval, not only fetch.
 const tokenWait=await setup();await tokenWait.page.goto(`${base}/admin/leads/${id}`);await tokenWait.page.getByText('Synthetic private fixture',{exact:true}).waitFor()
 let tokenWaitPosts=0;tokenWait.setHandler(route=>{if(route.request().method()==='POST')tokenWaitPosts++;return route.fulfill({json:detail})})
 await tokenWait.page.evaluate(()=>window.adminFixture.update({tokenPending:true}))
 const started=Date.now();await tokenWait.page.getByRole('button',{name:'Contacted',exact:true}).click()
 await tokenWait.page.getByText('We couldn’t confirm the result in time. Refresh request data before retrying; a change may already have saved.',{exact:true}).waitFor({timeout:25000})
 assert.ok(Date.now()-started>=19000);assert.equal(tokenWaitPosts,0)
 assert.equal(await tokenWait.page.getByText('Working…',{exact:true}).count(),0)
 await tokenWait.page.screenshot({path:`${out}/token-timeout.png`})
 await tokenWait.page.evaluate(()=>window.adminFixture.update({tokenPending:false}))
 await tokenWait.page.getByRole('button',{name:'Refresh request data',exact:true}).click();await tokenWait.page.getByText('Synthetic private fixture',{exact:true}).waitFor()
 await tokenWait.page.getByRole('alert').waitFor({state:'hidden'})
 await tokenWait.page.getByText('Synthetic private fixture',{exact:true}).waitFor()
 results.push('real 20-second token wait timeout, no mutation sent, refresh recovery');await tokenWait.context.close()
 // Success/reconciliation notices describe saving, never automatic communication.
 const success=await setup();let saved=false
 success.setHandler(route=>{
  const url=route.request().url()
  if(url.includes('action=status')){saved=true;return route.fulfill({json:{saved:true,status:'Contacted',version:1}})}
  if(url.includes('action=sync'))return route.fulfill({json:{hasMore:true}})
  return route.fulfill({json:url.includes('action=detail')?{...detail,record:{...row,status:saved?'Contacted':'New',version:saved?1:0}}:inbox})
 })
 await success.page.goto(`${base}/admin/leads/${id}`);await success.page.getByText('Synthetic private fixture',{exact:true}).waitFor()
 await success.page.getByRole('button',{name:'Contacted',exact:true}).focus();await success.page.keyboard.press('Enter')
 await success.page.getByText('Request status is Contacted. No email or calendar invitation was sent.',{exact:true}).waitFor()
 await success.page.getByRole('link',{name:'← Back to requests'}).click();await success.page.getByRole('link',{name:'View request'}).waitFor()
 await success.page.getByText('Check for missing requests',{exact:true}).click()
 await success.page.getByRole('button',{name:'Check saved requests',exact:true}).click()
 await success.page.getByText('This batch is checked. Continue checking to include the remaining saved requests.',{exact:true}).waitFor()
 // Missing token must not make an API call, nor recover on a lifecycle refresh.
 let tokenlessWrites=0;success.setHandler(route=>{tokenlessWrites++;return route.fulfill({json:inbox})})
 await success.page.evaluate(()=>{window.adminFixture.update({token:''});window.dispatchEvent(new Event('pageshow'))})
 await success.page.getByText('Session ended. Sign out, then sign in again.',{exact:true}).waitFor()
 assert.equal(tokenlessWrites,0)
 results.push('keyboard successful mutation, partial reconciliation, missing-token denial');await success.context.close()
 assert.deepEqual(errors,[])
 console.log('PASS isolated admin UI: stale responses, six width/theme cases, loading/error/retry/conflict, focus, denial, account change, lifecycle and logout; synthetic provider/API only')
}catch(error){errors.push(error.message);throw error}finally{writeFileSync(`${out}/results.json`,JSON.stringify({results,errors,limits:'Synthetic provider and API responses; not live authentication or storage verification.'},null,2));await browser.close();await server.close()}

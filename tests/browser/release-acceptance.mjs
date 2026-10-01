import assert from 'node:assert/strict'
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs'
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true})
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:5174',out=process.env.TEST_OUT||'work/release-acceptance'
mkdirSync(out,{recursive:true})
async function context(){const c=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});if(process.env.TEST_ACCESS_URL_FILE){const p=await c.newPage();try{await p.goto(readFileSync(process.env.TEST_ACCESS_URL_FILE,'utf8').trim())}catch{throw Error('Preview access failed')}await p.close()}return c}
const results={metadata:[],recovery:[],print:false,contextBackAndRefresh:false}
try{
 const c=await context(),p=await c.newPage(),descriptions=new Set()
 for(const path of ['/','/how-it-works','/what-we-automate','/questions','/partners','/start','/contact','/privacy']){
  await p.goto(base+path+'?source=synthetic-metadata-check#section')
  await p.waitForFunction(()=>document.querySelector('link[rel="canonical"]'))
  const meta=await p.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonicals:[...document.querySelectorAll('link[rel="canonical"]')].map(x=>x.href),robots:document.querySelector('meta[name="robots"]')?.content}))
  assert.match(meta.title,/ · Levarum$/);assert.ok(meta.description.length>40);assert.deepEqual(meta.canonicals,['https://levarum.com'+path]);assert.ok(!meta.robots?.includes('noindex'));descriptions.add(meta.description);results.metadata.push({path,...meta})
 }
 assert.equal(descriptions.size,8)
 await p.goto(base+'/synthetic-missing-route');await p.getByRole('heading',{name:'Page not available.'}).waitFor();await p.waitForFunction(()=>document.querySelector('meta[name="robots"]')?.content==='noindex');assert.equal(await p.locator('link[rel="canonical"]').count(),0)
 await p.getByRole('link',{name:'Back to Levarum'}).click();await p.waitForFunction(()=>document.querySelector('link[rel="canonical"]')?.href==='https://levarum.com/');assert.equal(await p.locator('meta[name="robots"]').count(),0)
 await p.goto(base+'/start');await p.getByRole('button',{name:'Invoices and payments'}).click();await p.getByRole('button',{name:'Discuss this task',exact:true}).click();await p.locator('#email').fill('synthetic-release@example.com');await p.getByRole('button',{name:/Back/}).click();assert.equal(await p.getByRole('button',{name:'Invoices and payments'}).getAttribute('aria-pressed'),'true')
 await p.emulateMedia({media:'print'});await p.getByRole('heading',{name:'Keep invoice follow-up consistent.'}).waitFor();assert.ok(!await p.getByRole('button',{name:'Discuss this task',exact:true}).isVisible());assert.ok(!await p.locator('header').isVisible());assert.ok(!await p.locator('footer').isVisible());assert.ok(!await p.locator('.lv-explorer>h1').isVisible());await p.pdf({path:out+'/invoice-guidance.pdf',format:'A4',printBackground:true});
 for(const theme of ['light','dark']){
  await p.evaluate(theme=>document.documentElement.dataset.theme=theme,theme)
  const colors=await p.locator('#task-guidance h2,#task-guidance h3,#task-guidance p').evaluateAll(nodes=>nodes.map(el=>getComputedStyle(el).color))
  for(const color of colors){const rgb=color.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);assert.ok(1.05/(0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2]+0.05)>=4.5,`Print text lacks contrast: ${color}`)}
  await p.screenshot({path:out+`/${theme}-guidance-print.png`,fullPage:true})
 }
 results.print=true;await p.emulateMedia({media:'screen'})
 await p.reload();assert.equal(await p.getByRole('button',{name:'Invoices and payments'}).getAttribute('aria-pressed'),'false');results.contextBackAndRefresh=true
 await c.close()
 const checks=await Promise.allSettled(['/contact','/partners'].flatMap(path=>['offline','timeout','429','invalid-json','saved-false'].map(async mode=>{
  const c=await context(),p=await c.newPage(),requests=[];let retry=false
  p.on('request',r=>{if(r.method()==='POST'&&/\/api\/(leads|partners)$/.test(r.url()))requests.push(r.postDataJSON())})
  await p.route(/\/api\/(leads|partners)$/,async route=>{
   if(retry)return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({saved:true,reference:route.request().postDataJSON().requestId})})
   if(mode==='offline')return route.continue()
   if(mode==='timeout')return
   if(mode==='saved-false')return route.fulfill({status:200,contentType:'application/json',body:'{"saved":false}'})
   if(mode==='429')return route.fulfill({status:429,contentType:'application/json',body:'{"error":"Too many requests"}'})
   return route.fulfill({status:200,contentType:'application/json',body:'not-json'})
  })
  try{
   await p.goto(base+path);const partner=path==='/partners';const email=partner?'#partner-email':'#email'
   await p.locator(email).fill('synthetic-release@example.com')
   if(partner){await p.locator('#partner-name').fill('Synthetic release check');await p.locator('#craft').fill('Synthetic failure recovery only. Do not contact.');await p.locator('input[name="contribution"]').first().check()}
   else await p.locator('#message').fill('Synthetic failure recovery only. Do not contact.')
   await p.locator('#consent').check();const button=p.getByRole('button',{name:partner?'Send partner interest':/^(Send request|Try again)$/,exact:true})
   if(mode==='offline')await c.setOffline(true)
   const started=Date.now();await button.click();await p.waitForFunction(()=>document.activeElement?.getAttribute('role')==='alert',{},{timeout:30000});const elapsed=Date.now()-started,text=await p.getByRole('alert').innerText()
   if(mode==='timeout'){assert.ok(elapsed>=19000);assert.match(text,/confirm/i)}
   if(mode==='429')assert.match(text,/wait a moment/i)
   if(mode==='offline')assert.match(text,/connection|connect/i)
   if(mode==='invalid-json'||mode==='saved-false')assert.match(text,/confirm/i)
   assert.equal(await p.locator(email).inputValue(),'synthetic-release@example.com');assert.ok(await p.locator('#consent').isChecked());assert.ok(await button.isEnabled());assert.ok(!await p.getByRole('heading',{name:/request is saved|interest is saved|received your request/i}).count())
   await p.keyboard.press('Tab');assert.ok(await button.evaluate(el=>el===document.activeElement));await c.setOffline(false);retry=true;await button.click();await p.getByRole('heading',{name:/saved|received your request/i}).waitFor();assert.equal(requests.length,2);assert.equal(requests[0].requestId,requests[1].requestId)
   return {path,mode,elapsed,errorFocused:true,retainedInputAndConsent:true,stableSuccessfulRetry:true}
  }finally{await c.close()}
 })))
 for(const check of checks){if(check.status==='fulfilled')results.recovery.push(check.value);else results.recovery.push({failed:String(check.reason)})}
 writeFileSync(out+'/results.json',JSON.stringify(results,null,2));assert.equal(checks.filter(x=>x.status==='rejected').length,0,JSON.stringify(results.recovery))
 console.log('PASS route metadata, print, context Back/refresh and ten browser failure/retry cases. All submissions mocked.')
}finally{await browser.close()}

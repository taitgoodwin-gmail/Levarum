import assert from 'node:assert/strict'
import {mkdirSync,writeFileSync} from 'node:fs'
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true}),out=process.env.TEST_OUT||'work/practical-forms',base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173',results=[]
mkdirSync(out,{recursive:true})
try{for(const width of [390,1440])for(const theme of ['light','dark']){
 const context=await browser.newContext({viewport:{width,height:900}})
 await context.addInitScript(theme=>localStorage.setItem('levarum.theme.v1',theme),theme)
 const page=await context.newPage();let writes=[]
 await page.route('**/api/leads',r=>{writes.push(r.request().postDataJSON());return r.fulfill({status:writes.length===1?503:200,json:writes.length===1?{error:'Synthetic failure'}:{saved:true,reference:'synthetic'}})})
 await page.goto(base+'/contact');await page.evaluate(()=>document.fonts.ready)
 await page.getByRole('button',{name:'Send request',exact:true}).click()
 for(const id of ['message','email','consent']){
  assert.ok(await page.locator(`#${id}-validation`).isVisible())
  assert.match(await page.locator('#'+id).getAttribute('aria-describedby'),new RegExp(`${id}-validation`))
  const adjacent=await page.locator('#'+id).evaluate(el=>{const error=document.getElementById(el.id+'-validation');return el.type==='checkbox'?el.closest('label').nextElementSibling===error:el.nextElementSibling===error});assert.ok(adjacent,'Visible error adjacent to its field')
 }
 assert.equal(await page.locator('#email-validation').innerText(),'Enter your email address.')
 assert.equal(writes.length,0)
 await page.screenshot({path:`${out}/invalid-${width}-${theme}.png`,fullPage:true})
 await page.locator('#message').fill('Synthetic enquiry about repeated invoice admin.')
 assert.equal(await page.locator('#message-validation').count(),0)
 await page.locator('#email').fill('invalid');await page.getByRole('button',{name:'Send request',exact:true}).click()
 assert.equal(await page.locator('#email-validation').innerText(),'Enter a valid email address.')
 await page.locator('#email').fill('synthetic@example.com');await page.locator('#consent').check()
 assert.equal(await page.locator('[id$="-validation"]').count(),0)
 await page.getByRole('button',{name:'Send request',exact:true}).click();await page.getByRole('alert').waitFor()
 assert.ok(await page.getByRole('alert').evaluate(el=>el===document.activeElement))
 await page.keyboard.press('Tab');assert.ok(await page.getByRole('button',{name:'Try again',exact:true}).evaluate(el=>el===document.activeElement))
 await page.keyboard.press('Enter');await page.getByRole('heading',{name:'Thanks — we’ve received your request.',exact:true}).waitFor()
 assert.equal(writes[0].requestId,writes[1].requestId)
 await page.goto(base+'/partners');await page.getByRole('button',{name:'Send partner interest',exact:true}).click()
 for(const id of ['partner-name','craft','contribution','partner-email','consent'])assert.ok(await page.locator(`#${id}-validation`).isVisible())
 await page.getByRole('radio').first().check()
 assert.equal(await page.locator('#contribution-validation').count(),0)
 assert.equal(await page.locator('input[name=contribution][aria-invalid=true]').count(),0)
 if(process.env.AXE_CORE_PATH){await page.addScriptTag({path:process.env.AXE_CORE_PATH});assert.deepEqual(await page.evaluate(async()=>(await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations),[])}
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 results.push({width,theme,adjacentErrors:true,groupClearing:true,stableRetry:true,axeScans:process.env.AXE_CORE_PATH?1:0});await context.close()
}console.log('PASS four practical form cases: adjacent specific errors, ARIA cleanup, partner radio group, retained retry identity, focus and Axe')}
finally{writeFileSync(out+'/results.json',JSON.stringify(results,null,2));await browser.close()}

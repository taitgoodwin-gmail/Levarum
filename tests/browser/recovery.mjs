import assert from 'node:assert/strict'
import {mkdirSync,writeFileSync} from 'node:fs'
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true})
const page=await browser.newPage()
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:5178'
const out=process.env.TEST_OUT||'work/recovery-focus'
mkdirSync(out,{recursive:true})
const results=[]
let requests=[]
await page.route(/\/api\/(leads|partners)$/,async route=>{
 requests.push(route.request().postDataJSON())
 await new Promise(resolve=>setTimeout(resolve,150))
 await route.fulfill({status:503,contentType:'application/json',body:'{"error":"Synthetic storage failure"}'})
})
try{
 for(const theme of ['light','dark'])for(const width of [320,1440])for(const path of ['/contact','/partners']){
  requests=[];await page.setViewportSize({width,height:900});await page.goto(base+path)
  await page.evaluate(theme=>localStorage.setItem('levarum.theme.v1',theme),theme);await page.reload()
  const partner=path==='/partners'
  const submit=page.getByRole('button',{name:partner?'Send partner interest':'Send my follow-up request',exact:true})
  await page.locator(partner?'#partner-email':'#email').fill('levarum-keyboard-test@example.com')
  if(partner){await page.locator('#partner-name').fill('Synthetic keyboard test');await page.locator('#craft').fill('Synthetic verification only. Do not contact.');await page.locator('input[name="contribution"]').first().check()}
  else{
   await submit.click()
   const ids=(await page.locator('#message').getAttribute('aria-describedby')).split(' ')
   assert.ok(ids.includes('message-help'));assert.ok(ids.includes('message-validation'))
   await page.locator('#message').fill('Synthetic keyboard recovery test. Do not contact.')
   assert.equal(await page.locator('#message').getAttribute('aria-describedby'),'message-help')
  }
  await page.locator('#consent').check()
  for(let attempt=0;attempt<2;attempt++){
   await submit.focus();await page.keyboard.press('Enter')
   await page.waitForFunction(()=>document.activeElement?.getAttribute('role')==='alert')
   assert.match(await page.getByRole('alert').innerText(),/could not save/)
   await page.keyboard.press('Tab')
   assert.ok(await submit.evaluate(el=>el===document.activeElement),'Tab reaches retry')
   assert.equal(await page.locator(partner?'#partner-email':'#email').inputValue(),'levarum-keyboard-test@example.com')
   assert.ok(await page.locator('#consent').isChecked())
  }
  assert.equal(requests.length,2);assert.equal(requests[0].requestId,requests[1].requestId)
  results.push({path,theme,width,failures:2,errorFocused:true,tabToRetry:true,retainedInput:true,stableRetryId:true,helpTextPreserved:!partner})
 }
 writeFileSync(out+'/results.json',JSON.stringify({mocked:true,results},null,2))
 console.log(`PASS: ${results.length} contact/partner keyboard recovery cases, repeated failures, retained input, stable retries and contact help-text association. No real submissions.`)
}finally{await browser.close()}

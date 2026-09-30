import assert from 'node:assert/strict'
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs'
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright')
const base=process.env.TEST_BASE_URL
if(!base)throw Error('TEST_BASE_URL is required')
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,headless:true})
const context=await browser.newContext(),page=await context.newPage()
const out=process.env.TEST_OUT||'work/admin-negative';mkdirSync(out,{recursive:true})
const results=[]
try{
 if(process.env.TEST_ACCESS_URL_FILE){
  try{await page.goto(readFileSync(process.env.TEST_ACCESS_URL_FILE,'utf8').trim())}
  catch{throw Error('Could not open the temporary preview access link')}
 }
 for(const credentials of ['absent','fabricated'])for(const action of ['list','detail','status','sync']){
  const mutation=['status','sync'].includes(action)
  const response=await context.request.fetch(base+'/api/admin?action='+action+(action==='detail'?'&id='+'0'.repeat(64):''),{
   method:mutation?'POST':'GET',headers:{...(credentials==='fabricated'?{Authorization:'Bearer synthetic-invalid-token'}:{}),...(mutation?{'Content-Type':'application/json',Origin:base}:{})},
   ...(mutation?{data:{id:'0'.repeat(64),status:'contacted',expectedVersion:0,mutationId:'00000000-0000-4000-8000-000000000000'}}:{})
  })
  assert.equal(response.status(),401,credentials+' '+action)
  assert.match(response.headers()['cache-control'],/no-store/)
  const body=await response.json();assert.deepEqual(Object.keys(body),['error'])
  results.push({credentials,action,status:response.status(),noStore:true,errorOnly:true})
 }
 const draft=await context.request.post(base+'/api/draft',{data:{}})
 assert.equal(draft.status(),404)
 writeFileSync(out+'/results.json',JSON.stringify({base,results,disabledDraftStatus:draft.status(),limits:'No valid owner, non-owner, expired or revoked Clerk session was exercised.'},null,2))
 console.log('PASS: 8 live anonymous/fabricated admin action denials with no-store/error-only responses; draft endpoint404. No valid owner session or private records accessed.')
}finally{await browser.close()}

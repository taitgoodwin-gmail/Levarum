import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs'
import {randomUUID,createHash} from 'node:crypto'
import {Client} from 'pg'
import {get} from '@vercel/blob'
const directory=new URL('./',import.meta.url)
const configPath=new URL('provider-config.json',directory)
const config=JSON.parse(readFileSync(configPath,'utf8'));unlinkSync(configPath)
for(const key of Object.keys(process.env))if(/^(PG|DATABASE_URL|POSTGRES_|BLOB_|PREVIEW_|VERCEL_|CLERK_|VITE_CLERK_|RESEND_|LEAD_EMAIL_|NEON_)/.test(key))delete process.env[key]
assert.equal(new URL(config.previewDatabase).hostname.endsWith('.neon.tech'),true)
assert.equal(config.previewToken.split('_')[3],config.storeId)
Object.assign(process.env,{VERCEL_ENV:'preview',PREVIEW_READ_WRITE_TOKEN:config.previewToken,DATABASE_URL:config.previewDatabase})
const client=new Client({connectionString:config.previewDatabase,connectionTimeoutMillis:5000,query_timeout:10000,statement_timeout:10000})
const records=[];const evidence={source:'82967bddfc053d099eefd397a1e3f879fcd6e41d',mode:'local actual handlers with isolated remote preview providers; not hosted HTTP or Clerk',cases:[]}
const suffix=randomUUID().slice(0,8)
try{
 await client.connect()
 const identity=(await client.query('SELECT current_database() AS name')).rows[0]
 assert.equal(identity.name,decodeURIComponent(new URL(config.previewDatabase).pathname.slice(1)))
 const {default:leadHandler}=await import('../../api/leads.ts')
 const {default:partnerHandler}=await import('../../api/partners.ts')
 const {parseLead,leadPath}=await import('../../server/leads.ts')
 const {parsePartner,partnerPath}=await import('../../server/partners.ts')
 const {indexLead,updateStatus,readDetail}=await import('../../server/admin-store.ts')
 async function call(handler,body){
  let payload;const headers={};const res={statusCode:0,setHeader:(k,v)=>headers[k]=v,end:text=>payload=JSON.parse(text)}
  await handler({method:'POST',url:'/api/leads',body,headers:{'content-type':'application/json',host:'synthetic-preview.invalid',origin:'https://synthetic-preview.invalid'},socket:{remoteAddress:'127.0.0.1'}},res)
  assert.equal(res.statusCode,200);assert.deepEqual(payload,{saved:true,reference:body.requestId});assert.equal(headers['Cache-Control'],'no-store')
 }
 for(const kind of ['plan','call','partner']){
  const common={requestId:randomUUID(),email:`levarum-test-${suffix}-${kind}@example.com`,consent:true}
  const input=kind==='partner'?{...common,intent:'partner',name:'Synthetic preview verification',craft:'Synthetic verification only: help with enquiry follow-up.',contribution:'Building the automations'}:{...common,schemaVersion:2,intent:kind,pains:[],message:'Synthetic verification only: manually tracking enquiries in a spreadsheet.',preferences:kind==='call'?'Synthetic availability: weekday morning UTC.':''}
  const lead=kind==='partner'?parsePartner(input):parseLead(input)
  const key=kind==='partner'?partnerPath(lead):leadPath(lead),id=createHash('sha256').update(key).digest('hex')
  records.push({kind,input,key,id})
  writeFileSync(new URL('fixtures.json',directory),JSON.stringify(records,null,2))
  assert.equal((await client.query('SELECT id FROM levarum_lead_index WHERE id=$1',[id])).rowCount,0)
  const handler=kind==='partner'?partnerHandler:leadHandler
  await call(handler,input)
  const privateRead=await get(key,{token:config.previewToken,access:'private',useCache:false,abortSignal:AbortSignal.timeout(10000)})
  assert.equal(privateRead?.statusCode,200)
  const saved=await new Response(privateRead.stream).json()
  for(const [k,v] of Object.entries(lead))assert.deepEqual(saved[k],v)
  assert.equal(saved.privacyVersion,kind==='partner'?'2026-09-29':'2026-09-30')
  if(kind!=='partner'){assert.equal('business' in saved,false);assert.equal('hours' in saved,false)}
  const anonymous=await fetch(privateRead.blob.url,{signal:AbortSignal.timeout(10000)});assert.equal(anonymous.status,403);await anonymous.body?.cancel()
  await call(handler,input)
  const replayed=await get(key,{token:config.previewToken,access:'private',useCache:false,abortSignal:AbortSignal.timeout(10000)})
  assert.equal((await new Response(replayed.stream).json()).receivedAt,saved.receivedAt)
  assert.equal(await indexLead(key),id)
  assert.equal((await client.query('SELECT id FROM levarum_lead_index WHERE source_key=$1',[key])).rowCount,1)
  const detail=await readDetail(id);assert.deepEqual(detail.lead,saved);assert.equal(detail.record.status,'New');assert.equal(detail.record.version,0)
  const actor='synthetic_owner_verification_20261004'
  const mutations=[{id,status:'Contacted',version:0,mutationId:randomUUID()},{id,status:'Done',version:0,mutationId:randomUUID()}]
  const outcomes=await Promise.allSettled(mutations.map(m=>updateStatus(m,actor)))
  const winnerIndex=outcomes.findIndex(o=>o.status==='fulfilled');assert.equal(outcomes.filter(o=>o.status==='fulfilled').length,1)
  assert.equal(outcomes.find(o=>o.status==='rejected').reason.status,409)
  await updateStatus(mutations[winnerIndex],actor)
  const final=await readDetail(id);assert.equal(final.record.version,1);assert.equal(final.events.length,1);assert.equal(final.events[0].actor,actor)
  const queried=(await client.query('SELECT status,version FROM levarum_lead_index WHERE id=$1',[id])).rows[0]
  assert.equal(queried.status,mutations[winnerIndex].status);assert.equal(queried.version,1)
  if(kind!=='call')await assert.rejects(()=>updateStatus({id,status:'Booked',version:1,mutationId:randomUUID()},actor),e=>e.status===400)
  evidence.cases.push({kind,privateExactRead:true,anonymousRead:403,unchangedRetry:true,receivedAtPreserved:true,indexRows:1,detailRead:true,concurrency:[200,409],idempotentReplay:true,statusHistoryEvents:1,secondConnectionRead:true,bookedRestriction:kind!=='call'?'rejected':'not exercised'})
  writeFileSync(new URL('provider-results.json',directory),JSON.stringify(evidence,null,2))
  console.log(`${kind}: private read, anonymous denial, unchanged save, index, conflict, replay and persisted detail PASS`)
 }
}catch(error){console.error(`Verification failed (${error.name}; code ${error.code??'none'}); provider details withheld`);process.exitCode=1}
finally{await client.end();config.previewToken='';config.previewDatabase=''}

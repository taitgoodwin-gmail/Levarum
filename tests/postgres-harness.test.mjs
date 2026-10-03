import test from 'node:test'
import assert from 'node:assert/strict'
import {isolatedPostgresTarget,replayWinner} from './fixtures/postgres-harness.mjs'
const local='postgres://127.0.0.1:55432/levarum_test_synthetic'
test('PostgreSQL harness accepts only explicit loopback port and dedicated test database',()=>{
 assert.equal(isolatedPostgresTarget(local).connectionString,local)
 for(const value of [undefined,'invalid','postgres://remote.invalid:55432/levarum_test_synthetic','postgres://localhost:55432/levarum_test_synthetic','postgres://127.0.0.1/levarum_test_synthetic','postgres://127.0.0.1:543/postgres','postgres://127.0.0.1:55432/production','socket:/tmp/postgres','postgres://%2ftmp:55432/levarum_test_synthetic',local+'#fragment',local+'?host=remote.invalid',local+'?hostaddr=192.0.2.1',local+'?port=5432',local+'?database=production',local+'?dbname=production',local+'?service=remote',local+'?sslcert=/must-not-read',local+'?options=-csearch_path=other',local+'?%68ost=remote.invalid'])assert.throws(()=>isolatedPostgresTarget(value),{message:'Isolated localhost PostgreSQL test configuration required'})
})
test('PostgreSQL harness rejects inherited driver/cloud settings without exposing values',()=>{
 for(const key of ['PGHOST','PGHOSTADDR','PGPORT','PGDATABASE','PGSERVICE','PGPASSFILE','PGPASSWORD','DATABASE_URL','POSTGRES_URL','BLOB_READ_WRITE_TOKEN','BLOB_STORE_ID','PREVIEW_READ_WRITE_TOKEN','VERCEL_ENV','VERCEL_OIDC_TOKEN','CLERK_SECRET_KEY','VITE_CLERK_PUBLISHABLE_KEY','RESEND_API_KEY','NEON_DATABASE_URL']){
  assert.throws(()=>isolatedPostgresTarget(local,{[key]:'SYNTHETIC_SENSITIVE_VALUE'}),e=>e.message==='Isolated localhost PostgreSQL test configuration required'&&!e.message.includes('SENSITIVE'))
 }
 assert.throws(()=>isolatedPostgresTarget('postgres://user:SYNTHETIC_SENSITIVE_VALUE@remote.invalid/test'),e=>!e.message.includes('SENSITIVE'))
})
for(const index of [0,1])test(`concurrency winner ${index} is replayed with its exact unchanged mutation`,async()=>{
 const mutations=[{status:'Contacted',mutationId:'first'},{status:'Done',mutationId:'second'}]
 const results=mutations.map((_,i)=>i===index?{status:'fulfilled',value:{version:1}}:{status:'rejected',reason:{status:409}})
 let calls=0;const winner=await replayWinner(results,mutations,async(body,actor)=>{calls++;assert.equal(body,mutations[index]);assert.equal(actor,'synthetic-owner');return {status:body.status,version:1}},'synthetic-owner')
 assert.equal(winner,mutations[index]);assert.equal(calls,1)
})
test('invalid concurrency outcomes cannot be counted as a replay pass',async()=>{
 for(const results of [[{status:'fulfilled'},{status:'fulfilled'}],[{status:'rejected',reason:{status:503}},{status:'fulfilled'}]])await assert.rejects(()=>replayWinner(results,[{},{}],async()=>{assert.fail('must not replay')},'synthetic'))
})

const {assertAuditRollback}=await import('./fixtures/postgres-harness.mjs')
// Validate the assertion helper offline; this fake does not prove SQL rollback.
for(const leak of ['none','index','history'])test(`rollback assertion oracle detects ${leak} leakage and cleans up the failure fixture`,async()=>{
 let constrained=false,state={status:'Booked',version:2},events=[],saved=false
 const mutation={id:'synthetic',status:'Done',version:2,mutationId:'synthetic-mutation'}
 const client={query:async sql=>{
  if(sql.includes('ADD CONSTRAINT')){constrained=true;return {}}
  if(sql.includes('DROP CONSTRAINT')){constrained=false;return {}}
  return {rows:structuredClone(sql.includes('SELECT status,version')?[state]:events)}
 }}
 const update=async(body,actor)=>{
  if(constrained){
   if(leak==='index')state={status:'Done',version:3}
   if(leak==='history')events.push({mutation_id:'unexpected'})
   throw Object.assign(Error('synthetic audit failure'),{code:'23514'})
  }
  if(!saved){saved=true;state={status:body.status,version:3};events.push({mutation_id:body.mutationId})}
  return state
 }
 if(leak==='none')await assertAuditRollback(client,update,mutation,'synthetic-owner')
 else await assert.rejects(()=>assertAuditRollback(client,update,mutation,'synthetic-owner'),{code:'ERR_ASSERTION'})
 assert.equal(constrained,false)
})

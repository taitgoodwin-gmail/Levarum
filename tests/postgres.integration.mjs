// Opt-in integration test. Only a dedicated localhost database is accepted.
import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { Client } from 'pg'
const url=process.env.POSTGRES_INTEGRATION_URL
if(!url||new URL(url).hostname!=='127.0.0.1'||!new URL(url).pathname.startsWith('/levarum_test_'))throw Error('A dedicated localhost POSTGRES_INTEGRATION_URL is required')
process.env.DATABASE_URL=url
const {indexLead,readInbox,updateStatus}=await import('../server/admin-store.ts')
test('real PostgreSQL: idempotent indexing, concurrent version conflict, atomic audit, retries and persisted read',async()=>{
 const key=`leads/call/${randomUUID()}-${'a'.repeat(64)}.json`
 const id=await indexLead(key)
 assert.equal(await indexLead(key),id)
 const mutation={id,version:0,status:'Contacted',mutationId:randomUUID()}
 const results=await Promise.allSettled([updateStatus(mutation,'user_test_owner'),updateStatus({...mutation,status:'Done',mutationId:randomUUID()},'user_test_owner')])
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1)
 const failure=results.find(r=>r.status==='rejected');assert.equal(failure.reason.status,409)
 const inbox=await readInbox(0,'call','');assert.equal(inbox.total,1);assert.equal(inbox.leads[0].version,1)
 const winner=results[0].status==='fulfilled'?mutation:null
 if(winner){const retry=await updateStatus(winner,'user_test_owner');assert.equal(retry.version,1)}
 const client=new Client({connectionString:url});await client.connect()
 const history=await client.query('SELECT * FROM levarum_status_events WHERE lead_id=$1',[id]);assert.equal(history.rowCount,1);assert.equal(history.rows[0].actor,'user_test_owner')
 const current=await client.query('SELECT status,version FROM levarum_lead_index WHERE id=$1',[id]);assert.equal(current.rows[0].version,1);assert.equal(current.rows[0].status,history.rows[0].new_status)
 // A second successful mutation and its identical retry must create only one event.
 const next={id,status:'Booked',version:1,mutationId:randomUUID()}
 await updateStatus(next,'user_test_owner');await updateStatus(next,'user_test_owner')
 assert.equal((await client.query('SELECT count(*)::int AS n FROM levarum_status_events WHERE lead_id=$1',[id])).rows[0].n,2)
 await assert.rejects(()=>updateStatus({...next,status:'Done'},'user_test_owner'),e=>e.status===409)
 const partner=await indexLead(`leads/partner/${randomUUID()}-${'b'.repeat(64)}.json`)
 await assert.rejects(()=>updateStatus({id:partner,status:'Booked',version:0,mutationId:randomUUID()},'user_test_owner'),e=>e.status===400)
 assert.equal((await client.query('SELECT version FROM levarum_lead_index WHERE id=$1',[partner])).rows[0].version,0)
 await client.end()
})

// Opt-in integration test. Only a dedicated localhost database is accepted.
import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { Client } from 'pg'
import {isolatedPostgresTarget,replayWinner,assertAuditRollback} from './fixtures/postgres-harness.mjs'
const url=process.env.POSTGRES_INTEGRATION_URL
const config=isolatedPostgresTarget(url,process.env)
test('real PostgreSQL: idempotent indexing, concurrent version conflict, atomic audit, retries and persisted read',async()=>{
 const client=new Client(config)
 try{
 await client.connect()
 // Read-only server identity and empty-target checks precede application DDL.
 const identity=(await client.query('SELECT current_database() AS name, inet_server_addr()::text AS address')).rows[0]
 assert.equal(identity.name,new URL(url).pathname.slice(1));assert.equal(identity.address,'127.0.0.1')
 const existing=await client.query("SELECT c.oid FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname NOT LIKE 'pg_%' AND n.nspname <> 'information_schema'")
 assert.equal(existing.rowCount,0,'Refusing a nonempty test database')
 process.env.DATABASE_URL=url
 const {indexLead,updateStatus}=await import('../server/admin-store.ts')
 const key=`leads/call/${randomUUID()}-${'a'.repeat(64)}.json`
 const id=await indexLead(key)
 assert.equal(await indexLead(key),id)
 const mutation={id,version:0,status:'Contacted',mutationId:randomUUID()}
 const mutations=[mutation,{...mutation,status:'Done',mutationId:randomUUID()}]
 const results=await Promise.allSettled(mutations.map(body=>updateStatus(body,'user_test_owner')))
 await replayWinner(results,mutations,updateStatus,'user_test_owner')
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
 // Force audit insertion to fail after the index UPDATE, then verify rollback
 // and prove that the very same mutation can succeed/replay after recovery.
 await assertAuditRollback(client,updateStatus,{id,status:'Done',version:2,mutationId:randomUUID()},'user_test_owner')
 }finally{await client.end()}
})

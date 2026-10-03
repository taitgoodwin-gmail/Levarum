// Test-only helpers. Parsing never connects, resolves a host, or loads an env file.
import assert from 'node:assert/strict'
import {parse} from 'pg-connection-string'
export function isolatedPostgresTarget(value,env={}){
 const fail=()=>{throw Error('Isolated localhost PostgreSQL test configuration required')}
 if(Object.entries(env).some(([key,value])=>value&&/^(PG|DATABASE_URL$|POSTGRES_URL|BLOB_|PREVIEW_READ_WRITE_TOKEN$|VERCEL_|CLERK_|VITE_CLERK_|RESEND_|NEON_)/.test(key)))fail()
 try{
  const url=new URL(value)
  // Reject query options before driver parsing: some options override the host,
  // while SSL options can read local files. No socket, service or TLS overrides.
  if(!['postgres:','postgresql:'].includes(url.protocol)||url.search||url.hash||url.hostname!=='127.0.0.1'||!/^\/levarum_test_[a-z0-9_]+$/.test(url.pathname))fail()
  if(!/^\d+$/.test(url.port)||Number(url.port)<1024||Number(url.port)>65535)fail()
  const config=parse(value)
  if(config.host!=='127.0.0.1'||config.port!==url.port||config.database!==url.pathname.slice(1)||config.ssl||config.options)fail()
  return {connectionString:value,connectionTimeoutMillis:3000}
 }catch{fail()}
}
export async function replayWinner(results,mutations,update,actor){
 assert.equal(results.length,2);assert.equal(mutations.length,2)
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1)
 const loser=results.find(r=>r.status==='rejected');assert.equal(loser.reason.status,409)
 const winner=mutations[results.findIndex(r=>r.status==='fulfilled')]
 const replay=await update(winner,actor)
 assert.equal(replay.version,1);assert.equal(replay.status,winner.status)
 return winner
}
// Invoked only after isolated target + empty database preflight, never by unit tests.
// The CHECK fails the audit INSERT after updateStatus has updated the index row.
export async function assertAuditRollback(client,update,mutation,actor){
 const before=(await client.query('SELECT status,version FROM levarum_lead_index WHERE id=$1',[mutation.id])).rows
 const history=(await client.query('SELECT * FROM levarum_status_events WHERE lead_id=$1 ORDER BY version',[mutation.id])).rows
 await client.query("ALTER TABLE levarum_status_events ADD CONSTRAINT synthetic_reject_audit CHECK (actor <> 'synthetic_reject_audit')")
 try{
  await assert.rejects(()=>update(mutation,'synthetic_reject_audit'),e=>e.code==='23514')
  assert.deepEqual((await client.query('SELECT status,version FROM levarum_lead_index WHERE id=$1',[mutation.id])).rows,before)
  assert.deepEqual((await client.query('SELECT * FROM levarum_status_events WHERE lead_id=$1 ORDER BY version',[mutation.id])).rows,history)
 }finally{await client.query('ALTER TABLE levarum_status_events DROP CONSTRAINT synthetic_reject_audit')}
 const saved=await update(mutation,actor)
 assert.equal(saved.version,mutation.version+1)
 const replay=await update(mutation,actor);assert.equal(replay.version,saved.version)
 const after=(await client.query('SELECT * FROM levarum_status_events WHERE lead_id=$1 ORDER BY version',[mutation.id])).rows
 assert.equal(after.length,history.length+1)
 assert.equal(after.at(-1).mutation_id,mutation.mutationId)
}

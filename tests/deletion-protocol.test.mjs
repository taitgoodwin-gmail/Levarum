import test from 'node:test'
import assert from 'node:assert/strict'
import {createDeletionModel,marker} from './fixtures/deletion-protocol.mjs'
import {parseLead,leadPath} from '../server/leads.ts'
function fixture(last='0'){
 const lead=parseLead({schemaVersion:2,requestId:`123e4567-e89b-42d3-a456-42661417400${last}`,intent:'plan',email:'synthetic@example.com',pains:[],message:'Synthetic protocol fixture',preferences:'',consent:true})
 return {lead,key:leadPath(lead)}
}
function gate(){let resolve;const promise=new Promise(r=>{resolve=r});return {promise,resolve}}

test('proposal: repeated erase, unchanged retry and stale reconciliation cannot resurrect sealed content',async()=>{
 const m=createDeletionModel(),a=fixture(),b=fixture('1')
 await m.save(a.key,a.lead);await m.save(b.key,b.lead);await m.indexKey(a.key);await m.indexKey(b.key)
 m.history.set(a.key,['synthetic-event']);const staleList=[...m.blobs.keys()]
 await m.erase(a.key);await m.erase(a.key)
 await assert.rejects(()=>m.save(a.key,a.lead))
 await m.reconcile(staleList)
 assert.equal(m.blobs.get(a.key),marker);assert.equal(m.index.has(a.key),false);assert.equal(m.history.has(a.key),false)
 assert.equal(m.index.has(b.key),true);assert.equal(JSON.parse(m.blobs.get(b.key)).message,b.lead.message)
 assert.deepEqual(JSON.parse(marker),{_levarumDeletion:1},'Marker contains no original body, time, email or actor')
})

test('proposal: an already-started write reaching storage after erasure cannot replace the marker',async()=>{
 const m=createDeletionModel(),a=fixture(),started=gate(),release=gate()
 m.hooks.beforePut=async()=>{started.resolve();await release.promise}
 const pending=m.save(a.key,a.lead);const rejected=assert.rejects(pending)
 await started.promise;await m.erase(a.key);release.resolve();await rejected
 assert.equal(m.blobs.get(a.key),marker);assert.equal(await m.indexKey(a.key),false)
})

test('proposal: erasure waits for an in-flight index transaction, then removes its result',async()=>{
 const m=createDeletionModel(),a=fixture(),started=gate(),release=gate()
 await m.save(a.key,a.lead)
 m.hooks.beforeIndex=async()=>{started.resolve();await release.promise}
 const indexing=m.indexKey(a.key);await started.promise
 const erasing=m.erase(a.key);release.resolve();await Promise.all([indexing,erasing])
 assert.equal(m.blobs.get(a.key),marker);assert.equal(m.index.has(a.key),false)
})

test('proposal: reconciliation waiting behind erasure re-reads the marker instead of trusting old list metadata',async()=>{
 const m=createDeletionModel(),a=fixture(),started=gate(),release=gate()
 await m.save(a.key,a.lead);const staleList=[a.key]
 m.hooks.afterMarker=async()=>{started.resolve();await release.promise}
 const erasing=m.erase(a.key);await started.promise
 const syncing=m.reconcile(staleList);release.resolve();await Promise.all([erasing,syncing])
 assert.equal(m.index.has(a.key),false);assert.equal(m.blobs.get(a.key),marker)
})

test('proposal: failure after marker persistence is resumable and never permits the original retry',async()=>{
 const m=createDeletionModel(),a=fixture();await m.save(a.key,a.lead);await m.indexKey(a.key)
 m.hooks.afterMarker=async()=>{throw Error('synthetic SQL failure after durable marker')}
 await assert.rejects(()=>m.erase(a.key));assert.equal(m.index.has(a.key),true,'Case remains incomplete; no false completion')
 await assert.rejects(()=>m.save(a.key,a.lead));assert.equal(m.blobs.get(a.key),marker)
 m.hooks.afterMarker=async()=>{};await m.erase(a.key);assert.equal(m.index.has(a.key),false)
})

test('proposal: restored old content is excluded only with a current, independently preserved marker manifest',async()=>{
 const m=createDeletionModel(),a=fixture(),b=fixture('1');await m.save(a.key,a.lead);await m.save(b.key,b.lead)
 const oldArchive=[...m.blobs];await m.erase(a.key)
 assert.throws(()=>m.restore(oldArchive,null),/Current exclusion/)
 const restored=m.restore(oldArchive,m.exportMarkers())
 assert.equal(restored.get(a.key),marker);assert.equal(JSON.parse(restored.get(b.key)).email,b.lead.email)
 // An old/empty manifest cannot be distinguished by this in-memory model.
 assert.notEqual(m.restore(oldArchive,[]).get(a.key),marker,'Freshness/coverage verification remains a required operational gate')
})

test('proposal boundary: discarding a marker reopens the key; a new request ID is a separate submission',async()=>{
 const m=createDeletionModel(),a=fixture(),b=fixture('1')
 await m.save(a.key,a.lead);await m.erase(a.key)
 await m.save(b.key,b.lead);assert.notEqual(a.key,b.key)
 m.blobs.delete(a.key);await m.save(a.key,a.lead)
 assert.equal(JSON.parse(m.blobs.get(a.key)).email,a.lead.email,'Finite marker expiry cannot be chosen while old retries remain accepted')
})

test('proposal: call and partner retries also cannot replace sealed exact keys',async()=>{
 const {parsePartner,partnerPath}=await import('../server/partners.ts')
 const original=fixture().lead,call=parseLead({...original,intent:'call',preferences:'Synthetic availability'})
 const partner=parsePartner({requestId:original.requestId,name:'Synthetic partner',email:'synthetic@example.com',craft:'Synthetic work',contribution:'Building the automations',consent:true})
 for(const [key,lead] of [[leadPath(call),call],[partnerPath(partner),partner]]){
  const m=createDeletionModel();await m.save(key,lead);await m.erase(key)
  await assert.rejects(()=>m.save(key,lead));assert.equal(m.blobs.get(key),marker)
 }
})

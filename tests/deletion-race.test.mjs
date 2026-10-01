import test from 'node:test'
import assert from 'node:assert/strict'
import {createPrivateRecordSaver} from '../server/private-save.ts'
import {parseLead,leadPath} from '../server/leads.ts'

// Characterization of an OPEN limitation, not proof of safe erasure.
// Uses the real immutable saver against an isolated in-memory Blob substitute.
test('deletion limitation: removing an immutable key allows an unchanged retry to recreate it',async()=>{
 const records=new Map(),lead=parseLead({schemaVersion:2,requestId:'123e4567-e89b-42d3-a456-426614174000',intent:'plan',email:'synthetic@example.com',pains:[],message:'Synthetic deletion-race fixture',preferences:'',consent:true})
 const path=leadPath(lead)
 const save=createPrivateRecordSaver({token:()=> 'isolated-fixture',put:async(key,body)=>{if(records.has(key))throw Error('exists');records.set(key,body)},get:async key=>records.has(key)?{statusCode:200,stream:new Response(records.get(key)).body}:null})
 await save(path,lead,'2026-09-30')
 records.delete(path)
 await save(path,lead,'2026-09-30')
 assert.equal(JSON.parse(records.get(path)).message,lead.message)
})

test('deletion limitation: even a preflight suppression check races with an in-flight write',async()=>{
 const records=new Map();let suppressed=false,release,entered
 const gate=new Promise(r=>{release=r}),started=new Promise(r=>{entered=r})
 async function proposedSave(){if(suppressed)throw Error('suppressed');entered();await gate;records.set('synthetic-key','synthetic-content')}
 const pending=proposedSave();await started
 suppressed=true;records.delete('synthetic-key');release();await pending
 assert.equal(records.has('synthetic-key'),true,'Check-then-write alone is not a safe fix')
})

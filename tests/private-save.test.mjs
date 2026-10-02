import test from 'node:test'
import assert from 'node:assert/strict'
import {createPrivateRecordSaver} from '../server/private-save.ts'
const lead={requestId:'synthetic-only',email:'synthetic@example.com',consent:true}
const path='leads/plan/synthetic-only.json'
const settle=promise=>promise.then(()=> 'saved',()=> 'rejected')
test('reconciliation body stall rejects within its read budget and an unchanged retry verifies the saved record',async()=>{
 let controller,cancelled=false,first=true,stored,puts=0
 const save=createPrivateRecordSaver({token:()=> 'synthetic-only',put:async(_key,body)=>{puts++;stored??=body;throw Error('synthetic response lost')},get:async key=>{
  assert.equal(key,path)
  if(first){first=false;return {statusCode:200,stream:new ReadableStream({start(c){controller=c;c.enqueue(new TextEncoder().encode('{'))},cancel(){cancelled=true}})}}
  return {statusCode:200,stream:new Response(stored).body}
 }})
 const pending=settle(save(path,lead))
 let timer;const outcome=await Promise.race([pending,new Promise(resolve=>{timer=setTimeout(()=>resolve('hung'),6000)})]);clearTimeout(timer)
 if(!cancelled)controller.close()
 assert.equal(outcome,'rejected','Uncertain save must not hang or report success on an incomplete body')
 assert.equal(cancelled,true,'Timed-out read cancels its source stream')
 const original=stored;await save(path,lead);assert.equal(stored,original);assert.equal(puts,2)
})
test('uncooperative write is bounded, then verified only by exact private readback',async()=>{
 let stored
 const save=createPrivateRecordSaver({token:()=> 'synthetic-only',put:async(_key,body)=>{stored=body;return new Promise(()=>{})},get:async key=>{assert.equal(key,path);return {statusCode:200,stream:new Response(stored).body}}})
 let timer;const outcome=await Promise.race([settle(save(path,lead)),new Promise(resolve=>{timer=setTimeout(()=>resolve('hung'),13000)})]);clearTimeout(timer)
 assert.equal(outcome,'saved','A lost write response must reach exact-record reconciliation')
})

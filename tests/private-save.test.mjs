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

// Exercise the real handler/saver boundary: provider JSON is not visitor input.
const {createLeadHandler}=await import('../api/leads.ts')
const {createPartnerHandler}=await import('../api/partners.ts')
const {leadPath}=await import('../server/leads.ts')
const {partnerPath}=await import('../server/partners.ts')
const requestId='123e4567-e89b-42d3-a456-426614174000'
for(const kind of ['contact','partner'])test(`${kind}: malformed private readback is retryable storage failure; unchanged retry confirms original bytes`,async()=>{
 const body=kind==='contact'?{schemaVersion:2,requestId,intent:'plan',email:'synthetic@example.com',message:'Synthetic recovery check',pains:[],preferences:'',consent:true,website:''}:{requestId,name:'Synthetic partner',email:'synthetic@example.com',craft:'Synthetic recovery check',contribution:'Building the automations',consent:true,website:''}
 const keyFor=kind==='contact'?leadPath:partnerPath
 let original,readable=false,notifications=0,keys=[]
 const save=createPrivateRecordSaver({token:()=> 'synthetic-only',put:async(key,bytes)=>{keys.push(key);original??=bytes;throw Error('synthetic lost write response')},get:async key=>{assert.equal(key,keys[0]);return {statusCode:200,stream:new Response(readable?original:'{incomplete').body}}})
 const handler=(kind==='contact'?createLeadHandler:createPartnerHandler)({configured:()=>true,save:value=>save(keyFor(value),value),notify:async()=>{notifications++}})
 const req=()=>({method:'POST',headers:{host:'localhost','content-type':'application/json'},socket:{remoteAddress:'127.0.0.1'},body})
 const res=()=>({setHeader(){},end(bytes){this.body=JSON.parse(bytes)}})
 const failed=res();await handler(req(),failed)
 assert.equal(failed.statusCode,503);assert.equal(failed.body.saved,undefined);assert.equal(notifications,0)
 const first=original;readable=true;const retry=res();await handler(req(),retry)
 assert.equal(retry.statusCode,200);assert.equal(retry.body.saved,true);assert.equal(retry.body.reference,requestId)
 assert.equal(keys[0],keys[1]);assert.equal(original,first);assert.equal(notifications,1)
 const invalid=res();await handler({...req(),body:'{invalid'},invalid)
 assert.equal(invalid.statusCode,400);assert.equal(keys.length,2);assert.equal(notifications,1)
})

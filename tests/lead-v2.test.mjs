import test from 'node:test'
import assert from 'node:assert/strict'
import {parseLead,leadPath} from '../server/leads.ts'
import {createLeadHandler,leadNotificationText} from '../api/leads.ts'
import {createPrivateRecordSaver} from '../server/private-save.ts'

const requestId='123E4567-E89B-42D3-A456-426614174000'
const legacy=(intent='plan')=>({requestId,intent,email:' GOLDEN@example.com ',business:'Trades and contracting',hours:'Under 5',pains:['invoices','booking','invoices'],preferences:'  Weekday mornings, Eastern  ',consent:true,website:''})
const v2=(patch={})=>({schemaVersion:2,requestId,intent:'plan',email:' DIRECT@example.com ',pains:[],message:'  I would like help organizing enquiries.  ',preferences:'',consent:true,website:'',...patch})
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(body){this.body=JSON.parse(body)}})
const request=body=>({method:'POST',headers:{host:'localhost:5173',origin:'http://localhost:5173','content-type':'application/json'},socket:{remoteAddress:'127.0.0.1'},body})

// Literal expectations captured from the legacy implementation before v2 changes.
test('legacy plan and call canonical JSON and immutable paths are exactly preserved',()=>{
 const expected={
  plan:['{"requestId":"123E4567-E89B-42D3-A456-426614174000","intent":"plan","email":"golden@example.com","business":"Trades and contracting","hours":"Under 5","pains":["booking","invoices"],"preferences":"","consent":true}','leads/plan/123E4567-E89B-42D3-A456-426614174000-1be3348643c58288955c04fc8307cdbc82e44f67befa217e92ff13a93989d92b.json'],
  call:['{"requestId":"123E4567-E89B-42D3-A456-426614174000","intent":"call","email":"golden@example.com","business":"Trades and contracting","hours":"Under 5","pains":["booking","invoices"],"preferences":"Weekday mornings, Eastern","consent":true}','leads/call/123E4567-E89B-42D3-A456-426614174000-0b79b15639fd1a942b6b4fbc8cc43c783cab6b0e57e12ef1b1f1d2f292b13881.json'],
 }
 for(const intent of ['plan','call']){
  const parsed=parseLead(legacy(intent))
  assert.equal(JSON.stringify(parsed),expected[intent][0]);assert.equal(leadPath(parsed),expected[intent][1])
  assert.equal(JSON.stringify(parseLead({...legacy(intent),message:'ignored extra',status:'Booked',website:false})),expected[intent][0])
 }
 for(const patch of [{business:undefined},{hours:undefined},{pains:[]}])assert.throws(()=>parseLead({...legacy(),...patch}))
})

test('version dispatch never downgrades supplied unsupported versions to legacy',()=>{
 for(const schemaVersion of [1,3,'2',null,undefined,false])assert.throws(()=>parseLead({...legacy(),schemaVersion}))
 for(const body of [null,[],false,'text'])assert.throws(()=>parseLead(body))
 assert.equal(Object.hasOwn(parseLead(legacy()),'schemaVersion'),false)
 assert.equal(parseLead(v2()).schemaVersion,2)
})

test('v2 omits absent context and retains only explicitly supplied valid context',()=>{
 const direct=parseLead(v2())
 assert.equal(Object.hasOwn(direct,'business'),false);assert.equal(Object.hasOwn(direct,'hours'),false)
 assert.deepEqual(direct.pains,[]);assert.equal(direct.message,'I would like help organizing enquiries.')
 const task=parseLead(v2({pains:['invoices'],message:''}))
 assert.equal(task.message,'');assert.deepEqual(task.pains,['invoices'])
 const context=parseLead(v2({business:'Online shop',hours:'5 to 15'}))
 assert.equal(context.business,'Online shop');assert.equal(context.hours,'5 to 15')
 for(const field of ['business','hours'])for(const value of ['',null,undefined,'Unknown',42])assert.throws(()=>parseLead(v2({[field]:value})))
 assert.deepEqual(Object.keys(context),['schemaVersion','requestId','intent','email','business','hours','pains','message','preferences','consent'])
})

test('v2 requires real task or message content and enforces input bounds and exact types',()=>{
 const invalid=[{message:undefined},{message:null},{message:42},{message:'x'.repeat(1001)},{message:' \n\t '},{pains:undefined},{pains:'invoices'},{pains:['unknown']},{pains:Array(1)},{pains:Array(6).fill('invoices')},{preferences:undefined},{preferences:null},{preferences:'x'.repeat(501)},{consent:false},{consent:undefined},{consent:'true'},{requestId:'bad'},{intent:'contact'},{email:'bad'}]
 for(const patch of invalid)assert.throws(()=>parseLead(v2(patch)),JSON.stringify(patch))
 assert.equal(parseLead(v2({message:'x'.repeat(1000),preferences:'x'.repeat(500)})).message.length,1000)
 assert.deepEqual(parseLead(v2({message:'',pains:['invoices','invoices']})).pains,['invoices'])
 for(const website of [undefined,null,false,0,{},[],true,'bot'])assert.throws(()=>parseLead(v2({website})))
 const absent=v2();delete absent.website;assert.equal(parseLead(absent).schemaVersion,2)
})

test('v2 canonicalization ignores input order and untrusted metadata; meaningful changes separate records',()=>{
 const input=v2({intent:'call',pains:['invoices','booking','invoices'],preferences:'  Eastern mornings  '})
 const original=parseLead(input)
 const reordered={...Object.fromEntries(Object.entries(input).reverse()),email:'direct@example.com',pains:['booking','invoices'],message:input.message.trim(),preferences:'Eastern mornings',status:'Booked',receivedAt:'attacker',privacyVersion:'attacker',source:'fabricated'}
 assert.equal(leadPath(original),leadPath(parseLead(reordered)))
 assert.equal(JSON.stringify(original),'{"schemaVersion":2,"requestId":"123E4567-E89B-42D3-A456-426614174000","intent":"call","email":"direct@example.com","pains":["booking","invoices"],"message":"I would like help organizing enquiries.","preferences":"Eastern mornings","consent":true}')
 for(const key of ['status','receivedAt','privacyVersion','source','website'])assert.equal(Object.hasOwn(parseLead(reordered),key),false)
 for(const patch of [{message:'A different request'},{business:'Online shop'},{hours:'Under 5'},{intent:'plan'},{requestId:'223E4567-E89B-42D3-A456-426614174000'}])assert.notEqual(leadPath(original),leadPath(parseLead({...input,...patch})))
 const legacyInput=legacy();assert.notEqual(leadPath(parseLead(legacyInput)),leadPath(parseLead({...legacyInput,schemaVersion:2,message:''})))
 assert.equal(parseLead(v2({preferences:'Do not retain call availability for plan'})).preferences,'')
})

test('both v2 contact purposes accept no prior questionnaire and return only the durable receipt',async()=>{
 for(const intent of ['plan','call']){
  let saved
  const handler=createLeadHandler({configured:()=>true,save:async lead=>{saved=lead},notify:async()=>{}})
  const res=response();await handler(request(v2({intent})),res)
  assert.equal(res.statusCode,200);assert.deepEqual(res.body,{saved:true,reference:requestId})
  assert.equal(saved.schemaVersion,2);assert.equal(saved.intent,intent)
  assert.equal(Object.hasOwn(saved,'business'),false);assert.equal(Object.hasOwn(saved,'hours'),false)
 }
})

test('invalid v2 requests never save or notify, and rejected saves never acknowledge',async()=>{
 let touched=false
 for(const patch of [{message:' '},{consent:false},{schemaVersion:'2'},{business:'Unknown'}]){
  const handler=createLeadHandler({configured:()=>true,save:async()=>{touched=true},notify:async()=>{touched=true}})
  const res=response();await handler(request(v2(patch)),res);assert.equal(res.statusCode,400);assert.notEqual(res.body.saved,true)
 }
 assert.equal(touched,false)
 const res=response();await createLeadHandler({configured:()=>true,save:async()=>{throw Error('storage unavailable')},notify:async()=>{touched=true}})(request(v2()),res)
 assert.equal(res.statusCode,503);assert.equal(touched,false);assert.notEqual(res.body.saved,true)
})

test('v2 does not acknowledge while private save is pending',async()=>{
 let release
 const gate=new Promise(resolve=>{release=resolve})
 const res=response();const pending=createLeadHandler({configured:()=>true,save:()=>gate,notify:async()=>{}})(request(v2()),res)
 await new Promise(resolve=>setImmediate(resolve));assert.equal(res.body,undefined)
 release();await pending;assert.equal(res.body.saved,true)
})

test('private storage preserves original receipt time and notice version after a lost response and retry',async()=>{
 for(const variant of ['legacy','v2','partner-default']){
  const lead=variant==='legacy'?parseLead(legacy()):variant==='v2'?parseLead(v2()):{requestId,name:'Synthetic partner'}
  const path=variant==='partner-default'?'leads/partner/synthetic-test.json':leadPath(lead)
  const version=variant==='v2'?'2026-09-30':undefined
  const objects=new Map();let time='2026-09-30T12:00:00.000Z';let readCount=0
  const save=createPrivateRecordSaver({token:()=> 'synthetic-token',now:()=>new Date(time),put:async(key,data,options)=>{
   assert.equal(options.access,'private');assert.equal(options.allowOverwrite,false);assert.equal(options.addRandomSuffix,false)
   if(objects.has(key))throw Error('already exists')
   objects.set(key,data);throw Error('synthetic lost response after durable save')
  },get:async(key,options)=>{readCount++;assert.equal(key,path);assert.equal(options.access,'private');assert.equal(options.useCache,false);return {statusCode:200,stream:new Response(objects.get(key)).body}}})
  await save(path,lead,version);const first=objects.get(path)
  time='2026-10-01T12:00:00.000Z';await save(path,lead,version)
  assert.equal(objects.size,1);assert.equal(objects.get(path),first);assert.equal(readCount,2)
  const data=JSON.parse(first);assert.equal(data.receivedAt,'2026-09-30T12:00:00.000Z');assert.equal(data.privacyVersion,version||'2026-09-29')
 }
})

test('private retry reconciliation fails closed for missing or different record content',async()=>{
 const lead=parseLead(v2()),path=leadPath(lead)
 for(const prior of [null,{statusCode:403},{statusCode:200,stream:new Response(JSON.stringify({...lead,message:'Different content'})).body}]){
  const save=createPrivateRecordSaver({token:()=> 'synthetic-token',put:async()=>{throw Error('save failed')},get:async key=>{assert.equal(key,path);return prior}})
  await assert.rejects(()=>save(path,lead,'2026-09-30'))
 }
})

test('notification text tolerates optional context and retains actual free text without inventing values',()=>{
 const text=leadNotificationText(parseLead(v2({message:'<b>Synthetic message</b>'})))
 assert.match(text,/Message: <b>Synthetic message<\/b>/)
 assert.match(text,/Challenges: No task category selected/)
 assert.doesNotMatch(text,/undefined|Business:|Hours:/)
 const full=leadNotificationText(parseLead(v2({business:'Online shop',hours:'Under 5'})))
 assert.match(full,/Business: Online shop/);assert.match(full,/Hours: Under 5/)
 assert.doesNotMatch(leadNotificationText(parseLead(legacy())),/Message:/)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import {createHash} from 'node:crypto'
import {summarizeInboxRows} from '../server/inbox-summary.ts'
import {createAdminHandler} from '../api/admin.ts'
import {AdminError} from '../server/admin-auth.ts'
const row=n=>{const source_key=`leads/plan/123e4567-e89b-42d3-a456-426614174000-${n.toString(16).padStart(64,'0')}.json`;return {id:createHash('sha256').update(source_key).digest('hex'),source_key,kind:'plan',status:'New',version:0}}
test('authorized page summaries are bounded, ordered, minimal and never include source paths or full records',async()=>{
 const rows=Array.from({length:25},(_,i)=>row(i));let active=0,peak=0;const readKeys=[]
 const results=await summarizeInboxRows(rows,async(key,signal)=>{assert.equal(signal.aborted,false);readKeys.push(key);peak=Math.max(peak,++active);await new Promise(r=>setImmediate(r));active--;return {email:'synthetic@example.com',message:'x'.repeat(1000),preferences:'private availability',consent:true,extra:'never disclose'}})
 assert.equal(peak,5);assert.deepEqual(readKeys.sort(),rows.map(r=>r.source_key).sort());assert.deepEqual(results.map(r=>r.id),rows.map(r=>r.id))
 for(const result of results){assert.deepEqual(Object.keys(result).sort(),['id','kind','status','summary','version']);assert.equal(result.summary.task.length,160);assert.deepEqual(Object.keys(result.summary).sort(),['sender','task'])}
 await assert.rejects(()=>summarizeInboxRows([...rows,row(25)],async()=>null),/exceeds limit/)
})
test('invalid paths/identities never read; absent, malformed or failed sources retain a usable indexed row',async()=>{
 const rows=[{...row(0),source_key:'https://untrusted.invalid/private'}, {...row(1),id:'wrong'},row(2),row(3),row(4)];let reads=0
 const results=await summarizeInboxRows(rows,async key=>{reads++;if(key===rows[2].source_key)return null;if(key===rows[3].source_key)return ['bad'];throw Error('synthetic unreadable')})
 assert.equal(reads,3);assert.equal(results.length,5);assert.ok(results.every(r=>r.summary===null&&!Object.hasOwn(r,'source_key')))
 const controller=new AbortController();controller.abort();let abortedReads=0;await summarizeInboxRows([row(5)],async()=>{abortedReads++;return null},controller.signal);assert.equal(abortedReads,0)
})
test('summaries use supplied partner identity or known legacy tasks and never invent absent context',async()=>{
 const results=await summarizeInboxRows([row(1),row(2),row(3)],async key=>key===row(1).source_key?{name:'Synthetic Partner',email:'partner@example.com',craft:'  Workflow\nimplementation  '}:key===row(2).source_key?{email:'legacy@example.com',pains:['booking','unrecognized']}:{email:'empty@example.com'})
 assert.deepEqual(results[0].summary,{sender:'Synthetic Partner · partner@example.com',task:'Workflow implementation'})
 assert.equal(results[1].summary.task,'Booking people in and sending reminders');assert.equal(results[2].summary.task,'Open request for details')
})
test('admin authorization failure prevents any inbox summary read',async()=>{
 let touched=false
 const handler=createAdminHandler({authorize:async()=>{throw new AdminError(403,'Denied')},inbox:async()=>{touched=true}})
 const res={setHeader(){},end(body){this.body=JSON.parse(body)}}
 await handler({method:'GET',url:'/api/admin',headers:{}},res)
 assert.equal(res.statusCode,403);assert.equal(touched,false);assert.deepEqual(res.body,{error:'Denied'})
})

test('summary deadline returns indexed fallbacks even if a storage reader ignores cancellation',async()=>{
 const controller=new AbortController();let reads=0,release
 const blocked=new Promise(resolve=>{release=resolve})
 const pending=summarizeInboxRows(Array.from({length:10},(_,i)=>row(i)),async()=>{reads++;return blocked},controller.signal)
 await new Promise(resolve=>setImmediate(resolve));assert.equal(reads,5)
 controller.abort(new Error('synthetic deadline'))
 const result=await Promise.race([pending,new Promise(resolve=>setTimeout(()=>resolve(null),100))])
 release({email:'late@example.com',message:'Late synthetic content'})
 assert.notEqual(result,null,'Deadline must settle without cooperation from the reader')
 assert.equal(result.length,10);assert.ok(result.every(r=>r.summary===null));assert.equal(reads,5)
 await new Promise(resolve=>setImmediate(resolve));assert.ok(result.every(r=>r.summary===null),'Late content cannot populate an already returned page')
})

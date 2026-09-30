import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { parsePartner,partnerPath } from '../server/partners.ts'
import { requireOwner,AdminError } from '../server/admin-auth.ts'
import { parseStatusChange,validLeadKey } from '../server/admin-store.ts'
import { createAdminHandler } from '../api/admin.ts'
import { createPartnerHandler } from '../api/partners.ts'
const partner=()=>({requestId:randomUUID(),name:'Synthetic review',email:'review@example.com',craft:'Test integration',contribution:'Building the automations',consent:true,website:''})
const response=()=>({headers:{},setHeader(k,v){this.headers[k]=v},end(body){this.body=JSON.parse(body)}})
const request=(body,patch={})=>({method:'POST',url:'/api/admin?action=status',headers:{host:'localhost:5173',origin:'http://localhost:5173','content-type':'application/json'},socket:{remoteAddress:'127.0.0.1'},body,...patch})
const change=()=>({id:'a'.repeat(64),status:'Contacted',version:0,mutationId:randomUUID()})
test('partner schema validates bounds, consent, enum, email and honeypot',()=>{
 for(const patch of [{name:''},{name:'x'.repeat(121)},{craft:'x'.repeat(1001)},{email:'bad'},{consent:false},{contribution:'other'},{website:'bot'},{requestId:'not-a-uuid'}])assert.throws(()=>parsePartner({...partner(),...patch}))
 const input=partner();assert.equal(partnerPath(parsePartner(input)),partnerPath(parsePartner({...input,email:' REVIEW@example.com '})))
 assert.ok(validLeadKey(partnerPath(parsePartner(input))))
})
test('partner save failure stays a failure; success requires durable save',async()=>{
 for(const fail of [false,true]){
 let called=false;const handler=createPartnerHandler({configured:()=>true,save:async()=>{called=true;if(fail)throw Error('offline')},notify:async()=>{}})
 const res=response();await handler(request(partner()),res);assert.ok(called);assert.equal(res.statusCode,fail?503:200);assert.equal(res.body.saved,fail?undefined:true)
 }
})
test('owner authorization is immutable-ID based and fails closed',()=>{
 assert.equal(requireOwner('user_owner','user_owner'),'user_owner')
 for(const [user,owner,code] of [[null,'user_owner',401],['user_other','user_owner',403],['user_owner',undefined,503]])assert.throws(()=>requireOwner(user,owner),e=>e.status===code)
})
test('all admin actions authorize before touching data and disable caching',async()=>{
 for(const code of [401,403,503])for(const action of ['list','detail&id='+ 'a'.repeat(64),'status','sync']){
 let touched=false;const nope=async()=>{touched=true}
 const handler=createAdminHandler({authorize:async()=>{throw new AdminError(code,'Denied')},inbox:nope,detail:nope,sync:nope,update:nope})
 const res=response();await handler(request(change(),{url:'/api/admin?action='+action,method:action.startsWith('list')||action.startsWith('detail')?'GET':'POST'}),res)
 assert.equal(res.statusCode,code);assert.equal(touched,false);assert.equal(res.headers['Cache-Control'],'private, no-store');assert.deepEqual(res.body,{error:'Denied'})
 }
})
test('status schema rejects invalid ID, enum, versions and mutation IDs',()=>{
 assert.equal(parseStatusChange(change()).status,'Contacted')
 for(const patch of [{id:'../secret'},{status:'Deleted'},{version:-1},{version:1.5},{version:'0'},{mutationId:'bad'}])assert.throws(()=>parseStatusChange({...change(),...patch}))
 for(const key of ['https://store/secret','leads/plan/../../secret','leads/not-allowed/'+randomUUID()+'.json'])assert.equal(validLeadKey(key),false)
})
test('admin mutation validates origin, content type, size and JSON before update',async()=>{
 let calls=0;const handler=createAdminHandler({authorize:async()=>'owner',update:async()=>{calls++;return {saved:true}},inbox:async()=>({leads:[]}),detail:async()=>({}),sync:async()=>({})})
 for(const [req,code] of [[request(change(),{headers:{}}),403],[request(change(),{headers:{origin:'malformed',host:'localhost:5173'}}),403],[request(change(),{headers:{origin:'http://localhost:5173',host:'localhost:5173'}}),415],[request('{'),400],[request('x'.repeat(4097)),413]]){
 const res=response();await handler(req,res);assert.equal(res.statusCode,code)
 }
 assert.equal(calls,0)
 const res=response();await handler(request(change()),res);assert.equal(res.statusCode,200);assert.equal(calls,1)
})
test('stale updates surface a conflict without false success',async()=>{
 const handler=createAdminHandler({authorize:async()=>'owner',update:async()=>{throw new AdminError(409,'Refresh')},inbox:async()=>({}),detail:async()=>({}),sync:async()=>({})})
 const res=response();await handler(request(change()),res);assert.equal(res.statusCode,409);assert.notEqual(res.body.saved,true)
})

test('authorization checks session token policy, live revocation and verified owner email',async()=>{
 const {createAdminAuthorizer}=await import('../server/admin-auth.ts')
 const env={CLERK_SECRET_KEY:'test-only',VITE_CLERK_PUBLISHABLE_KEY:'test-only',ADMIN_OWNER_USER_ID:'user_owner',ADMIN_ALLOWED_ORIGINS:'https://preview.example.com'}
 const req={url:'/api/admin',headers:{authorization:'Bearer synthetic-token',origin:'https://preview.example.com'}}
 for(const scenario of ['owner','anonymous','nonowner','revoked','wrong-session-user','unverified','wrong-email']){
 let verifiedPolicy=false
 const clientFactory=()=>({authenticateRequest:async(_req,options)=>{
 assert.deepEqual(options,{authorizedParties:['https://preview.example.com'],acceptsToken:'session_token'});verifiedPolicy=true
 return {toAuth:()=>scenario==='anonymous'?null:{userId:scenario==='nonowner'?'user_other':'user_owner',sessionId:'session_test'}}
 },sessions:{getSession:async()=>({status:scenario==='revoked'?'revoked':'active',userId:scenario==='wrong-session-user'?'user_other':'user_owner'})},users:{getUser:async()=>({primaryEmailAddressId:'email_test',emailAddresses:[{id:'email_test',emailAddress:scenario==='wrong-email'?'other@example.com':'taitgoodwin@gmail.com',verification:{status:scenario==='unverified'?'unverified':'verified'}}]})}})
 const authorize=createAdminAuthorizer({environment:()=>env,clientFactory})
 if(scenario==='owner')assert.equal(await authorize(req),'user_owner')
 else await assert.rejects(()=>authorize(req),e=>e.status===(['anonymous','revoked','wrong-session-user'].includes(scenario)?401:403))
 assert.ok(verifiedPolicy)
 }
 const authorize=createAdminAuthorizer({environment:()=>env,clientFactory:()=>{throw Error('Must not run')}})
 await assert.rejects(()=>authorize({...req,headers:{origin:'https://preview.example.com'}}),e=>e.status===401)
 await assert.rejects(()=>authorize({...req,headers:{...req.headers,origin:'https://attacker.example.com'}}),e=>e.status===403)
})

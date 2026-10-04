import assert from 'node:assert/strict'
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {Client} from 'pg'
import {get} from '@vercel/blob'
import {parseLead,leadPath} from '../../server/leads.ts'
import {parsePartner,partnerPath} from '../../server/partners.ts'
const directory=new URL('./',import.meta.url),configPath=new URL('provider-config.json',directory)
const config=JSON.parse(readFileSync(configPath,'utf8'));unlinkSync(configPath)
for(const key of Object.keys(process.env))if(/^(PG|DATABASE_URL|POSTGRES_|BLOB_|PREVIEW_|VERCEL_|CLERK_|VITE_CLERK_|RESEND_|LEAD_EMAIL_|NEON_)/.test(key))delete process.env[key]
const connection=new URL(config.previewDatabase);assert.equal(connection.hostname.endsWith('.neon.tech'),true);connection.searchParams.set('sslmode','verify-full')
const client=new Client({connectionString:connection.href,connectionTimeoutMillis:5000,query_timeout:10000,statement_timeout:10000})
const inputs=JSON.parse(readFileSync(new URL('ui-inputs.json',directory),'utf8')),fixtures=[]
const evidence={source:'82967bddfc053d099eefd397a1e3f879fcd6e41d',deployment:'dpl_CGhnWnHPBRYo2YBiMfCCjzMkm6aH',mode:'real hosted UI submissions; exact private preview readback; no object listing or general inbox export',cases:[]}
try{
 await client.connect()
 const identity=(await client.query('SELECT current_database() AS name,current_setting(\'server_version\') AS version')).rows[0]
 assert.equal(identity.name,decodeURIComponent(connection.pathname.slice(1)));evidence.postgresVersion=identity.version
 for(const input of inputs){
  assert.match(input.email,/^levarum-hosted-20261004-a7d31c-(plan|call|partner)@example\.com$/)
  const parse=input.intent==='partner'?parsePartner:parseLead,path=input.intent==='partner'?partnerPath:leadPath
  const placeholder='11111111-1111-4111-8111-111111111111',canonical=parse({...input,requestId:placeholder})
  const [before,after]=JSON.stringify(canonical).split(placeholder);assert.ok(before&&after)
  const prefix=`leads/${input.intent}/`
  // Return only a key whose complete content hash equals our unique synthetic
  // input with that key's generated UUID. No other record content is selected.
  const query=`SELECT id,source_key FROM levarum_lead_index WHERE kind=$1 AND received_at >= $2 AND source_key = $3 || substring(source_key from $4::integer for 36) || '-' || encode(sha256(convert_to($5 || substring(source_key from $4::integer for 36) || $6,'UTF8')),'hex') || '.json'`
  const values=[input.intent,'2026-10-04T04:53:03.688Z',prefix,prefix.length+1,before,after]
  const found=await client.query(query,values);assert.equal(found.rowCount,1)
  const key=found.rows[0].source_key,id=found.rows[0].id,requestId=key.slice(prefix.length,prefix.length+36)
  const expected=parse({...input,requestId});assert.equal(path(expected),key);assert.equal(createHash('sha256').update(key).digest('hex'),id)
  // Prove this selector requires the full exact synthetic content.
  assert.equal((await client.query(query,[...values.slice(0,5),after.replace('a7d31c','different-synthetic-marker')])).rowCount,0)
  const result=await get(key,{token:config.previewToken,access:'private',useCache:false,abortSignal:AbortSignal.timeout(10000)});assert.equal(result?.statusCode,200)
  const saved=await new Response(result.stream).json()
  for(const [field,value] of Object.entries(expected))assert.deepEqual(saved[field],value)
  assert.equal(saved.privacyVersion,input.intent==='partner'?'2026-09-29':'2026-09-30');assert.ok(Number.isFinite(Date.parse(saved.receivedAt)))
  if(input.intent!=='partner'){assert.equal('business' in saved,false);assert.equal('hours' in saved,false)}
  const anonymous=await fetch(result.blob.url,{signal:AbortSignal.timeout(10000)});assert.equal(anonymous.status,403);await anonymous.body?.cancel()
  fixtures.push({kind:input.intent,id,key,input:{...input,requestId}})
  evidence.cases.push({kind:input.intent,hostedUiReceipt:true,exactHashMatch:true,privateReadback:true,allSubmittedFieldsMatch:true,consent:true,privacyVersion:saved.privacyVersion,anonymousRead:403,ownerBrowser:'pending'})
  writeFileSync(new URL('ui-fixtures.json',directory),JSON.stringify(fixtures,null,2))
  writeFileSync(new URL('ui-results.json',directory),JSON.stringify(evidence,null,2))
  console.log(`${input.intent}: actual hosted submission matched exactly, private readback and anonymous403 PASS`)
 }
}catch(error){console.error(`Verification failed (${error.name}; code ${error.code??'none'}); provider details withheld`);process.exitCode=1}
finally{await client.end();config.previewToken='';config.previewDatabase=''}

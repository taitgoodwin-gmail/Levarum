import { blobToken } from './blob-config.ts'
import { Pool } from 'pg'
import { createHash } from 'node:crypto'
import { get, list } from '@vercel/blob'
import {summarizeInboxRows,validLeadKey} from './inbox-summary.ts'
export {validLeadKey} from './inbox-summary.ts'
import { AdminError } from './admin-auth.ts'
let pool:Pool|undefined, schema:Promise<void>|undefined
export const STATUSES=['new','in-progress','waiting','closed'] as const
export type Status=typeof STATUSES[number]
async function db(){
 if(!process.env.DATABASE_URL)throw new AdminError(503,'Dashboard storage is not configured')
 pool??=new Pool({connectionString:process.env.DATABASE_URL,max:3,connectionTimeoutMillis:5000,idleTimeoutMillis:10000})
 schema??=pool.query(`CREATE TABLE IF NOT EXISTS levarum_lead_index(id text PRIMARY KEY,source_key text UNIQUE NOT NULL,kind text NOT NULL,received_at timestamptz NOT NULL,status text NOT NULL DEFAULT 'new',version integer NOT NULL DEFAULT 0);
 CREATE TABLE IF NOT EXISTS levarum_status_events(mutation_id uuid PRIMARY KEY,lead_id text NOT NULL REFERENCES levarum_lead_index(id),old_status text NOT NULL,new_status text NOT NULL,actor text NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),version integer NOT NULL);
 CREATE TABLE IF NOT EXISTS levarum_sync(id integer PRIMARY KEY CHECK(id=1),cursor text,last_complete timestamptz);
 INSERT INTO levarum_sync(id) VALUES(1) ON CONFLICT DO NOTHING;`).then(()=>{}).catch(e=>{schema=undefined;throw e})
 await schema;return pool
}
export async function indexLead(key:string,date=new Date()){
 if(!validLeadKey(key))throw new Error('Invalid lead key')
 const d=await db();const id=createHash('sha256').update(key).digest('hex')
 await d.query('INSERT INTO levarum_lead_index(id,source_key,kind,received_at) VALUES($1,$2,$3,$4) ON CONFLICT(source_key) DO NOTHING',[id,key,key.split('/')[1],date]);return id
}
export async function syncPage(){
 const d=await db();const c=await d.connect()
 try{await c.query('BEGIN');const {rows}=await c.query('SELECT cursor FROM levarum_sync WHERE id=1 FOR UPDATE');const result=await list({token:blobToken(),prefix:'leads/',limit:50,cursor:rows[0].cursor||undefined})
 for(const blob of result.blobs){if(!validLeadKey(blob.pathname))continue;const id=createHash('sha256').update(blob.pathname).digest('hex');await c.query('INSERT INTO levarum_lead_index(id,source_key,kind,received_at) VALUES($1,$2,$3,$4) ON CONFLICT(source_key) DO NOTHING',[id,blob.pathname,blob.pathname.split('/')[1],blob.uploadedAt])}
 await c.query('UPDATE levarum_sync SET cursor=$1,last_complete=CASE WHEN $1::text IS NULL THEN now() ELSE last_complete END WHERE id=1',[result.hasMore?result.cursor:null]);await c.query('COMMIT');return {hasMore:result.hasMore}
 }catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
}
export async function readInbox(page:number,kind:string,status:string){
 const d=await db();const filter="($1='' OR kind=$1) AND ($2='' OR status=$2)"
 const [rows,total,counts,sync]=await Promise.all([d.query(`SELECT id,source_key,kind,received_at,status,version FROM levarum_lead_index WHERE ${filter} ORDER BY received_at DESC,id LIMIT 25 OFFSET $3`,[kind,status,page*25]),d.query(`SELECT count(*)::int AS count FROM levarum_lead_index WHERE ${filter}`,[kind,status]),d.query('SELECT status,count(*)::int AS count FROM levarum_lead_index GROUP BY status'),d.query('SELECT last_complete,cursor IS NOT NULL AS in_progress FROM levarum_sync WHERE id=1')])
 const leads=await summarizeInboxRows(rows.rows,async(key,signal)=>{const blob=await get(key,{token:blobToken(),access:'private',useCache:false,abortSignal:signal});if(!blob||blob.statusCode!==200)return null;return new Response(blob.stream).json()})
 return {leads,total:total.rows[0].count,counts:counts.rows,sync:sync.rows[0]}
}
export async function readDetail(id:string){
 const d=await db();const {rows}=await d.query('SELECT * FROM levarum_lead_index WHERE id=$1',[id]);if(!rows[0])throw new AdminError(404,'Request not found')
 if(!validLeadKey(rows[0].source_key))throw new AdminError(404,'Request not found')
 const blob=await get(rows[0].source_key,{token:blobToken(),access:'private',useCache:false});if(!blob||blob.statusCode!==200)throw new AdminError(404,'Saved submission unavailable')
 const lead=await new Response(blob.stream).json() as Record<string,unknown>
 const events=await d.query('SELECT old_status,new_status,actor,created_at,version FROM levarum_status_events WHERE lead_id=$1 ORDER BY version DESC',[id])
 let source:null|{record:Record<string,unknown>;lead:unknown}=null
 if(lead?.intent==='call'&&typeof lead.sourceRequestId==='string'&&/^[a-f\d-]{36}$/i.test(lead.sourceRequestId)){
  const sourceRows=await d.query('SELECT id,source_key,kind,received_at,status,version FROM levarum_lead_index WHERE source_key LIKE $1 ORDER BY received_at DESC LIMIT 2',[`leads/plan/${lead.sourceRequestId}-%`])
  if(sourceRows.rows.length===1){
   const linked=sourceRows.rows[0]
   const sourceBlob=await get(linked.source_key,{token:blobToken(),access:'private',useCache:false})
   if(sourceBlob?.statusCode===200){
    const sourceLead=await new Response(sourceBlob.stream).json() as Record<string,unknown>
    // A caller may name an arbitrary UUID; only show it as a linked intake
    // when the independently saved contact address matches this request.
    if(typeof sourceLead.email==='string'&&sourceLead.email.toLowerCase()===lead.email){
     const {source_key:_,...sourceRecord}=linked;source={record:sourceRecord,lead:sourceLead}
    }
   }
  }
 }
 const {source_key:_,...record}=rows[0];return {record,lead,source,events:events.rows}
}
export function parseStatusChange(body:unknown){
 if(!body||typeof body!=='object')throw new AdminError(400,'Invalid update')
 const b=body as Record<string,unknown>
 if(typeof b.id!=='string'||!/^[a-f\d]{64}$/.test(b.id)||!STATUSES.includes(b.status as Status)||!Number.isSafeInteger(b.version)||Number(b.version)<0||typeof b.mutationId!=='string'||!/^([a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12})$/i.test(b.mutationId))throw new AdminError(400,'Invalid update')
 return {id:b.id,status:b.status as Status,version:Number(b.version),mutationId:b.mutationId}
}
export async function updateStatus(body:unknown,actor:string){
 const b=parseStatusChange(body),d=await db(),c=await d.connect()
 try{await c.query('BEGIN');const {rows}=await c.query('SELECT status,version,kind FROM levarum_lead_index WHERE id=$1 FOR UPDATE',[b.id]);if(!rows[0])throw new AdminError(404,'Request not found')
 const prior=await c.query('SELECT lead_id,new_status,version,actor FROM levarum_status_events WHERE mutation_id=$1',[b.mutationId]);if(prior.rows[0]){const e=prior.rows[0];if(e.lead_id!==b.id||e.new_status!==b.status||e.actor!==actor)throw new AdminError(409,'Update identifier already used');await c.query('COMMIT');return {saved:true,status:rows[0].status,version:rows[0].version}}
 if(rows[0].version!==b.version)throw new AdminError(409,'This request changed. Refresh its details before trying again.')
 if(rows[0].status===b.status){await c.query('COMMIT');return {saved:true,status:b.status,version:b.version}}
 await c.query('UPDATE levarum_lead_index SET status=$1,version=version+1 WHERE id=$2',[b.status,b.id]);await c.query('INSERT INTO levarum_status_events(mutation_id,lead_id,old_status,new_status,actor,version) VALUES($1,$2,$3,$4,$5,$6)',[b.mutationId,b.id,rows[0].status,b.status,actor,b.version+1]);await c.query('COMMIT');return {saved:true,status:b.status,version:b.version+1}
 }catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
}

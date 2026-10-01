import {createHash} from 'node:crypto'
import {PUBLIC_PAINS} from '../src/domain/public.ts'
export function validLeadKey(key:string){return /^leads\/(plan|call|partner)\/[a-f\d-]{36}-[a-f\d]{64}\.json$/i.test(key)}
type IndexedRow={id:string;source_key:string;[key:string]:unknown}
const short=(value:unknown,max:number)=>typeof value==='string'?value.replace(/\s+/g,' ').trim().slice(0,max):''
/** Request-local, bounded projection of only the current authorized SQL page. No persistent PII index. */
export async function summarizeInboxRows(rows:IndexedRow[],read:(key:string,signal:AbortSignal)=>Promise<unknown>,signal=AbortSignal.timeout(4000)){
 if(rows.length>25)throw new Error('Inbox page exceeds limit')
 const results:Record<string,unknown>[]=new Array(rows.length);let next=0
 await Promise.all(Array.from({length:Math.min(5,rows.length)},async()=>{
  while(next<rows.length){
   const i=next++,{source_key:key,...row}=rows[i]
   results[i]={...row,summary:null}
   if(signal.aborted||!validLeadKey(key)||createHash('sha256').update(key).digest('hex')!==row.id)continue
   try{
    const data=await read(key,signal)
    if(!data||typeof data!=='object'||Array.isArray(data))continue
    const lead=data as Record<string,unknown>,email=short(lead.email,254),name=short(lead.name,120)
    if(!email)continue
    const tasks=Array.isArray(lead.pains)?PUBLIC_PAINS.filter(p=>lead.pains instanceof Array&&lead.pains.includes(p.id)).map(p=>p.label).join(', '):''
    results[i]={...row,summary:{sender:name?`${name} · ${email}`:email,task:short(lead.message,160)||short(lead.craft,160)||short(tasks,160)||'Open request for details'}}
   }catch{/* A missing/unreadable record cannot hide the rest of the indexed page. */}
  }
 }))
 return results
}

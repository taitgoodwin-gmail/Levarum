// Executable proposal ONLY. Not imported by application/server code.
// In-memory per-key mutex models a PostgreSQL transaction advisory lock; it is
// not a production lock or evidence of provider concurrency guarantees.
import {createPrivateRecordSaver} from '../../server/private-save.ts'
export const marker=JSON.stringify({_levarumDeletion:1})
export function createDeletionModel(){
 const blobs=new Map(),index=new Map(),history=new Map(),locks=new Map()
 async function locked(key,work){
  const prior=locks.get(key)||Promise.resolve();let release
  const current=new Promise(resolve=>{release=resolve});locks.set(key,current)
  await prior
  try{return await work()}finally{release();if(locks.get(key)===current)locks.delete(key)}
 }
 const rawGet=async key=>blobs.has(key)?{statusCode:200,stream:new Response(blobs.get(key)).body}:null
 const save=createPrivateRecordSaver({token:()=> 'synthetic-only',get:rawGet,put:async(key,body,options)=>{
  // Atomic no-overwrite is the storage primitive the proposal relies on.
  await hooks.beforePut(key)
  if(blobs.has(key)&&!options.allowOverwrite)throw Error('occupied')
  blobs.set(key,body)
 }})
 const hooks={beforePut:async()=>{},beforeIndex:async()=>{},afterMarker:async()=>{}}
 async function indexKey(key){return locked(key,async()=>{
  await hooks.beforeIndex(key)
  const body=blobs.get(key)
  if(!body||body===marker)return false
  index.set(key,{status:'New'});return true
 })}
 async function erase(key){return locked(key,async()=>{
  // Markers are never removed. A missing original key is also sealed.
  blobs.set(key,marker)
  await hooks.afterMarker(key)
  if(blobs.get(key)!==marker)throw Error('marker not confirmed')
  history.delete(key);index.delete(key)
 })}
 async function reconcile(listSnapshot){for(const key of listSnapshot)await indexKey(key)}
 function exportMarkers(){return [...blobs].filter(([,body])=>body===marker).map(([key])=>key)}
 function restore(archive,currentMarkers){
  if(!currentMarkers)throw Error('Current exclusion manifest required')
  const blocked=new Set(currentMarkers),target=new Map(currentMarkers.map(key=>[key,marker]))
  for(const [key,body] of archive)if(!blocked.has(key)&&!target.has(key))target.set(key,body)
  return target
 }
 return {blobs,index,history,hooks,save,indexKey,erase,reconcile,exportMarkers,restore}
}

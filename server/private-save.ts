import { get, put } from '@vercel/blob'
/** Content-addressed records are immutable, including their first receivedAt. */
export async function savePrivateRecord(path:string, lead:object) {
 try {
  await put(path, JSON.stringify({...lead,receivedAt:new Date().toISOString(),privacyVersion:'2026-09-29'}), {
   access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:false,abortSignal:AbortSignal.timeout(12000),
  })
 } catch(error) {
  // A lost response or duplicate retry may already have saved this exact content.
  // Read only the known content-addressed key; never turn an arbitrary error into success.
  const prior=await get(path,{access:'private',useCache:false,abortSignal:AbortSignal.timeout(5000)})
  if(!prior||prior.statusCode!==200)throw error
  const data=await new Response(prior.stream).json() as Record<string,unknown>
  if(!Object.entries(lead).every(([key,value])=>JSON.stringify(data[key])===JSON.stringify(value)))throw error
 }
}

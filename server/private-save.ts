import { blobToken } from './blob-config.ts'
import { get, put } from '@vercel/blob'
type PrivacyVersion = '2026-09-29' | '2026-09-30'
type SaveDependencies = { put: typeof put; get: typeof get; token: typeof blobToken; now: () => Date }
/** Content-addressed records are immutable, including their first receivedAt and notice version. */
export function createPrivateRecordSaver({put: putRecord = put, get: getRecord = get, token = blobToken, now = () => new Date()}: Partial<SaveDependencies> = {}) {
 return async function save(path:string, lead:object, privacyVersion:PrivacyVersion = '2026-09-29') {
  try {
   await putRecord(path, JSON.stringify({...lead,receivedAt:now().toISOString(),privacyVersion}), {
    token:token(),access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:false,abortSignal:AbortSignal.timeout(12000),
   })
  } catch(error) {
   // A lost response or duplicate retry may already have saved this exact content.
   // Read only the known content-addressed key; never turn an arbitrary error into success.
   const prior=await getRecord(path,{token:token(),access:'private',useCache:false,abortSignal:AbortSignal.timeout(5000)})
   if(!prior||prior.statusCode!==200)throw error
   const data=await new Response(prior.stream).json() as Record<string,unknown>
   if(!Object.entries(lead).every(([key,value])=>JSON.stringify(data[key])===JSON.stringify(value)))throw error
  }
 }
}
export const savePrivateRecord = createPrivateRecordSaver()

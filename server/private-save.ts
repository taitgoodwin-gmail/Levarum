import { abortable } from '../src/domain/abortable.ts'
import { blobToken } from './blob-config.ts'
import { get, put } from '@vercel/blob'
type PrivacyVersion = '2026-09-29' | '2026-09-30'
type SaveDependencies = { put: typeof put; get: typeof get; token: typeof blobToken; now: () => Date }
/** Content-addressed records are immutable, including their first receivedAt and notice version. */
export function createPrivateRecordSaver({put: putRecord = put, get: getRecord = get, token = blobToken, now = () => new Date()}: Partial<SaveDependencies> = {}) {
 return async function save(path:string, lead:object, privacyVersion:PrivacyVersion = '2026-09-29') {
  try {
   const writeSignal=AbortSignal.timeout(12000)
   await abortable(putRecord(path, JSON.stringify({...lead,receivedAt:now().toISOString(),privacyVersion}), {
    token:token(),access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:false,abortSignal:writeSignal,
   }),writeSignal)
  } catch(error) {
   // A lost response or duplicate retry may already have saved this exact content.
   // Read only the known content-addressed key; never turn an arbitrary error into success.
   const readSignal=AbortSignal.timeout(5000)
   const prior=await abortable(getRecord(path,{token:token(),access:'private',useCache:false,abortSignal:readSignal}),readSignal)
   if(!prior||prior.statusCode!==200)throw error
   // The same read budget covers the body; abort also cancels a stalled source stream.
   const stream=prior.stream.pipeThrough(new TransformStream(),{signal:readSignal})
   const data=await abortable(new Response(stream).json(),readSignal) as Record<string,unknown>
   if(!Object.entries(lead).every(([key,value])=>JSON.stringify(data[key])===JSON.stringify(value)))throw error
  }
 }
}
export const savePrivateRecord = createPrivateRecordSaver()

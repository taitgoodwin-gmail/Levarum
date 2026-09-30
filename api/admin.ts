import type { IncomingMessage, ServerResponse } from 'node:http'
import { authorizeAdmin, AdminError } from '../server/admin-auth.ts'
import { readInbox, readDetail, syncPage, updateStatus, STATUSES } from '../server/admin-store.ts'
type RequestWithBody=IncomingMessage&{body?:unknown}
type Dependencies={authorize:typeof authorizeAdmin;inbox:typeof readInbox;detail:typeof readDetail;sync:typeof syncPage;update:typeof updateStatus}
export function createAdminHandler(deps:Dependencies={authorize:authorizeAdmin,inbox:readInbox,detail:readDetail,sync:syncPage,update:updateStatus}){
 return async(req:RequestWithBody,res:ServerResponse)=>{
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Content-Type','application/json');res.setHeader('X-Robots-Tag','noindex')
 const send=(status:number,body:unknown)=>{res.statusCode=status;res.end(JSON.stringify(body))}
 try{
 const actor=await deps.authorize(req)
 const url=new URL(req.url||'/', 'http://internal'),action=url.searchParams.get('action')||'list'
 if(req.method==='GET'){
 if(action==='detail'){const id=url.searchParams.get('id')||'';if(!/^[a-f\d]{64}$/.test(id))throw new AdminError(400,'Invalid request ID');return send(200,await deps.detail(id))}
 if(action!=='list')throw new AdminError(400,'Unknown action')
 const page=Number(url.searchParams.get('page')||0),kind=url.searchParams.get('kind')||'',status=url.searchParams.get('status')||''
 if(!Number.isInteger(page)||page<0||page>10000||!['','plan','call','partner'].includes(kind)||!(status===''||STATUSES.includes(status as typeof STATUSES[number])))throw new AdminError(400,'Invalid filter')
 return send(200,await deps.inbox(page,kind,status))
 }
 if(req.method!=='POST')return send(405,{error:'Use GET or POST'})
 try { if(!req.headers.origin||new URL(req.headers.origin).host!==req.headers.host)throw new Error() } catch { throw new AdminError(403,'Origin not allowed') }
 if(!req.headers['content-type']?.startsWith('application/json'))throw new AdminError(415,'Use JSON')
 let raw:string
 if(req.body!==undefined)raw=typeof req.body==='string'?req.body:JSON.stringify(req.body)
 else{const chunks:Buffer[]=[];let size=0;for await(const chunk of req){const b=Buffer.from(chunk);size+=b.length;if(size>4096)throw new AdminError(413,'Request too large');chunks.push(b)}raw=Buffer.concat(chunks).toString()}
 if(Buffer.byteLength(raw)>4096)throw new AdminError(413,'Request too large')
 const body=JSON.parse(raw)
 if(action==='sync')return send(200,await deps.sync())
 if(action==='status')return send(200,await deps.update(body,actor))
 throw new AdminError(400,'Unknown action')
 }catch(e){if(e instanceof AdminError)return send(e.status,{error:e.message});if(e instanceof SyntaxError)return send(400,{error:'Invalid request'});console.error('Admin request failed');return send(503,{error:'Dashboard temporarily unavailable. Please retry.'})}
 }
}
export default createAdminHandler()

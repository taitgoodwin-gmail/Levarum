import { createHash } from 'node:crypto'
import { LeadInputError } from './leads.ts'
import { CONTRIBUTIONS } from '../src/domain/public.ts'
export interface Partner {requestId:string;intent:'partner';name:string;craft:string;contribution:string;email:string;consent:true}
export function parsePartner(body:unknown):Partner{
 if(!body||typeof body!=='object'||Array.isArray(body))throw new LeadInputError('Invalid request')
 const b=body as Record<string,unknown>
 const text=(key:string,max:number)=>{const v=typeof b[key]==='string'?(b[key] as string).trim():'';if(!v||v.length>max)throw new LeadInputError(`Invalid ${key}`);return v}
 const requestId=text('requestId',36);if(!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(requestId))throw new LeadInputError('Invalid ID')
 const email=text('email',254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new LeadInputError('Invalid email')
 const contribution=text('contribution',100);if(!CONTRIBUTIONS.some(c=>c===contribution)||b.consent!==true||b.website)throw new LeadInputError('Invalid request')
 return {requestId,intent:'partner',name:text('name',120),craft:text('craft',1000),contribution,email,consent:true}
}
export function partnerPath(p:Partner){return `leads/partner/${p.requestId}-${createHash('sha256').update(JSON.stringify(p)).digest('hex')}.json`}

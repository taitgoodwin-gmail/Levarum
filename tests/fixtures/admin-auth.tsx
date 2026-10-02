// Only resolved by tests/browser/admin-states.mjs's loopback Vite server.
// Never imported or aliased by either production entry/configuration.
import {useSyncExternalStore} from 'react'
let state={isLoaded:true,isSignedIn:sessionStorage.getItem('synthetic-signed-out')!=='1',userId:'synthetic-owner',sessionId:'synthetic-session',token:'synthetic-invalid-token',signOutFails:false,tokenPending:false}
const listeners=new Set<()=>void>()
const subscribe=(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn)}}
const getToken=async()=>state.tokenPending?new Promise<string>(()=>{}):state.token
const signOut=async()=>{if(state.signOutFails)throw Error('synthetic signout failure');sessionStorage.setItem('synthetic-signed-out','1');update({isSignedIn:false,token:''})}
function update(patch:Partial<typeof state>){state={...state,...patch};listeners.forEach(fn=>fn())}
Object.assign(window,{adminFixture:{update}})
export function useAuth(){const snapshot=useSyncExternalStore(subscribe,()=>state);return {...snapshot,getToken}}
export function useClerk(){return {signOut}}
export function ClerkProvider({children}:{children:React.ReactNode}){return <>{children}</>}
export function SignIn(){return <p>Synthetic sign-in fixture</p>}
export const SignUp=SignIn

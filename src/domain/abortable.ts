/** Bound waiting even when a dependency ignores cancellation; late results are discarded. */
export function abortable<T>(work:Promise<T>,signal:AbortSignal):Promise<T>{
 return new Promise((resolve,reject)=>{
  const aborted=()=>{signal.removeEventListener('abort',aborted);reject(signal.reason??new Error('Request aborted'))}
  work.then(value=>{signal.removeEventListener('abort',aborted);resolve(value)},error=>{signal.removeEventListener('abort',aborted);reject(error)})
  if(signal.aborted)aborted();else signal.addEventListener('abort',aborted,{once:true})
 })
}

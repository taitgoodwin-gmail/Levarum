import { useRef, useState, type KeyboardEvent } from 'react'
import '../styles/signature.css'

export function SignatureBrand() {
 return <a className="lv-signature-brand" href="/" aria-label="Levarum Home"><img src="/brand/signature-mark.svg" width="20" height="25" alt=""/><span>Levarum</span></a>
}

export function SignatureOpening() {
 const [connected, setConnected] = useState(false)
 const controls = useRef<(HTMLButtonElement | null)[]>([])
 function navigate(event: KeyboardEvent<HTMLButtonElement>) {
  const next = event.key === 'ArrowRight' || event.key === 'End' ? 1 : event.key === 'ArrowLeft' || event.key === 'Home' ? 0 : null
  if (next === null) return
  event.preventDefault(); setConnected(next === 1); controls.current[next]?.focus()
 }
 return <section className={`lv-signature-opening${connected ? ' is-connected' : ''}`} aria-labelledby="home-title">
  <div className="lv-signature-editorial">
   <p className="lv-signature-eyebrow">LESS REPEAT. MORE ROOM.</p>
   <h1 id="home-title"><span>Make work</span>{' '}<em>flow.</em></h1>
   <div className="lv-signature-message"><p>Practical automation for small businesses. We connect your everyday tools. You keep the work that needs you.</p><a className="lv-signature-action" href="/contact">Tell us what repeats <span className="lv-signature-arrow" aria-hidden="true"/></a></div>
   <p className="lv-signature-assurance">Built around your tools. Shaped around your people.</p>
  </div>
  <div className="lv-signature-controls">
   <p role="status" aria-live="polite" aria-atomic="true">{connected ? 'The routine is connected. You stay in control.' : 'See one enquiry become a clear next step.'}<span className="lv-sr-only">{connected ? ' Details filed. Reply drafted. You review and send; nothing sends until you say so.' : ' Enquiry received. Details to capture. Reply to write. You review and send.'}</span></p>
   <div role="group" aria-label="Compare enquiry workflow">{['Scattered','Connected'].map((label,index)=><button key={label} ref={el=>{controls.current[index]=el}} type="button" aria-pressed={connected === (index===1)} aria-controls="signature-scene" onClick={()=>setConnected(index===1)} onKeyDown={navigate}>0{index+1} &nbsp; {label}</button>)}</div>
  </div>
  <div className="lv-signature-scene" id="signature-scene" role="group" aria-label="Illustrative enquiry workflow">
   <div className="lv-signature-caption"><p>01 / ENQUIRY TO REPLY</p><h2>{connected ? 'Details filed. Reply drafted.' : 'An enquiry. Too much chasing.'}</h2></div>
   <div className="lv-signature-canvas"><div className="lv-signature-art" aria-hidden="true">
    <picture className="lv-signature-strands scattered"><source media="(max-width: 1199px)" srcSet="/brand/signature-scattered-mobile.svg"/><img src="/brand/signature-scattered-desktop.svg" width="874" height="547" alt=""/></picture>
    <picture className="lv-signature-strands connected"><source media="(max-width: 1199px)" srcSet="/brand/signature-connected-mobile.svg"/><img src="/brand/signature-connected-desktop.svg" width="874" height="546" alt=""/></picture>
    <div className="lv-signature-annotation"><img className="leader" src="/brand/signature-leader.svg" width="67" height="69" alt=""/><img className="pin" src="/brand/signature-pin.svg" width="10" height="10" alt=""/></div>
   </div>
   <div className="lv-signature-labels scattered" aria-hidden={connected}>
    <p className="signal input"><img src="/brand/signature-signal.svg" width="5" height="5" alt=""/>“CAN YOU HELP WITH A BOOKING?”</p>
    <p className="signal find"><img src="/brand/signature-signal.svg" width="5" height="5" alt=""/>DETAILS TO CAPTURE</p>
    <p className="signal copy"><img src="/brand/signature-signal.svg" width="5" height="5" alt=""/>REPLY TO WRITE</p>
    <p className="signal chase"><img src="/brand/signature-signal.svg" width="5" height="5" alt=""/>YOU REVIEW &amp; SEND</p>
   </div>
   <div className="lv-signature-labels connected" aria-hidden={!connected}>
    <p className="signal input"><img src="/brand/signature-signal.svg" width="5" height="5" alt=""/>“CAN YOU HELP WITH A BOOKING?”</p>
    <p className="signal filed"><img src="/brand/signature-signal.svg" width="5" height="5" alt=""/>01 &nbsp; DETAILS FILED</p>
    <p className="signal drafted"><img src="/brand/signature-signal.svg" width="5" height="5" alt=""/>02 &nbsp; REPLY DRAFTED</p>
    <div className="lv-signature-review"><img className="review-disc" src="/brand/signature-review-disc.svg" width="116" height="116" alt=""/><span className="lv-signature-review-label mobile-copy">HUMAN APPROVAL</span><strong><span className="desktop-copy">YOU<br/>REVIEW</span><span className="mobile-copy">YOU REVIEW &amp; SEND</span></strong><img className="review-gesture" src="/brand/signature-review-gesture.svg" width="126" height="36" alt=""/><p>Nothing sends<br className="desktop-copy"/> until you say so.</p></div>
   </div>
   </div>
  </div>
  {connected && <section className="lv-signature-result-preview" aria-labelledby="signature-result-title">
   <p id="signature-result-title" className="lv-signature-preview-label">SYNTHETIC EXAMPLE · PREVIEW ONLY</p>
   <div className="lv-signature-preview-grid"><div><h3>Captured details</h3><p>Help arranging a booking.</p><p><span>Still needed:</span> preferred date, time and service.</p></div><div><h3>Draft reply — awaiting your review</h3><p>“Which service do you need, and what date and time would suit you? We’ll check availability before confirming anything.”</p></div></div>
   <p className="lv-signature-preview-boundary">No booking, quote or message is sent here.</p>
  </section>}
  <details className="lv-signature-output"><summary>See the illustrative details and draft</summary><div><div><h3>Captured details</h3><dl><dt>Request</dt><dd>Help arranging a booking</dd><dt>Still needed</dt><dd>Preferred date, time and service</dd><dt>Next step</dt><dd>A person checks and replies</dd></dl></div><div><h3>Draft reply — for review</h3><p>“Thanks for getting in touch. Which service do you need, and what date and time would suit you? We’ll check availability before confirming anything.”</p><p className="lv-signature-boundary">A synthetic example, not a working integration. No booking, quote or message is sent here. Tools, fields, wording and approval rules are agreed before building.</p></div></div></details>
  <p className="lv-signature-disclosure">ILLUSTRATIVE WORKFLOW <span aria-hidden="true">· </span><span>NOT LIVE CUSTOMER DATA</span></p>
 </section>
}

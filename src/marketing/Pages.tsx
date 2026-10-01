import { WorkExample } from './WorkExample'
import { GUIDANCE } from '../domain/guidance'
import '../styles/reimagination.css'

export function StartLink({ secondary = false }: { secondary?: boolean }) {
 return <a className={`lv-button${secondary ? ' secondary' : ''}`} href="/start">Explore a task</a>
}
function ContactLink() { return <a className="lv-button lv-r2-contact-link" href="/contact">Tell us what you need<img src="/brand/work-arrow.svg" alt="" width="22" height="22"/></a> }
function Closing() {
 return <section className="lv-r2-container lv-r2-invitation"><h2>Have a task in mind?</h2><ContactLink/></section>
}
const STEPS = [
 ['Tell us what happens today.', 'Describe the task and tools you use. You do not need to choose new software first.'],
 ['Check what would help.', 'We review what could change, what your tools support and what stays with a person.'],
 ['Agree the work before building.', 'Scope, price, access, handover and support are agreed before work starts.'],
]
const BUYING_QUESTIONS = [
 ['What does it cost?', 'We agree the scope and price before work starts. Additional software costs are discussed as part of that scope.'],
 ['Can you work with my existing tools?', 'Tell us what you use today. We check compatibility and access before recommending a change.'],
 ['What happens after I get in touch?', 'We review your request and reply by email. If you prefer a call, we arrange a time together.'],
 ['Who handles changes and support?', 'We agree handover, support and responsibility for changes before building.'],
]
export function Home() { return <div className="lv-round2-home lv-work-home">
 <section className="lv-r2-container lv-r2-hero" aria-labelledby="home-title">
  <div className="lv-r2-offer"><p className="lv-eyebrow">AUTOMATION FOR SMALL BUSINESSES</p><h1 id="home-title">Less repeat.<br/>More room.</h1><p className="lv-r2-intro">Spend less time on repeat admin.<br/>Make space for the work that needs you.</p><p className="lv-work-description">Levarum connects the tools and steps behind your everyday work. Start with one task. We’ll agree what to build before work starts.</p><ContactLink/><a className="lv-r2-examples-link" href="#examples">Explore a few possibilities ↓</a></div>
  <figure className="lv-work-figure"><div className="lv-work-diagram"><p className="lv-work-label">ILLUSTRATIVE WORKFLOW</p><img className="lv-work-ribbon" src="/brand/work-ribbon.svg" alt="" width="622" height="530"/><ol>{[
   ['An enquiry arrives', '“Can you help with this?”'], ['The routine moves', 'Details go to the right place.'], ['You take it from here', 'A person in control.'],
  ].map(([label, text], index) => <li key={label}><span className="lv-work-label">0{index + 1} · {label}</span><strong>{text}</strong></li>)}</ol></div><figcaption>A possible enquiry handoff, illustrated. Every workflow starts with your tools and your process.</figcaption></figure>
 </section>
 <div className="lv-work-commitments"><div className="lv-r2-container"><p>Your tools, connected.</p><p>The routine, simplified.</p><p>People, in control.</p></div></div>
 <WorkExample/>
 <section className="lv-r2-container lv-r2-how" id="how-we-work" aria-labelledby="how-title"><div><p className="lv-eyebrow">START WITH ONE TASK</p><h2 id="how-title">Start small.<br/>Make room.</h2><p className="lv-work-description">You don’t need to choose new software first. Tell us where the work gets stuck.</p></div><ol>{STEPS.map(([title,body],i)=><li key={title}><span className="lv-r2-number" aria-hidden="true">0{i+1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol></section>
 <section className="lv-r2-questions" id="questions" aria-labelledby="questions-title"><div className="lv-r2-container"><h2 id="questions-title">Good <br/>questions.</h2><div className="lv-r2-answers">{BUYING_QUESTIONS.map(([question,answer],index)=><details key={question} open={index===0}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
 <section className="lv-work-invitation"><div className="lv-r2-container lv-r2-invitation"><h2>Make the everyday<br/>a little easier.</h2><ContactLink/></div></section>
 </div> }
export function How() { return <><section className="lv-container lv-page-intro"><p className="lv-eyebrow">HOW IT WORKS</p><h1>One useful improvement.<br/>Clearly agreed.</h1><p className="lv-lead">You do not need to choose the software first. Begin with the work you want to make easier.</p></section><section className="lv-container lv-process">{[
 ['Explore a task—or come straight to us','Browse practical ideas without an account, email or questionnaire. If you already know what you need, use Tell us what you need to get in touch directly.'],
 ['Talk through what happens today','Describe the task, the tools involved and where a person needs to make a decision. We review what could change and what needs to be checked.'],
 ['Agree the work before building','Confirm the scope, price, timeline, access, handover and support. Any additional tools or subscriptions are discussed before you commit.'],
 ['Keep ownership clear','Agree who reviews exceptions, how failures are reported and what support is included. A workflow needs a clear owner as well as a working connection.'],
 ].map(([title, body], i) => <article key={title}><span className="lv-job-number">0{i + 1}</span><div><h2>{title}</h2><p>{body}</p></div></article>)}<div className="lv-note"><h2>Prefer a short call?</h2><p>Request a call through the contact form. We agree a time by email; submitting a request does not book an appointment.</p><a href="/contact">Tell us what you need</a></div></section><Closing/></> }
export function Automations() { return <><section className="lv-container lv-page-intro"><p className="lv-eyebrow">WHAT WE AUTOMATE</p><h1>Practical ideas for<br/>the work you repeat.</h1><p className="lv-lead">Examples to explore, not ready-made promises. What fits depends on your tools, workload and the decisions that need a person.</p></section><section className="lv-container lv-examples">{Object.entries(GUIDANCE).map(([id, g]) => <article id={id} className="lv-example" key={id}><div><p className="lv-eyebrow">{g.task.toUpperCase()}</p><h2>{g.title}.</h2><a className="lv-text-link" href={`/start?task=${id}`}>Explore this task →</a></div><div><h3>What could change</h3><p>{g.change}</p><h3>Check before building</h3><p>{g.check}</p><h3>Keep a person involved</h3><p>{g.control}</p></div></article>)}</section><Closing/></> }
const FAQS = [
 ['What does it cost?', 'The on-screen ideas are free to explore. Implementation is scoped and priced separately before work begins. Additional tools or subscriptions are discussed as part of that scope.'],
 ['Do I have to complete a questionnaire?', 'No. Choose a task to explore an idea, or go directly to Tell us what you need. You only share contact details when you want a reply.'],
 ['What happens when I request contact?', 'Your request is saved privately for review. Levarum follows up by email. If you ask for a call, we agree a time together; submitting does not book an appointment.'],
 ['Will this work with my existing tools?', 'We review what you already use before recommending a change. Compatibility, access requirements and any additional subscriptions must be checked before a build.'],
 ['Do I need technical knowledge?', 'No. The first conversation is about your process, the people involved and what would make the work easier. You do not need to know which software to choose.'],
 ['Will I stay in control?', 'Approvals, exceptions and access are agreed before implementation. Some decisions should stay with a person. Account ownership and handover are included in the scope.'],
 ['What about support?', 'Support, monitoring and responsibility for changes are agreed before work starts. The right arrangement depends on what is built.'],
 ['What happens to my information?', 'You can explore ideas without submitting personal information. If you request contact, we store the information you submit privately to handle that request. Submitting does not subscribe you to a marketing list.'],
 ['Will you email the ideas automatically?', 'No. You can print or save the guidance from the explorer. If you request follow-up, Levarum reviews your request and responds by email.'],
]
export function Questions() { return <><section className="lv-container lv-page-intro"><p className="lv-eyebrow">QUESTIONS</p><h1>A little clarity<br/>before you start.</h1><p className="lv-lead">Cost, tools, privacy and what happens next.</p></section><section className="lv-container lv-faqs">{FAQS.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}{question === 'What happens to my information?' && <> <a href="/privacy">Read the privacy notice.</a></>}</p></details>)}<div className="lv-note"><h2>Something else on your mind?</h2><p>Email <a href="mailto:hello@levarum.com">hello@levarum.com</a> or <a href="/contact">discuss your work</a>. You can contact us without using the explorer.</p></div></section><Closing/></> }

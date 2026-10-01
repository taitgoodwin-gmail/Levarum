import { useState } from 'react'
import { GUIDANCE } from '../domain/guidance'
import '../styles/reimagination.css'

export function StartLink({ secondary = false }: { secondary?: boolean }) {
 return <a className={`lv-button${secondary ? ' secondary' : ''}`} href="/start">Explore a task</a>
}
function ContactLink() { return <a className="lv-button secondary" href="/contact">Discuss your work</a> }
function Closing() {
 return <section className="lv-editorial-close"><div className="lv-container"><div><p className="lv-eyebrow">ONE USEFUL CHANGE</p><h2>Start with the work.<br/>Decide on the tools together.</h2><p>Explore an idea, or tell us what you already have in mind.</p></div><div className="lv-actions"><StartLink/><ContactLink/></div></div></section>
}
const SCENARIOS = {
 routine: { label: 'Routine invoice', check: 'Payment status is current. No dispute or exception is recorded.', outcome: 'Use the approved reminder', detail: 'The workflow could send the wording you approved at the agreed time.', boundary: 'You choose the timing, wording and exclusions before this workflow runs.' },
 disputed: { label: 'Disputed invoice', check: 'The invoice has been flagged as disputed. The routine reminder is paused.', outcome: 'Ask a person to review', detail: 'The account owner handles the dispute before any further reminder is sent.', boundary: 'A payment dispute needs human judgment. The workflow should not decide who is right.' },
 'missing-data': { label: 'Missing payment data', check: 'The current payment status cannot be confirmed. It is unsafe to assume the invoice is unpaid.', outcome: 'Pause and flag the missing data', detail: 'A person checks the source record before deciding what happens next.', boundary: 'Missing information must stay visible. It should not become an automatic payment demand.' },
} as const
type Scenario = keyof typeof SCENARIOS
function WorkedExample() {
 const [scenario, setScenario] = useState<Scenario>('routine')
 const selected = SCENARIOS[scenario]
 return <section className="lv-worked-example" aria-labelledby="invoice-example-title"><div className="lv-container">
  <div className="lv-example-heading"><div><p className="lv-eyebrow">AN EXAMPLE, NOT A PROMISE</p><h2 id="invoice-example-title">Invoice follow-up,<br/>with judgment built in.</h2></div><p>Routine work can follow clear rules. Exceptions should still reach a person.</p></div>
  <fieldset className="lv-scenarios"><legend>Try a different situation</legend><div>{(Object.entries(SCENARIOS) as [Scenario, typeof SCENARIOS[Scenario]][]).map(([value, item]) => <label key={value}><input type="radio" name="invoice-scenario" checked={scenario === value} onChange={() => setScenario(value)} aria-controls="invoice-example-result"/>{item.label}</label>)}</div></fieldset>
  <ol className="lv-example-flow"><li><p className="lv-eyebrow">01 / TRIGGER</p><h3>An invoice looks overdue</h3><p>Check the payment record before taking the next step.</p></li><li><p className="lv-eyebrow">02 / CHECK</p><h3>{scenario === 'routine' ? 'The rules are satisfied' : 'An exception needs attention'}</h3><p>{selected.check}</p></li><li className={scenario === 'routine' ? 'lv-outcome-routine' : 'lv-outcome-review'}><p className="lv-eyebrow">03 / NEXT ACTION</p><div id="invoice-example-result" role="status" aria-live="polite" aria-atomic="true"><h3>{selected.outcome}</h3><p>{selected.detail}</p></div></li></ol>
  <div className="lv-human-boundary"><strong>Where you stay in control</strong><p>{selected.boundary}</p></div>
  <p className="lv-example-caption">Illustration only. This demo sends no reminders and uses no customer data. Tools, timing, access and approval rules are agreed before a build.</p>
 </div></section>
}
export function Home() { return <>
 <section className="lv-container lv-editorial-hero"><div><p className="lv-eyebrow">FOR OWNER-RUN BUSINESSES</p><h1>Make room for<br/>the work that<br/><span>needs you.</span></h1><p className="lv-lead">Practical automation for the work you repeat. Levarum helps connect routine tasks while keeping the decisions that matter with you.</p><div className="lv-actions"><StartLink/><ContactLink/></div><p className="lv-small lv-muted">No account or email needed to explore.</p></div><aside className="lv-editorial-aside"><span aria-hidden="true" className="lv-aside-line"/><h2>Less chasing.<br/>Less copying.<br/><span>More control.</span></h2><p>Start with one recurring task. Understand the change before committing to a build.</p></aside></section>
 <WorkedExample/>
 <section className="lv-container lv-task-index"><div className="lv-index-intro"><p className="lv-eyebrow">FIND A STARTING POINT</p><h2>What keeps repeating?</h2><p>Choose a task to see what could change, what to check and where a person stays involved.</p></div><div className="lv-task-rows">{Object.entries(GUIDANCE).map(([id, guidance]) => <a href={`/start?task=${id}`} key={id}><div><h3>{guidance.task}</h3><p>{guidance.change}</p></div><span aria-hidden="true">↗</span></a>)}</div></section>
 <section className="lv-engagement"><div className="lv-container"><p className="lv-eyebrow">HOW WE WORK</p><h2>A clear scope<br/>before a build.</h2><div><p>Discuss the task. Check what is feasible. Agree the scope, price, access and handover before work begins.</p><a className="lv-text-link" href="/how-it-works">See how it works →</a></div></div></section>
 </> }
export function How() { return <><section className="lv-container lv-page-intro"><p className="lv-eyebrow">HOW IT WORKS</p><h1>One useful improvement.<br/>Clearly agreed.</h1><p className="lv-lead">You do not need to choose the software first. Begin with the work you want to make easier.</p></section><section className="lv-container lv-process">{[
 ['Explore a task—or come straight to us','Browse practical ideas without an account, email or questionnaire. If you already know what you need, use Discuss your work to get in touch directly.'],
 ['Talk through what happens today','Describe the task, the tools involved and where a person needs to make a decision. We review what could change and what needs to be checked.'],
 ['Agree the work before building','Confirm the scope, price, timeline, access, handover and support. Any additional tools or subscriptions are discussed before you commit.'],
 ['Keep ownership clear','Agree who reviews exceptions, how failures are reported and what support is included. A workflow needs a clear owner as well as a working connection.'],
 ].map(([title, body], i) => <article key={title}><span className="lv-job-number">0{i + 1}</span><div><h2>{title}</h2><p>{body}</p></div></article>)}<div className="lv-note"><h2>Prefer a short call?</h2><p>Request a 15-minute call through the contact form. We agree a time by email; submitting a request does not book an appointment.</p><a href="/contact">Discuss your work</a></div></section><Closing/></> }
export function Automations() { return <><section className="lv-container lv-page-intro"><p className="lv-eyebrow">WHAT WE AUTOMATE</p><h1>Practical ideas for<br/>the work you repeat.</h1><p className="lv-lead">Examples to explore, not ready-made promises. What fits depends on your tools, workload and the decisions that need a person.</p></section><section className="lv-container lv-examples">{Object.entries(GUIDANCE).map(([id, g]) => <article id={id} className="lv-example" key={id}><div><p className="lv-eyebrow">{g.task.toUpperCase()}</p><h2>{g.title}.</h2><a className="lv-text-link" href={`/start?task=${id}`}>Explore this task →</a></div><div><h3>What could change</h3><p>{g.change}</p><h3>Check before building</h3><p>{g.check}</p><h3>Keep a person involved</h3><p>{g.control}</p></div></article>)}</section><Closing/></> }
const FAQS = [
 ['What does it cost?', 'The on-screen ideas are free to explore. Implementation is scoped and priced separately before work begins. Additional tools or subscriptions are discussed as part of that scope.'],
 ['Do I have to complete a questionnaire?', 'No. Choose a task to explore an idea, or go directly to Discuss your work. You only share contact details when you want a reply.'],
 ['What happens when I request contact?', 'Your request is saved privately for review. Levarum follows up by email. If you ask for a call, we agree a time together; submitting does not book an appointment.'],
 ['Will this work with my existing tools?', 'We review what you already use before recommending a change. Compatibility, access requirements and any additional subscriptions must be checked before a build.'],
 ['Do I need technical knowledge?', 'No. The first conversation is about your process, the people involved and what would make the work easier. You do not need to know which software to choose.'],
 ['Will I stay in control?', 'Approvals, exceptions and access are agreed before implementation. Some decisions should stay with a person. Account ownership and handover are included in the scope.'],
 ['What about support?', 'Support, monitoring and responsibility for changes are agreed before work starts. The right arrangement depends on what is built.'],
 ['What happens to my information?', 'You can explore ideas without submitting personal information. If you request contact, we store the information you submit privately to handle that request. Submitting does not subscribe you to a marketing list.'],
 ['Will you email the ideas automatically?', 'No. You can print or save the guidance from the explorer. If you request follow-up, Levarum reviews your request and responds by email.'],
]
export function Questions() { return <><section className="lv-container lv-page-intro"><p className="lv-eyebrow">QUESTIONS</p><h1>A little clarity<br/>before you start.</h1><p className="lv-lead">Cost, tools, privacy and what happens next.</p></section><section className="lv-container lv-faqs">{FAQS.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}{question === 'What happens to my information?' && <> <a href="/privacy">Read the privacy notice.</a></>}</p></details>)}<div className="lv-note"><h2>Something else on your mind?</h2><p>Email <a href="mailto:hello@levarum.com">hello@levarum.com</a> or <a href="/contact">discuss your work</a>. You can contact us without using the explorer.</p></div></section><Closing/></> }

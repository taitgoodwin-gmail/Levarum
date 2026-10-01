import './explorer.css'
import {useEffect,useRef,useState} from 'react'
import {GUIDANCE} from '../domain/guidance'
import {ContactRequest,type TaskId} from './ContactRequest'
const tasks=Object.keys(GUIDANCE) as TaskId[]
export function IntakeFlow(){
 const initial=new URLSearchParams(location.search).get('task')
 const [selected,setSelected]=useState<TaskId|null>(tasks.includes(initial as TaskId)?initial as TaskId:null)
 const [contact,setContact]=useState(false);const heading=useRef<HTMLHeadingElement>(null)
 useEffect(()=>{if(!contact)heading.current?.focus()},[contact])
 const guidance=selected?GUIDANCE[selected]:null
 return <>
 <div className="lv-explorer lv-container" hidden={contact}>
  <p className="lv-eyebrow">EXPLORE A PRACTICAL STARTING POINT</p><h1 ref={heading} tabIndex={-1}>Which task would you<br/>like to stop repeating?</h1>
  <p className="lv-lead">Choose a task to see an idea and what to check. No account, email or questionnaire.</p>
  <div className="lv-explorer-grid"><div className="lv-task-picker" role="group" aria-label="Choose a recurring task">{tasks.map(id=><button className="lv-task-option" key={id} aria-pressed={selected===id} aria-controls="task-guidance" onClick={()=>setSelected(id)}>{GUIDANCE[id].task}<span aria-hidden="true">↗</span></button>)}<a className="lv-text-link" href="/contact">My task isn’t listed →</a></div>
  <div id="task-guidance" className="lv-explorer-detail" aria-live="polite" aria-atomic="true">{guidance?<><p className="lv-eyebrow">{guidance.task}</p><h2>{guidance.title}.</h2><p className="lv-lead">{guidance.change}</p><h3>Check before building</h3><p>{guidance.check}</p><div className="lv-human-boundary"><h3>What stays human</h3><p>{guidance.control}</p></div><p className="lv-small lv-muted">An idea to investigate together—not a completed assessment or a savings promise.</p><div className="lv-actions"><button className="lv-button" onClick={()=>setContact(true)}>Discuss this task</button><button className="lv-button secondary" onClick={()=>window.print()}>Print or save idea</button></div></>:<><p className="lv-eyebrow">START WITH THE WORK</p><h2>One task. A clearer next step.</h2><p>Select a task to see what could change, what to check and where a person should stay involved.</p><p className="lv-small lv-muted">Nothing is submitted while you explore.</p></>}</div></div>
 </div>
 <ContactRequest tasks={selected?[selected]:[]} visible={contact} onBack={()=>setContact(false)}/>
 </>
}

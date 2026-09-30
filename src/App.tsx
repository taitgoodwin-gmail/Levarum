import { useEffect } from 'react'
import { Shell } from './marketing/Shell'
import { Home, How, Automations, Questions } from './marketing/Pages'
import { Partners } from './marketing/Partners'
import { ContactRequest } from './prospect/ContactRequest'
import { IntakeFlow } from './prospect/IntakeFlow'
import { Privacy } from './prospect/Privacy'
const descriptions:Record<string,string>={
 '/':'Practical automation for owner-run businesses. Explore ways to simplify repetitive work before sharing your contact details.',
 '/how-it-works':'See how Levarum reviews a repeated task, agrees what to build and keeps important decisions with a person.',
 '/what-we-automate':'Explore practical ideas for customer questions, invoices, moving information, bookings and new enquiries, with clear human-review boundaries.',
 '/questions':'Answers about working with Levarum, exploring automation ideas and arranging follow-up by email.',
 '/partners':'Express interest in working with Levarum on practical automation. Introduce your work and the contribution you could make.',
 '/start':'Choose a repeated task and see useful starting points immediately. No contact details are needed to explore.',
 '/contact':'Describe the work you want to simplify and request email follow-up or a call. Calls are arranged by email, not booked here.',
 '/privacy':'Learn what Levarum collects when you request follow-up or express partner interest, and how to contact us about your information.',
}
export function App(){
 const path=location.pathname.replace(/\/$/,'')||'/'
 const legacy:Record<string,string>={'#home':'/','#how':'/how-it-works','#what':'/what-we-automate','#questions':'/questions','#partners':'/partners'}
 if(path==='/'&&legacy[location.hash])location.replace(legacy[location.hash])
 const pages:Record<string,{title:string,node:React.ReactNode}>={
 '/':{title:'Practical automation for small businesses',node:<Home/>},'/how-it-works':{title:'How it works',node:<How/>},'/what-we-automate':{title:'What we automate',node:<Automations/>},'/questions':{title:'Questions',node:<Questions/>},'/partners':{title:'Partners',node:<Partners/>},'/start':{title:'Explore a task',node:<IntakeFlow/>},'/contact':{title:'Discuss your work',node:<ContactRequest/>},'/privacy':{title:'Privacy',node:<Privacy/>}}
 const page=pages[path]
 const title=`${page?.title||'Page not found'} · Levarum`
 const description=descriptions[path]||'This page is not available. Return to Levarum to explore practical automation ideas.'
 const knownPage=Boolean(page)
 useEffect(()=>{
  document.title=title
  const meta=document.querySelector<HTMLMetaElement>('meta[name="description"]')||document.head.appendChild(document.createElement('meta'))
  meta.name='description';meta.content=description
  let canonical=document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if(knownPage){
   canonical??=document.head.appendChild(document.createElement('link'))
   canonical.rel='canonical';canonical.href=`https://levarum.com${path}`
  }else canonical?.remove()
  const robots=document.querySelector<HTMLMetaElement>('meta[data-page-robots]')
  if(knownPage)robots?.remove()
  else{
   const noindex=robots||document.head.appendChild(document.createElement('meta'))
   noindex.name='robots';noindex.content='noindex';noindex.dataset.pageRobots='true'
  }
 },[path,title,description,knownPage])
 return <Shell>{page?.node||<div className="lv-form-page"><h1>Page not available.</h1><a href="/">Back to Levarum</a></div>}</Shell>
}

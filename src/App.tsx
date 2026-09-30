import { Shell } from './marketing/Shell'
import { Home, How, Automations, Questions } from './marketing/Pages'
import { Partners } from './marketing/Partners'
import { IntakeFlow } from './prospect/IntakeFlow'
import { Privacy } from './prospect/Privacy'
export function App(){
 const path=location.pathname.replace(/\/$/,'')||'/'
 const legacy:Record<string,string>={'#home':'/','#how':'/how-it-works','#what':'/what-we-automate','#questions':'/questions','#partners':'/partners'}
 if(path==='/'&&legacy[location.hash])location.replace(legacy[location.hash])
 const pages:Record<string,{title:string,node:React.ReactNode}>={
 '/':{title:'Practical automation for small businesses',node:<Home/>},'/how-it-works':{title:'How it works',node:<How/>},'/what-we-automate':{title:'What we automate',node:<Automations/>},'/questions':{title:'Questions',node:<Questions/>},'/partners':{title:'Partners',node:<Partners/>},'/start':{title:'Find your starting point',node:<IntakeFlow/>},'/privacy':{title:'Privacy',node:<Privacy/>}}
 const page=pages[path];document.title=`${page?.title||'Page not found'} · Levarum`
 return <Shell>{page?.node||<div className="lv-form-page"><h1>Page not available.</h1><a href="/">Back to Levarum</a></div>}</Shell>
}

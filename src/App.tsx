import { Shell } from './marketing/Shell'
import { HomeScreen } from './marketing/HomeScreen'
import { HowItWorksScreen } from './marketing/HowItWorksScreen'
import { WhatWeAutomateScreen } from './marketing/WhatWeAutomateScreen'
import { QuestionsScreen } from './marketing/QuestionsScreen'
import { Partners } from './marketing/Partners'
import { IntakeFlow } from './prospect/IntakeFlow'
import { Privacy } from './prospect/Privacy'
export function App(){
 const path=location.pathname.replace(/\/$/,'')||'/'
 const legacy:Record<string,string>={'#home':'/','#how':'/how-it-works','#what':'/what-we-automate','#questions':'/questions','#partners':'/partners'}
 if(path==='/'&&legacy[location.hash])location.replace(legacy[location.hash])
 const pages:Record<string,{title:string,node:React.ReactNode}>={
 '/':{title:'Get your week back',node:<HomeScreen/>},'/how-it-works':{title:'How it works',node:<HowItWorksScreen/>},'/what-we-automate':{title:'What we automate',node:<WhatWeAutomateScreen/>},'/questions':{title:'Questions',node:<QuestionsScreen/>},'/partners':{title:'Partners',node:<Partners/>},'/start':{title:'Your Game Plan',node:<IntakeFlow/>},'/privacy':{title:'Privacy',node:<Privacy/>}}
 const page=pages[path];document.title=`${page?.title||'Page not found'} · Levarum`
 return <Shell>{page?.node||<div className="lv-form-page"><h1>Page not available.</h1><a href="/">Back to Levarum</a></div>}</Shell>
}

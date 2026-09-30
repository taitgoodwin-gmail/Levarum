import type { ReactNode } from 'react'
import { NavBar, Footer, SkipLink } from '../ui'
const links = [{label:'How it works',href:'/how-it-works'},{label:'What we automate',href:'/what-we-automate'},{label:'Questions',href:'/questions'}]
export function Shell({children}: {children:ReactNode}) {
 return <><SkipLink href="#lv-main" /><NavBar links={links} current={links.find(l=>l.href===location.pathname)?.label} cta={{label:'Start',href:'/start'}} /><main id="lv-main" tabIndex={-1}>{children}</main><Footer tagline="Back-office automation for owner-run businesses." links={[...links,{label:'Partners',href:'/partners'},{label:'hello@levarum.com',href:'mailto:hello@levarum.com'},{label:'Privacy',href:'/privacy'}]} /></>
}

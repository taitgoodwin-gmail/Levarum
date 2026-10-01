import { SignatureBrand } from './SignatureOpening'
import { useState, type ReactNode } from 'react'
import { Logo } from '../ui/core/Logo.jsx'
import { ThemeToggle } from '../ui/navigation/ThemeToggle.jsx'
import { SkipLink } from '../ui/navigation/SkipLink.jsx'
import '../styles/round2.css'
import '../styles/work-in-motion.css'

export function Shell({ children }: { children: ReactNode }) {
 const [theme, setTheme] = useState<'light' | 'dark'>(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
 const homePage = location.pathname === '/'
 const contactPage = location.pathname.replace(/\/$/, '') === '/contact'
 function toggle(next: 'light' | 'dark') {
  setTheme(next)
  document.documentElement.dataset.theme = next
  try { localStorage.setItem('levarum.theme.v1', next) } catch { /* Theme works without persistence. */ }
 }
 return <div className={`lv-round2-shell${homePage ? ' lv-signature-shell' : ''}`}>
  <SkipLink href="#lv-main"/>
  <header className="lv-r2-header lv-r2-container">
   {homePage ? <SignatureBrand/> : <Logo href="/" shape="joined"/>}
   <nav aria-label="Primary"><a href={contactPage ? '/' : '/contact'}>{contactPage ? 'Back to Home' : homePage ? <><span className="desktop-copy">Start with one task</span><span className="mobile-copy">Let’s talk</span><span className="lv-signature-arrow" aria-hidden="true"/></> : 'Tell us what you need'}</a></nav>
   {homePage && <picture className="lv-signature-rule"><source media="(max-width: 1199px)" srcSet="/brand/signature-header-mobile.svg"/><img src="/brand/signature-header-desktop.svg" width="1312" height="1" alt=""/></picture>}
  </header>
  <main id="lv-main" tabIndex={-1}>{children}</main>
  <footer className="lv-r2-footer lv-r2-container">
   <Logo href="/" shape="joined"/>
   <a className="lv-r2-email" href="mailto:hello@levarum.com">hello@levarum.com</a>
   <nav aria-label="Footer"><a href="/partners">Partners</a><a href="/privacy">Privacy</a><ThemeToggle theme={theme} onToggle={toggle}/></nav>
  </footer>
 </div>
}

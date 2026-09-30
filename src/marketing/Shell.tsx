import { useRef, useState, type ReactNode } from 'react'
import { Logo } from '../ui/core/Logo.jsx'
import { ThemeToggle } from '../ui/navigation/ThemeToggle.jsx'
import { SkipLink } from '../ui/navigation/SkipLink.jsx'

const links = [
 { label: 'What we automate', href: '/what-we-automate' },
 { label: 'How it works', href: '/how-it-works' },
 { label: 'Questions', href: '/questions' },
]
export function Shell({ children }: { children: ReactNode }) {
 const menu = useRef<HTMLDetailsElement>(null)
 const [theme, setTheme] = useState<'light' | 'dark'>(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
 function toggle(next: 'light' | 'dark') {
  setTheme(next)
  document.documentElement.dataset.theme = next
  try { localStorage.setItem('levarum.theme.v1', next) } catch { /* Theme works without persistence. */ }
 }
 function navigation() {
  return <>{links.map(link => <a key={link.href} href={link.href} aria-current={location.pathname === link.href ? 'page' : undefined}>{link.label}</a>)}<ThemeToggle theme={theme} onToggle={toggle}/><a className="lv-button" href="/contact">Discuss your work</a></>
 }
 return <>
  <SkipLink href="#lv-main"/>
  <header className="lv-site-header"><div className="lv-container lv-header-row">
   <Logo href="/" size={30}/>
   <nav className="lv-desktop-nav" aria-label="Primary">{navigation()}</nav>
   <details className="lv-mobile-menu" ref={menu} onKeyDown={event => {
    if (event.key === 'Escape' && menu.current?.open) {
     menu.current.open = false
     menu.current.querySelector('summary')?.focus()
     event.preventDefault()
    }
   }}>
    <summary>Menu <span aria-hidden="true">☰</span></summary>
    <nav aria-label="Mobile primary">{navigation()}</nav>
   </details>
  </div></header>
  <main id="lv-main" tabIndex={-1}>{children}</main>
  <footer className="lv-site-footer"><div className="lv-container">
   <div><Logo href="/" size={26}/><p>Practical automation.<br/>One useful change at a time.</p></div>
   <nav aria-label="Footer">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}<a href="/partners">Partners</a><a href="/privacy">Privacy</a><a href="mailto:hello@levarum.com">hello@levarum.com</a></nav>
   <p className="lv-small lv-muted">Calls are arranged by email. A request is not a confirmed booking.</p>
  </div></footer>
 </>
}

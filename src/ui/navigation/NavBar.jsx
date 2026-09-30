import React from 'react';
import { Logo } from '../core/Logo.jsx';
import { Button } from '../core/Button.jsx';
import { ThemeToggle } from './ThemeToggle.jsx';

function NavLink({ href, current, children }) {
  const [hover, setHover] = React.useState(false);
  if (current) {
    return (
      <a href={href} aria-current="page" style={{
        fontSize: 'var(--lv-t-sm)',
        color: 'var(--lv-ink)',
        fontWeight: 600,
        textDecoration: 'none',
        borderBottom: '2px solid var(--lv-accent)',
        paddingBottom: 'var(--lv-s-1)',
      }}>{children}</a>
    );
  }
  return (
    <a href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: 'var(--lv-t-sm)',
        color: hover ? 'var(--lv-sec)' : 'var(--lv-ink-quiet)',
        textDecoration: 'none',
        transition: 'color var(--lv-dur-1) ease',
      }}>{children}</a>
  );
}

export function NavBar({
  links = [],
  current,
  cta,
  badge,
  theme = true,
  right,
  style,
  ...rest
}) {
  return (
    <header style={{
      borderBottom: 'var(--lv-bw) solid var(--lv-line)',
      background: 'var(--lv-page)',
      animation: 'lvFade var(--lv-dur-2) ease-out both',
      ...style,
    }} {...rest}>
      <nav aria-label="Primary" style={{
        maxWidth: 'var(--lv-w-page)',
        margin: '0 auto',
        padding: 'var(--lv-s-5) var(--lv-s-7)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--lv-s-6)',
        flexWrap: 'wrap',
      }}>
        <Logo href={links.length ? '/' : '#'} size={30} />
        {badge}
        <div style={{ display: 'flex', gap: 'var(--lv-s-6)', marginLeft: 'auto', alignItems: 'center', flexWrap: 'wrap' }}>
          {links.map((l) => (
            <NavLink key={l.label} href={l.href} current={l.label === current}>{l.label}</NavLink>
          ))}
          {theme ? <ThemeToggle /> : null}
          {right}
          {cta ? <Button href={cta.href} size="sm">{cta.label}</Button> : null}
        </div>
      </nav>
    </header>
  );
}

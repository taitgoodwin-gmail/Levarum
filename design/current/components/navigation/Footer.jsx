import React from 'react';
import { Logo } from '../core/Logo.jsx';

export function Footer({ tagline, links = [], banner, style, ...rest }) {
  return (
    <footer style={{ background: 'var(--lv-rung-3)', borderTop: 'var(--lv-bw) solid var(--lv-line)', ...style }} {...rest}>
      {banner ? (
        <div style={{ maxWidth: 'var(--lv-w-page)', margin: '0 auto', padding: 'var(--lv-g-2) var(--lv-s-7) 0' }}>{banner}</div>
      ) : null}
      <div style={{ maxWidth: 'var(--lv-w-page)', margin: '0 auto', padding: 'var(--lv-s-8) var(--lv-s-7) var(--lv-s-9)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lv-s-6)', flexWrap: 'wrap' }}>
          <Logo as="div" size={26} animate={false} style={{ gap: 'var(--lv-s-3)' }} />
          {tagline ? <span style={{ fontSize: 'var(--lv-t-xs)', color: 'var(--lv-ink-quiet)' }}>{tagline}</span> : null}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--lv-s-6)', alignItems: 'center', flexWrap: 'wrap' }}>
            {links.map((l) => <FooterLink key={l.label} {...l} />)}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: 'var(--lv-t-xs)',
        color: hover ? 'var(--lv-sec)' : 'var(--lv-ink-quiet)',
        textDecoration: 'none',
        transition: 'color var(--lv-dur-1) ease',
      }}>{label}</a>
  );
}

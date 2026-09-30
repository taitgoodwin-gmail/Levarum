import React from 'react';

export function Accordion({ items = [], defaultOpen = 0, style, ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-3)', ...style }} {...rest}>
      {items.map((it, i) => {
        const isOpen = open === i;
        const toggle = () => setOpen(isOpen ? -1 : i);
        return (
          <div key={i} style={{
            border: (isOpen ? 'var(--lv-bw-strong) solid var(--lv-sec)' : 'var(--lv-bw) solid var(--lv-line)'),
            borderRadius: 'var(--lv-r-card)',
            background: isOpen ? 'var(--lv-surface)' : 'transparent',
            boxShadow: isOpen ? 'var(--lv-shadow-sm)' : 'none',
            transition: 'border-color var(--lv-dur-1) ease, box-shadow var(--lv-dur-1) ease',
          }}>
            <div
              role="button"
              tabIndex={0}
              aria-expanded={isOpen ? 'true' : 'false'}
              onClick={toggle}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); toggle(); } }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--lv-s-5)', cursor: 'pointer', padding: 'var(--lv-g-1)', minHeight: 'var(--lv-tap-min)' }}
            >
              <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--lv-f-display)', fontWeight: 600, fontSize: 'var(--lv-d-6)', letterSpacing: 'var(--lv-track-tight)', lineHeight: 1.3 }}>{it.q}</span>
              <span aria-hidden="true" style={{
                width: '32px', height: '32px', flex: 'none', borderRadius: 'var(--lv-r-round)',
                border: 'var(--lv-bw-strong) solid ' + (isOpen ? 'var(--lv-sec)' : 'var(--lv-line-control)'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--lv-f-display)', fontWeight: 600, fontSize: 'var(--lv-t-lg)',
                color: isOpen ? 'var(--lv-sec)' : 'var(--lv-ink-quiet)', lineHeight: 1,
              }}>{isOpen ? '–' : '+'}</span>
            </div>
            {isOpen ? (
              <div style={{
                padding: '0 var(--lv-g-1) var(--lv-g-1)',
                fontSize: 'var(--lv-t-body)',
                lineHeight: 'var(--lv-lead-prose)',
                color: 'var(--lv-ink-quiet)',
                textWrap: 'pretty',
                maxWidth: 'var(--lv-w-prose)',
                animation: 'lvOpen var(--lv-dur-1) ease-out both',
              }}>{it.a}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

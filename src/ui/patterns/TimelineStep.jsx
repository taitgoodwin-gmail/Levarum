import React from 'react';
import { StepNumber } from './StepNumber.jsx';
import { Chip } from '../core/Chip.jsx';

export function TimelineStep({ n, title, tool, children, last = false, style, ...rest }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 'var(--lv-s-4)', ...style }} {...rest}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none', paddingTop: 'var(--lv-s-1)' }}>
        <StepNumber n={n} size={26} style={{ background: 'transparent', fontWeight: 700 }} />
        {last ? null : <span style={{ width: '2px', flex: 1, background: 'var(--lv-sec)', marginTop: 'var(--lv-s-2)' }} />}
      </div>
      <div style={{ paddingBottom: last ? 0 : 'var(--lv-s-6)', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--lv-s-4)', flexWrap: 'wrap', marginBottom: 'var(--lv-s-2)' }}>
          <span style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-t-body)', letterSpacing: 'var(--lv-track-tight)' }}>{title}</span>
          {tool ? <Chip>{tool}</Chip> : null}
        </div>
        <div style={{ fontSize: 'var(--lv-t-sm)', lineHeight: 'var(--lv-lead-prose)', color: 'var(--lv-ink-quiet)', maxWidth: '60ch' }}>{children}</div>
      </div>
    </div>
  );
}

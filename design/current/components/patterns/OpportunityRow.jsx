import React from 'react';
import { Meter } from '../core/Meter.jsx';
import { HoursFigure } from '../core/HoursFigure.jsx';

export function OpportunityRow({ title, hoursText, figure, percent = 100, quiet = false, style, ...rest }) {
  return (
    <div style={{
      background: 'var(--lv-surface)',
      border: 'var(--lv-bw) solid var(--lv-line)',
      borderRadius: 'var(--lv-r-card)',
      padding: 'var(--lv-s-5) var(--lv-s-6)',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 'var(--lv-s-6)',
      alignItems: 'center',
      ...style,
    }} {...rest}>
      <div style={{ minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 600, fontSize: 'var(--lv-t-lg)', letterSpacing: 'var(--lv-track-tight)', lineHeight: 1.3 }}>{title}</span>
        <Meter value={percent} height="sm" quiet={quiet} style={{ margin: 'var(--lv-s-3) 0 var(--lv-s-2)' }} />
        {hoursText ? <span style={{ fontSize: 'var(--lv-t-sm)', color: 'var(--lv-ink-quiet)', whiteSpace: 'nowrap' }}>{hoursText}</span> : null}
      </div>
      <HoursFigure value={figure} unit="h" size="sm" />
    </div>
  );
}

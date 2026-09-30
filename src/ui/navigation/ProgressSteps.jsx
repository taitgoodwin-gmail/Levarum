import React from 'react';

export function ProgressSteps({ step = 1, total = 3, form = 'dots', label, note, style, ...rest }) {
  const bars = [];
  for (let i = 1; i <= total; i += 1) {
    const on = i <= step;
    bars.push(
      <span key={i} style={form === 'dots'
        ? { width: '11px', height: '11px', borderRadius: 'var(--lv-r-round)', flex: 'none', background: on ? 'var(--lv-accent)' : 'var(--lv-line)' }
        : { height: '6px', flex: 1, borderRadius: '3px', background: on ? 'var(--lv-accent)' : 'var(--lv-line)' }} />
    );
  }
  return (
    <div style={style} {...rest}>
      {(label || note) ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--lv-s-5)', marginBottom: 'var(--lv-s-4)' }}>
          <span style={{ fontSize: 'var(--lv-t-xs)', color: 'var(--lv-ink-quiet)' }}>{label || 'Step ' + step + ' of ' + total}</span>
          {note ? <span style={{ fontSize: 'var(--lv-t-xs)', color: 'var(--lv-ink-quiet)' }}>{note}</span> : null}
        </div>
      ) : null}
      <div style={{ display: 'flex', gap: form === 'dots' ? '10px' : '8px', alignItems: 'center' }}>{bars}</div>
    </div>
  );
}

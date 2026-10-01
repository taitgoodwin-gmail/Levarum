import React from 'react';

export function Alert({ tone = 'sec', title, children, actions, style, ...rest }) {
  if (tone === 'failure') {
    return (
      <div role="alert" style={{
        border: 'var(--lv-bw) solid var(--lv-alert-line)',
        background: 'var(--lv-alert-surface)',
        borderRadius: 'var(--lv-r-card)',
        padding: 'var(--lv-s-6)',
        color: 'var(--lv-alert-ink)',
        ...style,
      }} {...rest}>
        {title ? (
          <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 700, fontSize: 'var(--lv-t-lg)', letterSpacing: 'var(--lv-track-tight)', marginBottom: 'var(--lv-s-2)' }}>{title}</div>
        ) : null}
        <div style={{ fontSize: 'var(--lv-t-md)', lineHeight: 'var(--lv-lead-body)', color: 'var(--lv-alert-quiet)' }}>{children}</div>
        {actions ? <div style={{ display: 'flex', gap: 'var(--lv-s-4)', flexWrap: 'wrap', marginTop: 'var(--lv-s-5)' }}>{actions}</div> : null}
      </div>
    );
  }
  const accent = tone === 'accent';
  return (
    <div role="alert" style={{
      border: 'var(--lv-bw) solid ' + (accent ? 'var(--lv-accent)' : 'var(--lv-sec)'),
      background: accent ? 'var(--lv-accent-tint)' : 'var(--lv-sec-tint)',
      color: accent ? 'var(--lv-accent)' : 'var(--lv-sec)',
      borderRadius: 'var(--lv-r-control)',
      padding: 'var(--lv-s-4) var(--lv-s-5)',
      fontSize: 'var(--lv-t-sm)',
      lineHeight: 'var(--lv-lead-body)',
      ...style,
    }} {...rest}>{children}</div>
  );
}

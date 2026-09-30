import React from 'react';

export function Chip({ tone = 'sec', children, style, ...rest }) {
  const quiet = tone === 'quiet';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      border: 'var(--lv-bw) solid ' + (quiet ? 'var(--lv-line-control)' : 'var(--lv-sec)'),
      background: quiet ? 'var(--lv-page)' : 'var(--lv-sec-tint)',
      color: quiet ? 'var(--lv-ink)' : 'var(--lv-sec)',
      borderRadius: 'var(--lv-r-chip)',
      padding: 'var(--lv-s-2) var(--lv-s-3)',
      fontSize: 'var(--lv-t-cap)',
      lineHeight: 1.3,
      whiteSpace: 'normal',
      maxWidth: '100%',
      ...style,
    }} {...rest}>{children}</span>
  );
}

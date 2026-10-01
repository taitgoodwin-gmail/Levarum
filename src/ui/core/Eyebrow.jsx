import React from 'react';

export function Eyebrow({ tone = 'sec', wide = false, children, style, ...rest }) {
  const color = tone === 'quiet' ? 'var(--lv-ink-quiet)'
    : tone === 'accent' ? 'var(--lv-accent)'
    : tone === 'inverse' ? 'var(--lv-sec-on-dark)'
    : 'var(--lv-sec)';
  return (
    <div style={{
      fontFamily: 'var(--lv-f-display)',
      fontWeight: 600,
      fontSize: 'var(--lv-t-cap)',
      letterSpacing: wide ? 'var(--lv-track-caps-wide)' : 'var(--lv-track-caps)',
      textTransform: 'uppercase',
      lineHeight: 1.3,
      color,
      ...style,
    }} {...rest}>{children}</div>
  );
}

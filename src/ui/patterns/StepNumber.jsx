import React from 'react';

export function StepNumber({ n, size = 34, tone = 'sec', style, ...rest }) {
  const tinted = tone === 'sec';
  return (
    <span style={{
      width: size + 'px',
      height: size + 'px',
      flex: 'none',
      borderRadius: 'var(--lv-r-round)',
      border: 'var(--lv-bw-strong) solid ' + (tinted ? 'var(--lv-sec)' : 'var(--lv-ink)'),
      background: tinted ? 'var(--lv-sec-tint)' : 'transparent',
      color: tinted ? 'var(--lv-sec)' : 'var(--lv-ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--lv-f-display)',
      fontWeight: 600,
      fontSize: size >= 32 ? 'var(--lv-t-sm)' : 'var(--lv-t-cap)',
      lineHeight: 1,
      ...style,
    }} {...rest}>{n}</span>
  );
}

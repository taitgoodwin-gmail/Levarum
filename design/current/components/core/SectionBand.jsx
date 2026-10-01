import React from 'react';

const RUNGS = {
  1: 'var(--lv-rung-1)',
  2: 'var(--lv-rung-2)',
  3: 'var(--lv-rung-3)',
  4: 'var(--lv-rung-4)',
  dark: 'var(--lv-dark-petrol)',
};

export function SectionBand({ rung = 1, edges = 'both', width = 'page', children, style, innerStyle, ...rest }) {
  const dark = rung === 'dark';
  const line = dark ? 'var(--lv-dark-petrol-line)' : 'var(--lv-line)';
  const maxWidth = width === 'read' ? 'var(--lv-w-read)' : width === 'form' ? 'var(--lv-w-form)' : 'var(--lv-w-page)';
  return (
    <div style={{
      background: RUNGS[rung] || RUNGS[1],
      color: dark ? 'var(--lv-dark-ink)' : 'var(--lv-ink)',
      borderTop: (edges === 'both' || edges === 'top') ? 'var(--lv-bw) solid ' + line : undefined,
      borderBottom: (edges === 'both' || edges === 'bottom') ? 'var(--lv-bw) solid ' + line : undefined,
      ...style,
    }} {...rest}>
      <div style={{ maxWidth, margin: '0 auto', padding: 'var(--lv-g-5) var(--lv-s-7)', ...innerStyle }}>
        {children}
      </div>
    </div>
  );
}

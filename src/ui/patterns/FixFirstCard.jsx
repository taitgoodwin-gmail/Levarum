import React from 'react';
import { Eyebrow } from '../core/Eyebrow.jsx';

export function FixFirstCard({ label = 'FIX THIS FIRST', title, why, tone = 'outlined', style, ...rest }) {
  const tinted = tone === 'tinted';
  return (
    <div style={{
      border: 'var(--lv-bw-strong) solid ' + (tinted ? 'var(--lv-sec)' : 'var(--lv-ink)'),
      background: tinted ? 'var(--lv-sec-tint)' : 'transparent',
      borderRadius: 'var(--lv-r-card)',
      padding: 'var(--lv-s-7)',
      ...style,
    }} {...rest}>
      <Eyebrow tone={tinted ? 'sec' : 'quiet'} style={{ marginBottom: 'var(--lv-s-3)' }}>{label}</Eyebrow>
      <div style={{
        fontFamily: 'var(--lv-f-display)',
        fontWeight: 700,
        fontSize: 'var(--lv-d-5)',
        letterSpacing: 'var(--lv-track-head)',
        lineHeight: 1.2,
        marginBottom: 'var(--lv-s-2)',
      }}>{title}</div>
      {why ? (
        <div style={{ fontSize: 'var(--lv-t-body)', lineHeight: 'var(--lv-lead-body)', color: 'var(--lv-ink-quiet)', maxWidth: '60ch' }}>{why}</div>
      ) : null}
    </div>
  );
}

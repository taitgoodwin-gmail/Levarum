import React from 'react';

const TONES = {
  new: { fg: 'var(--lv-accent)', bg: 'var(--lv-accent-tint)', bd: 'var(--lv-accent)' },
  contacted: { fg: 'var(--lv-sec)', bg: 'var(--lv-sec-tint)', bd: 'var(--lv-sec)' },
  booked: { fg: 'var(--lv-ok)', bg: 'var(--lv-ok-tint)', bd: 'var(--lv-ok)' },
  done: { fg: 'var(--lv-ink-quiet)', bg: 'var(--lv-page)', bd: 'var(--lv-line-control)' },
  sec: { fg: 'var(--lv-sec)', bg: 'var(--lv-sec-tint)', bd: 'var(--lv-sec)' },
};

export function Pill({ tone = 'sec', dot = false, children, style, ...rest }) {
  const t = TONES[tone] || TONES.sec;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--lv-s-3)',
      border: 'var(--lv-bw) solid ' + t.bd,
      background: t.bg,
      color: t.fg,
      borderRadius: 'var(--lv-r-pill)',
      padding: 'var(--lv-s-1) var(--lv-s-4)',
      fontFamily: 'var(--lv-f-display)',
      fontWeight: 600,
      fontSize: 'var(--lv-t-cap)',
      letterSpacing: 'var(--lv-track-caps)',
      whiteSpace: 'nowrap',
      ...style,
    }} {...rest}>
      {dot ? <span aria-hidden="true" style={{ width: '7px', height: 'var(--lv-s-2)', borderRadius: 'var(--lv-r-round)', background: 'currentColor', flex: 'none' }} /> : null}
      {children}
    </span>
  );
}

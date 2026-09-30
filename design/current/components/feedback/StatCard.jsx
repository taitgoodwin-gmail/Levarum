import React from 'react';

const TONES = {
  new: { fg: 'var(--lv-accent)', bg: 'var(--lv-accent-tint)', bd: 'var(--lv-accent)' },
  contacted: { fg: 'var(--lv-sec)', bg: 'var(--lv-sec-tint)', bd: 'var(--lv-sec)' },
  booked: { fg: 'var(--lv-ok)', bg: 'var(--lv-ok-tint)', bd: 'var(--lv-ok)' },
  done: { fg: 'var(--lv-ink-quiet)', bg: 'var(--lv-page)', bd: 'var(--lv-line-control)' },
  sec: { fg: 'var(--lv-sec)', bg: 'var(--lv-sec-tint)', bd: 'var(--lv-sec)' },
};

export function StatCard({ value, label, tone = 'sec', style, ...rest }) {
  const t = TONES[tone] || TONES.sec;
  return (
    <div style={{
      background: t.bg,
      border: 'var(--lv-bw) solid ' + t.bd,
      borderRadius: 'var(--lv-r-card)',
      padding: 'var(--lv-s-6)',
      color: t.fg,
      ...style,
    }} {...rest}>
      <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 800, fontSize: 'var(--lv-d-4)', letterSpacing: 'var(--lv-track-display)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: 'var(--lv-f-display)', fontWeight: 600, fontSize: 'var(--lv-t-cap)', letterSpacing: 'var(--lv-track-caps)', textTransform: 'uppercase', marginTop: 'var(--lv-s-3)' }}>{label}</div>
    </div>
  );
}

import React from 'react';

const SIZES = {
  sm: { figure: 'var(--lv-d-4)', unit: 'var(--lv-t-cap)', lead: 1 },
  md: { figure: 'var(--lv-d-3)', unit: 'var(--lv-t-sm)', lead: 0.9 },
  lg: { figure: 'var(--lv-d-2)', unit: 'var(--lv-t-lg)', lead: 0.9 },
  xl: { figure: 'var(--lv-d-1)', unit: 'var(--lv-t-lg)', lead: 0.85 },
};

export function HoursFigure({ value, unit = 'h', size = 'md', block = false, style, ...rest }) {
  const s = SIZES[size] || SIZES.md;
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--lv-s-3)', ...style }} {...rest}>
      <span style={{
        fontFamily: 'var(--lv-f-display)',
        fontWeight: 800,
        fontSize: s.figure,
        letterSpacing: 'var(--lv-track-display)',
        lineHeight: s.lead,
      }}>{value}</span>
      {unit ? (
        <span style={block ? {
          fontFamily: 'var(--lv-f-display)',
          fontWeight: 700,
          fontSize: s.unit,
          letterSpacing: 'var(--lv-track-tight)',
          lineHeight: 1.15,
        } : {
          fontSize: s.unit,
          color: 'var(--lv-ink-quiet)',
          whiteSpace: 'nowrap',
        }}>{unit}</span>
      ) : null}
    </div>
  );
}

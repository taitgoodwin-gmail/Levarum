import React from 'react';

const SHAPES = ['lift', 'tile', 'badge', 'rule', 'word', 'stack'];

/* The mark is a filled half-dome on a bar — a lever at rest on its fulcrum.
   Two shapes, copied verbatim from the product. Always currentColor. */
function Mark({ size, color, animate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false"
      style={{ display: 'block', flex: 'none', color }}>
      <path d="M6 44 A26 26 0 0 1 58 44 Z" fill="currentColor"
        style={animate ? { animation: 'lvLift .62s var(--lv-ease-lift) both', transformOrigin: 'center' } : undefined} />
      <rect x="6" y="52" width="52" height="9" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  shape = 'lift',
  color = 'var(--lv-ink)',
  wordColor,
  size = 30,
  animate = true,
  href = '#',
  as = 'a',
  style,
  ...rest
}) {
  const s = SHAPES.includes(shape) ? shape : 'lift';
  const stacked = s === 'stack';
  const knock = { width: size + 2, height: size + 2, borderRadius: s === 'badge' ? 'var(--lv-r-round)' : 'var(--lv-r-control)', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' };

  let mark = null;
  if (s === 'tile' || s === 'badge') {
    mark = <span style={knock}><Mark size={Math.round(size * 0.7)} color="var(--lv-page)" animate={animate} /></span>;
  } else if (s === 'rule') {
    mark = (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false" style={{ display: 'block', flex: 'none', color }}>
        <rect x="6" y="52" width="52" height="9" fill="currentColor" />
      </svg>
    );
  } else if (s !== 'word') {
    mark = <Mark size={size} color={color} animate={animate} />;
  }

  const Tag = as;
  return (
    <Tag
      href={as === 'a' ? href : undefined}
      style={{
        display: 'flex',
        flexDirection: stacked ? 'column' : 'row',
        alignItems: stacked ? 'flex-start' : 'center',
        gap: s === 'word' ? 0 : stacked ? '6px' : '11px',
        color: 'var(--lv-ink)',
        textDecoration: 'none',
        ...style,
      }}
      {...rest}
    >
      {mark}
      <span style={{
        fontFamily: 'var(--lv-f-display)',
        fontWeight: s === 'word' ? 800 : 700,
        fontSize: s === 'word' ? '21px' : '19px',
        letterSpacing: s === 'word' ? '-0.04em' : 'var(--lv-track-head)',
        textTransform: s === 'rule' ? 'uppercase' : 'none',
        color: wordColor || color,
        lineHeight: 1.1,
      }}>Levarum</span>
    </Tag>
  );
}

import React from 'react';

const SHAPES = ['lift', 'tile', 'badge', 'rule', 'word', 'stack'];

/* Reviewed Lift direction: an L and rising diagonal. Always currentColor. */
function Mark({ size, color, animate }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false"
      style={{ display: 'block', flex: 'none', color }}>
      <path d="M10 8H22V42H38V54H10Z M28 32L48 12H34V2H62V30H52V20L36 36Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  shape = 'word',
  color = 'var(--lv-ink)',
  wordColor,
  size = 30,
  animate = true,
  href = '#',
  as = 'a',
  style,
  ...rest
}) {
  const s = SHAPES.includes(shape) ? shape : 'word';
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
        fontWeight: 700,
        fontSize: s === 'word' ? `${size}px` : '19px',
        letterSpacing: s === 'word' ? '-0.03em' : 'var(--lv-track-head)',
        textTransform: s === 'rule' ? 'uppercase' : 'none',
        color: wordColor || color,
        lineHeight: 1.1,
      }}>{s === 'word' ? 'levarum' : 'Levarum'}</span>
    </Tag>
  );
}

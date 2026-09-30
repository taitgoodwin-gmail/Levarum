import React from 'react';
import { Eyebrow } from '../core/Eyebrow.jsx';

/* The system's most-used editorial device: what happens today on a dashed
   grey rule, what happens once it is set up on a solid petrol rule. */
export function BeforeAfter({
  beforeLabel = 'TODAY',
  afterLabel = 'ONCE IT IS SET UP',
  before,
  after,
  direction = 'column',
  style,
  ...rest
}) {
  return (
    <div style={{
      display: direction === 'row' ? 'grid' : 'flex',
      gridTemplateColumns: direction === 'row' ? 'repeat(auto-fit,minmax(min(240px,100%),1fr))' : undefined,
      flexDirection: direction === 'row' ? undefined : 'column',
      gap: 'var(--lv-s-5)',
      ...style,
    }} {...rest}>
      <div style={{ borderLeft: '2px dashed var(--lv-line-control)', paddingLeft: 'var(--lv-s-5)' }}>
        <Eyebrow tone="quiet" style={{ marginBottom: 'var(--lv-s-2)' }}>{beforeLabel}</Eyebrow>
        <div style={{ fontSize: 'var(--lv-t-sm)', lineHeight: 'var(--lv-lead-prose)', color: 'var(--lv-ink-quiet)' }}>{before}</div>
      </div>
      <div style={{ borderLeft: '2px solid var(--lv-sec)', paddingLeft: 'var(--lv-s-5)' }}>
        <Eyebrow style={{ marginBottom: 'var(--lv-s-2)' }}>{afterLabel}</Eyebrow>
        <div style={{ fontSize: 'var(--lv-t-sm)', lineHeight: 'var(--lv-lead-prose)' }}>{after}</div>
      </div>
    </div>
  );
}

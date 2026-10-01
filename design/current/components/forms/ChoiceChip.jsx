import React from 'react';

export function ChoiceChip({ label, selected = false, onSelect, role = 'radio', style, ...rest }) {
  const key = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); onSelect && onSelect(); }
  };
  return (
    <div
      role={role}
      aria-checked={selected ? 'true' : 'false'}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={key}
      style={{
        minHeight: 'var(--lv-tap)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 var(--lv-s-5)',
        borderRadius: 'var(--lv-r-control)',
        cursor: 'pointer',
        fontSize: 'var(--lv-t-body)',
        fontWeight: selected ? 600 : 400,
        background: selected ? 'var(--lv-sec)' : 'var(--lv-page)',
        color: selected ? 'var(--lv-surface)' : 'var(--lv-ink)',
        border: 'var(--lv-bw-strong) solid ' + (selected ? 'var(--lv-sec)' : 'var(--lv-line-control)'),
        transition: 'background var(--lv-dur-1) ease, border-color var(--lv-dur-1) ease, color var(--lv-dur-1) ease',
        ...style,
      }}
      {...rest}
    >{label}</div>
  );
}

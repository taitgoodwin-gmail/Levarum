import React from 'react';

export function CheckRow({ label, checked = false, onToggle, style, ...rest }) {
  return (
    <label
      className="lv-choice"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--lv-s-5)',
        padding: 'var(--lv-s-5) var(--lv-s-6)',
        borderRadius: 'var(--lv-r-card)',
        cursor: 'pointer',
        background: checked ? 'var(--lv-surface)' : 'var(--lv-page)',
        border: 'var(--lv-bw-strong) solid ' + (checked ? 'var(--lv-sec)' : 'var(--lv-line-control)'),
        transition: 'background var(--lv-dur-1) ease, border-color var(--lv-dur-1) ease',
        ...style,
      }}
      {...rest}
    >
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <span aria-hidden="true" style={{
        width: '26px',
        height: '26px',
        flex: 'none',
        borderRadius: 'var(--lv-r-chip)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--lv-t-sm)',
        color: checked ? 'var(--lv-surface)' : 'transparent',
        background: checked ? 'var(--lv-accent)' : 'transparent',
        border: 'var(--lv-bw-strong) solid ' + (checked ? 'var(--lv-accent)' : 'var(--lv-line-control)'),
      }}>{checked ? '✓' : ''}</span>
      <span style={{ fontSize: 'var(--lv-t-body)', lineHeight: 1.4, color: 'var(--lv-ink)' }}>{label}</span>
    </label>
  );
}

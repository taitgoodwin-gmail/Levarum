import React from 'react';

export function ThemeToggle({ theme, onToggle, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [mode, setMode] = React.useState(theme || 'light');

  React.useEffect(() => { if (theme) setMode(theme); }, [theme]);

  const click = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    if (onToggle) { onToggle(next); return; }
    try {
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('levarum.theme.v1', next);
    } catch (e) {}
  };

  return (
    <button
      type="button"
      onClick={click}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--lv-s-2)',
        minHeight: 'var(--lv-tap-min)',
        padding: '0 var(--lv-s-4)',
        background: 'transparent',
        border: 'var(--lv-bw) solid ' + (hover ? 'var(--lv-sec)' : 'var(--lv-line-control)'),
        borderRadius: 'var(--lv-r-control)',
        color: hover ? 'var(--lv-ink)' : 'var(--lv-ink-quiet)',
        fontFamily: 'var(--lv-f-body)',
        fontSize: 'var(--lv-t-xs)',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'border-color var(--lv-dur-1) ease, color var(--lv-dur-1) ease',
        ...style,
      }}
      {...rest}
    >
      <span aria-hidden="true" style={{
        width: '11px',
        height: '11px',
        borderRadius: 'var(--lv-r-round)',
        border: 'var(--lv-bw-strong) solid currentColor',
        background: mode === 'dark' ? 'currentColor' : 'linear-gradient(90deg, currentColor 50%, transparent 50%)',
        flex: 'none',
      }} />
      {mode === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}

import React from 'react';

export function SkipLink({ href = '#main', children = 'Skip to content' }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <a
      href={href}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        position: 'absolute',
        left: focus ? 'var(--lv-s-5)' : '-9999px',
        top: focus ? 'var(--lv-s-5)' : 0,
        zIndex: 200,
        background: 'var(--lv-ink)',
        color: 'var(--lv-page)',
        padding: 'var(--lv-s-3) var(--lv-s-5)',
        borderRadius: 'var(--lv-r-control)',
        fontFamily: 'var(--lv-f-display)',
        fontWeight: 600,
        fontSize: 'var(--lv-t-sm)',
        textDecoration: 'none',
      }}
    >{children}</a>
  );
}

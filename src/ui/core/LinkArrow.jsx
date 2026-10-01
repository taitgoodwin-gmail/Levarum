import React from 'react';

export function LinkArrow({ href = '#', children, size = 'md', quiet = false, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const px = size === 'lg' ? 'var(--lv-t-body)' : size === 'sm' ? 'var(--lv-t-sm)' : 'var(--lv-t-md)';
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 'var(--lv-tap-min)',
        fontFamily: 'var(--lv-f-display)',
        fontWeight: 600,
        fontSize: px,
        textDecoration: 'none',
        color: quiet
          ? (hover ? 'var(--lv-sec)' : 'var(--lv-ink-quiet)')
          : (hover ? 'var(--lv-link-hover)' : 'var(--lv-link)'),
        transition: 'color var(--lv-dur-1) ease',
        ...style,
      }}
      {...rest}
    >{children} →</a>
  );
}

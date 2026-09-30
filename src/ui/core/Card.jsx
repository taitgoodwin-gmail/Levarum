import React from 'react';

export function Card({
  variant = 'standard',
  rank,
  shadow,
  padding = 'md',
  interactive = false,
  href,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const pad = padding === 'sm' ? 'var(--lv-g-1)' : padding === 'lg' ? 'var(--lv-s-7)' : 'var(--lv-g-2)';

  let skin;
  if (variant === 'tinted') {
    skin = { background: 'var(--lv-sec-tint)', border: 'var(--lv-bw-strong) solid var(--lv-sec)' };
  } else if (variant === 'outlined') {
    skin = { background: 'transparent', border: 'var(--lv-bw-strong) solid var(--lv-ink)' };
  } else if (variant === 'reserved') {
    skin = { background: 'transparent', border: 'var(--lv-bw-strong) dashed var(--lv-line-control)' };
  } else if (variant === 'dark') {
    skin = {
      background: 'var(--lv-dark-petrol-surface)',
      border: 'var(--lv-bw) solid var(--lv-dark-petrol-line)',
      borderTop: '2px solid var(--lv-sec-on-dark)',
      color: 'var(--lv-dark-ink)',
    };
  } else if (variant === 'sunken') {
    skin = { background: 'var(--lv-band)', border: 'var(--lv-bw) solid var(--lv-line)' };
  } else {
    skin = { background: 'var(--lv-surface)', border: 'var(--lv-bw) solid var(--lv-line)' };
  }

  const lift = interactive || !!href;
  const css = {
    borderRadius: 'var(--lv-r-card)',
    padding: pad,
    display: 'block',
    color: variant === 'dark' ? 'var(--lv-dark-ink)' : 'var(--lv-ink)',
    textDecoration: 'none',
    boxShadow: shadow === 'lg' ? 'var(--lv-shadow-lg)' : shadow === 'sm' ? 'var(--lv-shadow-sm)' : 'none',
    transition: 'border-color var(--lv-dur-1) ease, box-shadow var(--lv-dur-1) ease, transform var(--lv-dur-1) ease',
    ...skin,
    ...(rank ? { borderLeft: (rank === 'lead' ? 'var(--lv-bw-rank-lead)' : 'var(--lv-bw-rank)') + ' solid var(--lv-sec)' } : null),
    ...(lift && hover && !press ? { borderColor: 'var(--lv-sec)', boxShadow: 'var(--lv-shadow-sm)', transform: 'translateY(-2px)' } : null),
    ...(lift && press ? { transform: 'none', boxShadow: 'none' } : null),
    ...style,
  };

  const handlers = lift ? {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
  } : {};

  if (href) return <a href={href} style={css} {...handlers} {...rest}>{children}</a>;
  return <div style={css} {...handlers} {...rest}>{children}</div>;
}

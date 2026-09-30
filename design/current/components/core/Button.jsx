import React from 'react';

const BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'var(--lv-f-display)',
  fontWeight: 600,
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background var(--lv-dur-1) ease, box-shadow var(--lv-dur-1) ease, transform var(--lv-dur-1) ease, border-color var(--lv-dur-1) ease, color var(--lv-dur-1) ease',
};

const SIZES = {
  sm: { minHeight: '44px', padding: '0 var(--lv-s-5)', fontSize: 'var(--lv-t-sm)' },
  md: { minHeight: 'var(--lv-tap)', padding: '0 var(--lv-s-7)', fontSize: 'var(--lv-t-lg)' },
  lg: { minHeight: 'var(--lv-tap)', padding: 'var(--lv-s-6) var(--lv-s-8)', fontSize: 'var(--lv-t-lg)' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  active = false,
  href,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  let skin;
  if (variant === 'ghost') {
    skin = {
      background: hover ? 'var(--lv-tint)' : 'transparent',
      color: 'var(--lv-ink)',
      border: 'var(--lv-bw-strong) solid var(--lv-ink)',
      letterSpacing: 'var(--lv-track-label)',
    };
  } else if (variant === 'quiet') {
    skin = {
      background: 'transparent',
      color: hover ? 'var(--lv-ink)' : 'var(--lv-link)',
      border: 'var(--lv-bw-strong) solid var(--lv-sec)',
      letterSpacing: 'var(--lv-track-label)',
    };
  } else if (variant === 'status') {
    skin = {
      background: active ? 'var(--lv-sec-tint)' : 'transparent',
      color: active ? 'var(--lv-sec)' : 'var(--lv-ink)',
      border: 'var(--lv-bw) solid ' + (active ? 'var(--lv-sec)' : 'var(--lv-line-control)'),
      fontSize: 'var(--lv-t-sm)',
    };
  } else {
    skin = {
      background: hover && !disabled ? 'var(--lv-accent-hover)' : 'var(--lv-accent)',
      color: 'var(--lv-surface)',
      letterSpacing: 'var(--lv-track-label)',
      boxShadow: hover && !press && !disabled ? 'var(--lv-shadow-sm)' : 'none',
    };
  }

  const css = {
    ...BASE,
    ...SIZES[size] || SIZES.md,
    borderRadius: 'var(--lv-r-control)',
    width: block ? '100%' : undefined,
    transform: press && !disabled ? 'translateY(1px)' : 'none',
    opacity: disabled ? 0.45 : 1,
    pointerEvents: disabled ? 'none' : undefined,
    ...skin,
    ...style,
  };

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
  };

  if (href) {
    return <a href={href} style={css} aria-disabled={disabled ? 'true' : undefined} {...handlers} {...rest}>{children}</a>;
  }
  return <button type="button" style={css} aria-disabled={disabled ? 'true' : undefined} disabled={disabled} {...handlers} {...rest}>{children}</button>;
}

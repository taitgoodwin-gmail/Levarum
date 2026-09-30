import React from 'react';

export function TextField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  helper,
  error,
  disabled = false,
  textarea = false,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const border = error ? 'var(--lv-accent)' : focus ? 'var(--lv-accent)' : hover ? 'var(--lv-sec)' : 'var(--lv-line-control)';
  const field = {
    width: '100%',
    minHeight: textarea ? '120px' : 'var(--lv-tap)',
    border: (error ? 'var(--lv-bw-strong)' : 'var(--lv-bw)') + ' solid ' + border,
    borderRadius: 'var(--lv-r-control)',
    background: 'var(--lv-page)',
    padding: textarea ? 'var(--lv-s-4) var(--lv-s-5)' : '0 var(--lv-s-5)',
    fontFamily: 'var(--lv-f-body)',
    fontSize: 'var(--lv-t-md)',
    color: 'var(--lv-ink)',
    opacity: disabled ? 0.45 : 1,
    pointerEvents: disabled ? 'none' : undefined,
    transition: 'border-color var(--lv-dur-1) ease',
    ...style,
  };
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div>
      {label ? (
        <label htmlFor={id} style={{ display: 'block', fontSize: 'var(--lv-t-md)', fontWeight: 500, marginBottom: 'var(--lv-s-3)', color: 'var(--lv-ink)' }}>{label}</label>
      ) : null}
      <Tag
        id={id}
        type={textarea ? undefined : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={field}
        {...rest}
      />
      {error ? (
        <div role="alert" style={{ fontSize: 'var(--lv-t-sm)', color: 'var(--lv-accent)', marginTop: 'var(--lv-s-3)' }}>{error}</div>
      ) : helper ? (
        <div style={{ fontSize: 'var(--lv-t-xs)', color: 'var(--lv-ink-quiet)', marginTop: 'var(--lv-s-3)' }}>{helper}</div>
      ) : null}
    </div>
  );
}

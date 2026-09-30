import React from 'react';

export function SelectField({ label, id, value, onChange, options = [], disabled = false, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const border = focus ? 'var(--lv-accent)' : hover ? 'var(--lv-sec)' : 'var(--lv-line-control)';
  return (
    <div>
      {label ? (
        <label htmlFor={id} style={{ display: 'block', fontSize: 'var(--lv-t-md)', fontWeight: 500, marginBottom: 'var(--lv-s-3)', color: 'var(--lv-ink)' }}>{label}</label>
      ) : null}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%',
          minHeight: 'var(--lv-tap)',
          border: 'var(--lv-bw) solid ' + border,
          borderRadius: 'var(--lv-r-control)',
          background: 'var(--lv-page)',
          padding: '0 var(--lv-s-5)',
          fontFamily: 'var(--lv-f-body)',
          fontSize: 'var(--lv-t-md)',
          color: 'var(--lv-ink)',
          opacity: disabled ? 0.45 : 1,
          transition: 'border-color var(--lv-dur-1) ease',
          ...style,
        }}
        {...rest}
      >
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </div>
  );
}

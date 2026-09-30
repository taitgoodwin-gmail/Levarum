The multi-select row. Card-radius, 1.5px border, 26px rust tick box holding a `✓`.

```jsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-3)' }}>
  <CheckRow label="Chasing invoices and payments" checked={on} onToggle={toggle} />
</div>
```

Stack these in a column with `gap: var(--lv-s-3)`. Labels read like the owner talking: "Answering the same questions over and over", "Copying details between tools by hand". Tell people more than one is normal in the lead above, and if they pick none say "Pick at least one, even if none of them is perfect."

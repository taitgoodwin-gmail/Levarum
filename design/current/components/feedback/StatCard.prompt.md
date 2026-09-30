The admin inbox counters. One tile per workflow state, tinted to match its pill.

```jsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 'var(--lv-s-5)' }}>
  <StatCard value="3" label="New" tone="new" />
  <StatCard value="1" label="Booked" tone="booked" />
</div>
```

Tones must match the `Pill` for the same state, so the count and the row read as one system. Also used for the two headline stats on the intake gate — pass `tone="sec"` there.

The option tile the intake uses instead of radio buttons. 56px tall, 1.5px border, fills petrol when selected.

```jsx
<div role="radiogroup" aria-label="Hours a week on back-office work"
  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 'var(--lv-s-3)' }}>
  {['Under 5','5 to 15','15 to 30','30 plus'].map(h =>
    <ChoiceChip key={h} label={`${h} hrs`} selected={h === band} onSelect={() => setBand(h)} />)}
</div>
```

Selection changes **fill, border and weight** together — never colour alone. Wrap the set in a `role="radiogroup"` with an `aria-label`; Enter and Space are handled for you.

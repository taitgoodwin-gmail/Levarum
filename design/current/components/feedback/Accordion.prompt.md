The questions accordion. Closed rows are transparent with a hairline; the open row lifts into a white 1.5px-petrol card with a soft shadow.

```jsx
<Accordion items={[
  { q: 'What does it cost?', a: 'Priced per build, not per hour of meetings, and never open-ended…' },
  { q: 'Will this replace my staff?', a: 'No, and I will say so if that is what you are hoping for…' },
]} />
```

- One open at a time. `+` / `–` in a 32px circle — never a chevron.
- Questions are written the way an owner asks them, including the awkward ones. Answers lead with the real answer ("No.", "Often you should") before explaining.
- `aria-expanded` and Enter/Space are handled. Answers cap at 62ch.

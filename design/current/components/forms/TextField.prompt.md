The text field. 56px tall, paper fill on a white card, 13px radius.

```jsx
<TextField id="email" type="email" label="Email"
  placeholder="you@yourbusiness.com" value={email} onChange={setEmail}
  error={bad ? 'That does not look like an email yet. Mind checking it?' : ''} />
```

- Labels are questions in 16px/500, 10px above the field. One field per row.
- Hover warms the border to petrol, focus takes it to rust, error raises it to 1.5px rust with the message below.
- There is no number input in this system.

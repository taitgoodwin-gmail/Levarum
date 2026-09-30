The surface everything sits in. Flat, 20px radius, hairline border — reach for shadow only when a card must float above the page.

```jsx
<Card shadow="sm"><h3>Invoice automation</h3></Card>
<Card variant="tinted"><Eyebrow tone="sec">FIX THIS FIRST</Eyebrow></Card>
<Card variant="reserved">First client results go here</Card>
<Card href="/how-it-works" padding="lg">…</Card>
```

- `rank` is the ONLY sanctioned coloured left border, and it means ordered-by-size — not decoration.
- `variant="reserved"` is a content decision as much as a visual one: use it to show an honest absence rather than filling the space.
- Interactive cards lift 2px and their border warms to petrol; pressing removes both.

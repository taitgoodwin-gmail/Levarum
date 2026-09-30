The action control — rust fill for the one thing you want done, outlines for everything else.

```jsx
<Button href="/start">Build my Game Plan</Button>
<Button variant="ghost" size="md">Back</Button>
<Button variant="status" active>Booked</Button>
```

- Labels are verb-first and name the outcome: "Build my Game Plan", "Unlock my plan", "Open the intake form" — never "Submit" or "Learn more".
- Hover darkens the fill *and* adds `--lv-shadow-sm`; press moves down 1px and drops the shadow. Nothing scales.
- `variant="primary"` is the only filled button. Use one per screen region; the nav CTA is `size="sm"`.
- `disabled` renders `aria-disabled` with 45% opacity. There is no loading state in this system — narrate work in text beside the button instead.

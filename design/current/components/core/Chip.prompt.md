The small 8px-radius tag. Two jobs in the product: naming the tools a build runs on, and echoing a user's answers back to them.

```jsx
<Chip>QuickBooks</Chip> <Chip>Stripe</Chip> <Chip>Zapier</Chip>
<Chip tone="quiet">Invoice chasing</Chip>
```

Tool names are always **text**, never vendor logos. Lay chips out in a flex row with `gap: var(--lv-s-2)`.

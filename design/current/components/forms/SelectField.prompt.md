The select — used once, for the business-type question that opens the intake.

```jsx
<SelectField id="biz" label="What kind of business is this?"
  value={business} onChange={setBusiness}
  options={['Trades & home services', 'Medical, dental or vet practice', 'Salon, barber or studio', 'Agency or consultancy', 'Online shop', 'Restaurant, cafe or bar', 'Property management', 'Something else']} />
```

Kept native on purpose — no custom dropdown exists in this product. Same 56px height, paper fill and hover/focus borders as `TextField`.

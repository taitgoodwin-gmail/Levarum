A job row in the Game Plan and in the home page's example plan.

```jsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lv-s-3)' }}>
  <OpportunityRow title="Get invoices out and followed up without you" hoursText="3 to 5 hours a week" figure="4" percent={100} />
  <OpportunityRow title="Hand off booking and reminders" hoursText="2 to 4 hours a week" figure="3" percent={75} />
  <OpportunityRow title="Stop re-answering the same questions" hoursText="2 to 3 hours a week" figure="2" percent={50} quiet />
</div>
```

Titles are outcomes phrased as instructions to the business, starting with a verb: "Get…", "Hand off…", "Stop…", "Follow up…". Order the rows by hours, largest first, and keep the meter on the shared scale.

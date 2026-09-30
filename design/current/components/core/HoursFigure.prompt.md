The big number. Levarum values everything in hours, never in money — this component is how that shows.

```jsx
<HoursFigure value="4" unit="h" size="sm" />
<HoursFigure value="9" unit={<>hours a week,<br/>across three jobs</>} size="lg" block />
<HoursFigure value="30%" unit="" size="md" />
```

Always Schibsted Grotesk 800 with `--lv-track-display` tracking and leading under 1. Sits to the right of a `Meter` in a `1fr auto` grid, baseline-aligned.

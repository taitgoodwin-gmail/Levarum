Stations on a line, joined by a 2px petrol rule. Used to show one automation end to end.

```jsx
<div style={{ display: 'flex', flexDirection: 'column' }}>
  <TimelineStep n={1} title="The call comes in" tool="your phone number">Your existing number, the one on the truck. Nothing changes for the caller.</TimelineStep>
  <TimelineStep n={2} title="Missed">Four rings, no answer, because you are under a sink. Today this is where the job dies.</TimelineStep>
  <TimelineStep n={3} title="Booked" tool="your calendar" last>She taps a slot. It blocks your calendar and the drive time around it.</TimelineStep>
</div>
```

Stations that need no tool simply omit the chip. Always mark the final one `last`. Seven stations is the longest line in the product; keep each description to one sentence.

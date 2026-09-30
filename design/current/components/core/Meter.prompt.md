The hours bar — the one piece of motion the brand is known for. It fills from zero over 900ms when it scrolls into view, once.

```jsx
<Meter value={100} />          {/* 4 h/week — a full bar */}
<Meter value={75} />           {/* 3 h/week */}
<Meter value={50} quiet />     {/* 2 h/week, the smallest in the set */}
```

**Never rescale the meter per card.** The whole point is that bars are comparable across every page: 4 hours a week fills one. Always pair a meter with the figure in numerals beside it — the bar is not the only carrier.

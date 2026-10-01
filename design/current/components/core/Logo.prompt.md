The Levarum lockup — use it in every nav and footer, and nowhere else on a page.

```jsx
<Logo href="/" size={30} />
<Logo shape="tile" color="var(--lv-brand-rust)" size={30} />
```

- `shape`: `lift` (default — mark + wordmark, dome animates up on load), `tile` (mark knocked out of a rounded square), `badge` (knocked out of a circle), `rule` (bar only, wordmark uppercased), `word` (wordmark only at 21px/800), `stack` (mark above wordmark).
- Sizes in the product: **30px** in navs, **26px** in footers. Never below 20px.
- Default colour is `--lv-ink`. The eight `--lv-brand-*` hues are the sanctioned alternatives; `wordColor` gives the two-tone lockup.
- Set `animate={false}` inside cards or repeated lists so the dome does not re-lift.

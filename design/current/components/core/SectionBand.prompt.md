Every page is a stack of these. The band supplies the background rung, the hairline edges and the 1180px container in one.

```jsx
<SectionBand rung={2}><h2>None of it is clever.</h2></SectionBand>
<SectionBand rung="dark" edges="none">…</SectionBand>
<SectionBand rung={4} width="read" innerStyle={{ textAlign: 'center' }}>…</SectionBand>
```

- Alternate rungs down a page — never repeat the same rung on adjacent bands.
- **One `rung="dark"` band per page, never two.**
- Vertical padding is always `--lv-g-5`; do not override it.

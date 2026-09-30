The header on every page. Not sticky — it scrolls away with the content.

```jsx
<NavBar
  links={[{label:'How it works',href:'/how'},{label:'What we automate',href:'/what'},{label:'Questions',href:'/questions'}]}
  current="How it works"
  cta={{ label: 'Start', href: '/start' }} />
```

- Three quiet links maximum; the current page carries weight **and** a rust underline so colour is never the only cue.
- Exactly one rust CTA in the nav.
- The whole band fades in with `lvFade` on load; the logo dome lifts with it.
- Below 680px the nav stacks: logo on its own line, links beneath, left aligned.

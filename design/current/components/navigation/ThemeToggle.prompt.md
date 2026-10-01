The theme switch. An 11px half-filled dot plus the name of the mode you'd get by clicking — "Dark" while light, "Light" while dark.

```jsx
<ThemeToggle />
```

Uncontrolled by default: it writes `data-theme` on `<html>` and persists to `localStorage` under `levarum.theme.v1`. Pass `theme` + `onToggle` to drive it from your own state. The dot is the only gradient in the entire system, and it is a hard 2-stop edge, not a blend.

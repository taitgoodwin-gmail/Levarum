Validation and failure messages. There is no red in this palette — errors are rust or petrol tints.

```jsx
<Alert>Pick at least one, even if none of them is perfect.</Alert>
<Alert tone="accent">That is not the demo user or password.</Alert>
<Alert tone="failure" title="That did not go through."
  actions={<><Button>Try again</Button><Button variant="ghost" href="mailto:hello@levarum.co">Email us instead</Button></>}>
  Your plan is still on screen and your answers are saved on this device.
</Alert>
```

Every message says what is still safe and what to do next. Never a bare "Error" or a red exclamation triangle.

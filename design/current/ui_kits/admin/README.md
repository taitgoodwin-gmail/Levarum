# Admin inbox — UI kit

The internal page where unlocked Game Plans land. Not linked from the public navigation.

| State | What it shows |
|---|---|
| Signed out | Sign-in card, plus the honest "PROTOTYPE AUTH — NOT SECURE" note that names exactly what a live deployment would need |
| Signed in | Headline that counts what is waiting on you, five counter tiles, one card per request, and the where-these-come-from explainer |

Demo credentials: **owner / levarum** — printed on the page, as in the source.

## Interactions

Sign in, sign out, and move any row through New → Contacted → Booked → Done. The counters
and the headline recompute; the current state's button is shown active and disabled.
Customer rows and partner rows use the same layout with different summary lines, which is
how the source handles both.

## Files

- `index.html` — entry point
- `AdminApp.jsx` — sign-in, row, and inbox, with five seeded rows

## Differences from the source

The source reads and writes the real on-device store (`levarum.submissions.v1`) that the
intake writes to, and gates on a `localStorage` session. This kit seeds five representative
rows in memory instead, so the workflow is visible without completing the intake first.
Everything else — the layout, the statuses, the copy — is the source's.

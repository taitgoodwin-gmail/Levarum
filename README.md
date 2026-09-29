# Levarum public pilot

A short intake produces a practical Game Plan and an optional request for a
15-minute conversation. Scheduling is handled manually by Levarum through
hello@levarum.com. The site never claims an appointment has been booked.

## Run and check

Requires Node 24.

```sh
npm ci
npm test
npm run build
npm run dev
```

`npm run build` includes the prospect/operator boundary check and TypeScript.
GitHub Actions runs the tests and build on pushes and pull requests.

## Production setup

The Vite client and `api/leads.ts` deploy on Vercel. Create a **private** Blob
store and connect it to the project. The server needs `BLOB_READ_WRITE_TOKEN`
(or the SDK's OIDC configuration, `BLOB_STORE_ID` and platform token).
Use `vercel env pull .env.local` for development; never commit credentials.

The intake endpoint fails closed with 503 if storage is unavailable. It only
confirms a submission after a private write succeeds. No read endpoint is public.

The public site does not load the original operator app or localStorage inbox.
`/api/draft` is disabled. The original design and components remain in the repo
for future authenticated operator work, but are not in the active rendering path.

## Receiving leads

Open this project's private Blob store in the Vercel dashboard:

- `leads/plan/`: saved Game Plan intakes
- `leads/call/`: explicit call requests, including time preferences

Open a record to retrieve the prospect's email and answers. These records are
private: only authorized store administrators can read them. Both paths contain
opaque request identifiers and content hashes, not email addresses.

For the pilot, review call requests manually and reply from **hello@levarum.com**.
Automated email notifications are optional and are **not enabled by merely
setting the contact email**. To enable them, set `RESEND_API_KEY` and
`LEAD_EMAIL_FROM` to a verified sender, redeploy, and verify receipt. Notification
failures do not discard a saved lead. The application does not email the plan;
visitors can print or save it directly from their browser.

## Behavior and protections

- Required business type, hours band, at least one known challenge, valid email,
  and explicit consent, validated on both client and server.
- An 8 KB body limit, honeypot, origin check, and best-effort per-instance throttle.
  Add a platform-wide rate rule before scaling traffic; an in-memory counter is
  not a distributed rate limiter.
- Repeat requests use the same opaque content-addressed path. A retry can update
  the receipt timestamp but cannot overwrite different intake content.
- Internal AI generation is off. No speculative hours or money savings appear.
- No advertising tracking or persistent browser lead store in the public pilot.
- Privacy notice and contact link are available throughout the flow.

## Launch verification

Before accepting traffic, verify an intake and call request from the public URL,
then retrieve those records from private storage. Check mobile layout, invalid
inputs, retry handling, `/privacy`, and that `/api/draft` stays disabled.

The pilot is not a full CRM. Authenticated operator access, plan email delivery,
calendar integration, automated retention, and distributed abuse controls remain
follow-up work. Keep the private store under routine review and handle access or
deletion requests through hello@levarum.com.

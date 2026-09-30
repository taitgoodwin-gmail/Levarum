# Production service provisioning

Evidence checked 2026-09-30 using Vercel CLI 60.1.3, authenticated as `taitgoodwin-gmail`, team `mind-lever-gmail`, linked project `levarum` (`prj_6VaOQLtfGF47YtilTwMDmUg9MXwe`). This is infrastructure preparation, not a production launch or a claim of production journey verification.

## Observed state

| Service | Resource | Plan | Verified project connection |
| --- | --- | --- | --- |
| Existing Clerk | `levarum-auth` (`ir_XtU3dnkEO7JyQiKa`) | Hobby `hobby_2025_08` | Development and preview only |
| Existing Neon | `levarum-admin-preview` (`store_AdSxfzbBcoEmXxa8`) | Free `free_v3` | Development and preview only |
| New isolated Neon | `levarum-production` (`store_uIkhvyLcLNZfSScr`) | Free `free_v3` | Production only; verified after authorized connection |

The new database was created with region `iad1`, Neon authentication disabled (`auth=false`, because Clerk handles authentication), and `--no-connect`. No project environment variables were pulled or connected during creation. The resource is available. No customer records were read or copied. Subsequent schema and isolated transaction checks are recorded below; application-level end-to-end and restore verification remain incomplete.

The production variable inventory immediately before the blocked connection contained only `BLOB_READ_WRITE_TOKEN` and `PREVIEW_READ_WRITE_TOKEN`. Values were not included in the inventory. There was no production `DATABASE_URL`, Clerk key, or owner binding. Existing Blob stores, production deployment, and preview database were not changed by this work.

## Database connection evidence

The CLI supports an exact production target. The prepared command was:

```sh
vercel integration-resource connect levarum-production levarum --environment production --json --yes
```

Automatic approval review rejected this command before execution, stating that changing production environment configuration could redirect or disrupt production persistence and that the exact production cutover had not been explicitly approved. It was not retried through another tool or endpoint. The user subsequently explicitly approved this exact connection, and the root agent completed the same CLI action successfully. This earlier rejection is retained as historical evidence, not an outstanding gate.

Post-connection provider inspection verified `levarum-production` connected only to `production` on the intended project. `levarum-admin-preview` remains connected only to `preview` and `development`. An allowlisted variable inventory confirmed the new database variables, including `DATABASE_URL`, target only production; the existing preview/development database variables remain separately scoped. Both Blob token scopes remain as before. No variable values were emitted and no deployment was performed. Future connection commands must retain explicit environment selection: the default targets all system environments. [Vercel integration CLI guidance](https://vercel.com/docs/cli/integration).

Resource dashboard: [Levarum production database](https://vercel.com/mind-lever-gmail/~/stores/integration/store_uIkhvyLcLNZfSScr).

## Clerk production path

Use the existing `levarum-auth` application rather than create an unrelated duplicate. Clerk documents a distinct development instance mapped to Vercel development/preview and a production instance mapped to production. The production instance needs its own credentials and users. [Clerk Vercel Marketplace integration](https://clerk.com/docs/guides/development/integrations/platforms/vercel-marketplace).

Open [Levarum Clerk resource](https://vercel.com/mind-lever-gmail/~/stores/integration/ir_XtU3dnkEO7JyQiKa), then **Open in Clerk**. In Clerk, create/configure the production instance for `levarum.com`; the Marketplace resource also exposes a production-domain configuration. The CLI inspected here exposes resource creation and inspection, but no resource-update command. The engineering subagent computer-use surface reported no browsers; the root agent subsequently obtained browser access and is inspecting Clerk through provider SSO. The later DNS evidence below records production domain verification; certificates were still issuing at that check. The stable resource link above is the actionable entry point; no credential or SSO URL is included.

Clerk requires domain ownership and DNS configuration for production. Apply only the exact DNS records supplied by that instance, preserving existing Apple/iCloud mail records. DNS access and certificate readiness remain unverified. If Google sign-in is retained, configure production OAuth credentials: development shared credentials do not carry over. Email/password configuration must also be explicitly checked in the production instance. [Clerk production deployment guidance](https://clerk.com/docs/guides/development/deployment/production).

The owner must sign into the production instance as `taitgoodwin@gmail.com` and complete email verification. Only after server-side verification of that production account may its immutable Clerk user ID be bound. Do not reuse a development user ID or assume prior preview enrollment proves a production identity. Preserve exact verified primary-email and online-session checks. No owner binding was changed during this preparation.

## Remaining setup and release checks

1. Production-only database connection, schema permissions, and rolled-back SQL status/event checks are verified. Actual API concurrent status-update and backup/restore drills remain unverified for this database.
2. Complete Clerk production domain/DNS/certificates and production authentication settings. Configure the production Vite publishable key expected by this application, backend secret, explicit stable admin origins, and verified production owner ID without printing values.
3. Verify Blob isolation using credential scope and synthetic records; preserve current production durable records. The presence of two token names alone does not prove distinct stores or least privilege.
4. Verify authorized/unauthorized admin access, expiry/logout, reconciliation, and status conflicts in the intended production configuration before release. Establish recovery/restore, retention/deletion, owner inbox review cadence, and rollback evidence.
5. Keep production replacement behind visual review and the recorded release gates. The new database is available infrastructure, not a production-ready dashboard.

No new paid plan or billing upgrade was selected. CLI live plan discovery listed Clerk Hobby at $0/month and Neon Free; existing resource inspection confirmed these plan IDs. Future limits, upgrades, and recovery coverage need review before accepting any paid commitment. [Neon Marketplace listing](https://vercel.com/marketplace/neon/neon).

## Handling credentials during further setup

CLI 60.1.3 `env ls` can show readable or truncated configuration values; `--json` explicitly includes readable values. Capture output in memory and emit an allowlist of names, target scopes, and types only. Resource creation responses can include SSO URLs; do not print or commit them. The dashboard links above are stable resource pages without session parameters.

## Isolated production database checks

Executed after the authorized production connection on 2026-09-30. The ignored script `work/production-readiness/check-database.mjs` asserted the exact successful connection receipt, resource ID, linked project, and production-only provider scope. It pulled production and preview environments into unique ignored temporary files, parsed them in memory, and removed the files. `.env.local` was untouched. Before writes, it verified different database URLs, Neon endpoints, and Neon project IDs between production and preview. Secret values were not printed.

Verified results:

- Initialized the exact application DDL extracted from `server/admin-store.ts`; repeating it succeeded. The three required tables and initial synchronization row remain as intended setup.
- Inserted one synthetic call-index row inside a transaction, verified `New`/version 0 defaults, acquired its row lock, changed it to `Contacted`/version 1, and inserted its status event.
- Verified the mutation UUID uniqueness constraint rejects a duplicate event; recovered through a savepoint.
- Rolled back the transaction and queried only the generated test ID/mutation ID, confirming zero retained synthetic rows/events. No general inbox query or Blob operation occurred.

These are direct SQL schema/transaction checks, not a test of the authenticated admin API or two simultaneous browser sessions. They do not prove backup availability, point-in-time recovery, export/import fidelity, retention, or operational recovery time. A transaction rollback is not a backup restore drill. The actual application status conflict/idempotency behavior and production identity must still be verified together before release.

The current `pg` dependency emitted a forward-looking warning that `sslmode=require` semantics change in its next major version. Current behavior retains full certificate verification; assess explicit `verify-full` configuration before a major driver upgrade. No driver upgrade or TLS relaxation was performed.

## Production Clerk domain configuration update

On 2026-09-30, the root agent used the existing resource’s Vercel **Settings → Change Configuration** flow to select the existing external domain `levarum.com`. The review showed Hobby with all three paid add-ons false. Vercel returned **Configuration has been updated**. No paid add-on, homepage deployment, secret rotation, or owner binding was performed.

This confirms the resource configuration update only. Clerk DNS verification, certificate readiness, propagated production environment variables, and actual production sign-in remain to be checked. Existing Apple/iCloud DNS records must be preserved.

## Clerk production DNS verification

The root agent configured the existing Clerk resource domain as `levarum.com` with paid add-ons disabled. The Vercel resource then showed an automatic provider secret-rotation timestamp; no manual **Rotate Secrets** action was used. The subsequent metadata inspection still showed Clerk connected only to development/preview and no production Clerk or admin environment variables. The manually maintained Vite publishable-key alias must be checked for consistency if provider-managed keys change.

Cloudflare is authoritative (`denver.ns.cloudflare.com`, `lorna.ns.cloudflare.com`). Vercel's automatic records were initially only in its nonauthoritative zone. The root agent added precisely these five records in the existing signed-in Cloudflare account, DNS-only with automatic TTL:

| Name | CNAME target |
| --- | --- |
| `clerk` | `frontend-api.clerk.services` |
| `accounts` | `accounts.clerk.services` |
| `clkmail` | `mail.iz7ezt2l5z6t.clerk.services` |
| `clk._domainkey` | `dkim1.iz7ezt2l5z6t.clerk.services` |
| `clk2._domainkey` | `dkim2.iz7ezt2l5z6t.clerk.services` |

Independent direct DNS queries to **both authoritative nameservers** returned every exact target. Both still returned the original iCloud MX pair, SPF `v=spf1 include:icloud.com ~all`, Apple verification record, and `sig1._domainkey` iCloud DKIM target. The `www` Vercel CNAME was unchanged. The root agent separately verified the configured apex CNAME remains `a66dadb3d38aead9.vercel-dns-017.com`, DNS-only/automatic TTL; zone count changed from seven to twelve records with no edits to existing rows. Authoritative apex A answers differed from an earlier recursive lookup, so this record asserts the unchanged configured apex target, not identical resolved IP addresses. Nameservers were not changed.

Clerk's **Verify records** UI then showed overall Verified, Frontend API Verified, Account portal Verified, and Email 3/3 Verified. **SSL certificates were Issuing**, not ready, at that observation. The root agent captured `outputs/levarum-clerk-dns-verified.png` in the chat workspace as evidence. Domain verification is not evidence of completed TLS provisioning, production sign-in, or verified owner authorization.

A subsequent independent HTTPS check with ordinary certificate verification (no bypass) returned `clerk.levarum.com` HTTP 200/TLS verification code 0 and `accounts.levarum.com` HTTP 403/TLS verification code 0. This confirms valid TLS for both checked hosts at that later moment; the account-portal 403 requires sign-in-route/provider testing and is not counted as a successful authentication journey. The provider UI certificate label was not rechecked by this subagent.

## Certificate and connection follow-up

Clerk subsequently reported **SSL Certificates Issued** for both the frontend API and account portal. This is provider certificate evidence, not a sign-in test.

The CLI production-only connection attempt returned “Project levarum is already connected to resource levarum-auth” and proposed disconnecting first. No disconnect was performed. The existing Vercel **Update Project Connection** UI instead allows adding Production while retaining Preview and Development. That exact selection is prepared but not saved: browser-use policy requires action-time approval for expanding the authentication integration into production. The existing integration permission notice lists deployment/project reads and deployment-check/protection-bypass/domain writes. Production credentials and owner access remain unconfigured until the approved save and subsequent verification.

Commit `9fa989f` saved the design handoff, tests and provisioning evidence; its automatic preview deployment `dpl_FMSRy5jRfmoozhRmHD3xGyZNboPC` is READY at https://levarum-7qppcwmz9-mind-lever-gmail.vercel.app. It changes only documentation/test harnesses relative to application `8e80f5d`; earlier browser results remain scoped to the tested `9tvocbmhj` deployment.

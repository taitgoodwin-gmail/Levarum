# Blob environment isolation — gate G02

Initial read-only evidence and subsequent authorized scope correction completed 2026-09-30 for Vercel project `levarum`, team `mind-lever-gmail`. The identity/scope phase performed no Blob object operations and rotated no credentials. Only the two existing credential target scopes were changed, preserving their values. The later exact synthetic-record readback and local-file correction are recorded separately below.

## Verified pre-correction selection and credential scope

The provider lists two available stores in `iad1`, both connected to this project: `levarum-leads` and `levarum-preview-private`. Credentials were parsed only in memory using the same store-ID segment interpretation as the installed `@vercel/blob` SDK, then matched against provider store IDs. Tokens, store-private URLs, and record contents are omitted from this evidence.

| Environment | Pre-correction selector chooses | Production credential also available? | Dedicated preview credential available? |
| --- | --- | --- | --- |
| Production | `levarum-leads` | Yes, intended | Yes, unnecessarily |
| Preview | `levarum-preview-private` | **Yes** | Yes |
| Development | **`levarum-leads`** | **Yes** | **No** |

The production and preview selected stores are distinct. Their identities matched provider metadata. Before correction, this was **not least-privilege credential isolation**: preview and development also received the exact production read/write credential.

Pre-correction Vercel environment metadata:

- `BLOB_READ_WRITE_TOKEN`: production, preview, development.
- `PREVIEW_READ_WRITE_TOKEN`: production, preview; absent from development.
- `BLOB_STORE_ID`: absent in all three inspected scopes.

The existing comment claiming preview credentials are connected only to preview/development is inconsistent with those actual scopes.

## Source risk and correction

At inspection, `server/blob-config.ts` selected the dedicated preview token when available outside production, otherwise falling back to `BLOB_READ_WRITE_TOKEN`. The observed development configuration therefore selected the production store. Preview also retained the capability to access the production store even though normal application selection used its dedicated store.

Source `6b9a0f7` implements a fail-closed nonproduction selector. Its 33-test suite, TypeScript, build and boundary checks passed. Verified behavior: nonproduction requests must require the dedicated preview credential; missing it makes `blobConfigured()` false, and direct admin storage operations must fail before invoking SDK fallback. Preserve intended production token/OIDC store support. Regression cases cover missing, empty and whitespace-only preview credentials in preview/development/local environments, plus retained production selection and store-ID support.

Code correction alone does not remove production credentials from nonproduction deployments. The complementary configuration correction is:

1. Scope the production store credential to production only.
2. Scope the dedicated preview store credential to preview and development only.
3. Recheck provider connection/environment metadata and compare store identities locally, emitting only booleans/names.
4. Deploy and verify a new preview after scope changes; existing deployment environment snapshots and local env files may retain prior credentials. Consider credential rotation only under separately authorized operational scope after checking all legitimate production consumers. Do not rotate implicitly or change the live pilot.

The scope correction below completed after the initial check. Avoid commands that disconnect every environment or reconnect a store using all-environment defaults. Preserve the current production Blob store and its records.

## Evidence method and limitations

The ignored helper `work/production-readiness/check-blob-isolation.mjs` captured CLI output and pulled each environment into a unique ignored temporary file, parsed it in memory, and removed that file. It did not modify `.env.local`. A fresh development pull, rather than any particular developer's existing local file, is what the development finding describes.

Provider store names containing “private” do not establish access policy. This check proved credential-to-store identity and environment scope only; it did not attempt unauthenticated retrieval or enumerate customer data. Private submission saves/read behavior, synthetic durable persistence, and authorization tests remain separate evidence. The `get-store` command succeeded but returned non-JSON output, which was withheld rather than logged wholesale.

## Completed reversible scope correction

Vercel's [Edit an environment variable API](https://vercel.com/docs/rest-api/projects/edit-an-environment-variable) accepts an optional `target` field without requiring a replacement value. The authenticated CLI can PATCH the exact existing environment-variable ID using `--input -` and a body containing only `target`. This avoids deletion/recreation, value changes, or token rotation. The inspected variable IDs are `gppxNWmBYwsjzhbv` for `PREVIEW_READ_WRITE_TOKEN` and `3wss7vd33AozudBe` for `BLOB_READ_WRITE_TOKEN` in this project.

Executed order: preview token to `["preview", "development"]`, then production token to `["production"]`. Each PATCH body contained only `target`; each response was captured, and a fresh environment pull verified its credential value unchanged in memory. The ignored `work/production-readiness/blob-scope-before.json` retains only original variable IDs/names/types/scopes for reversal, not credential values.

Independent final provider-identity and environment verification passed:

| Environment | Selected provider-matched store | Available Blob credential |
| --- | --- | --- |
| Production | `levarum-leads` | Only `BLOB_READ_WRITE_TOKEN` |
| Preview | `levarum-preview-private` | Only `PREVIEW_READ_WRITE_TOKEN` |
| Development | `levarum-preview-private` | Only `PREVIEW_READ_WRITE_TOKEN` |

The production credential is absent from fresh preview and development pulls. The preview credential is absent from the production pull. The two selected stores remain distinct, and both credential values are unchanged. No Clerk configuration, deployment, `.env.local`, or Blob object was changed.

**Residual limitation:** existing deployed versions and previously saved local environment files can retain old credentials. The scope correction affects fresh pulls/new deployments; it does not revoke those historical copies. A new tested preview is required for deployment-level evidence. Any rotation or old-deployment retirement requires its own operational assessment so current production consumers continue functioning.

### Existing local file check

A separate metadata-only check of `.env.local` found a Blob credential matching the production store, no dedicated preview credential, and no explicit production `VERCEL_ENV`. That file was preserved. Under the corrected fail-closed selector, local submissions require adding the dedicated preview credential before they can work. The targeted remedy is to obtain and verify the now-correct development preview credential, then surgically replace only the production Blob entry with the dedicated preview entry while preserving all unrelated settings. That surgical correction subsequently completed: the single production Blob entry was replaced with the provider-verified dedicated preview credential. Readback confirmed no production Blob entry, the correct preview store, and byte-for-byte preservation of all unrelated content. The original existed only in memory for rollback; no secret backup file was created.

## Exact synthetic record verification after correction

Using freshly pulled preview-scoped credentials (with an explicit assertion that no production Blob credential was present), `work/verify-isolation.ts` retrieved only the exact content-addressed records computed from `work/isolation-hosted/submissions.json`. All three unique synthetic requests were privately readable and matched the test email, consent, and intent. Lead-v2 records matched the notice version and preserved absent business/hours context; the direct-call record contained meaningful free text without fabricated task categories.

On the exact synthetic call, two simultaneous server-function status updates at the same version produced one success and one 409 conflict. A subsequent status mutation repeated with the same ID preserved both version and event count. Sanitized results are in ignored `work/isolation-private-results.json`. These are direct server-function/private-storage checks, **not authenticated admin API or owner-browser verification**. No customer enumeration or production-store operation occurred. The source deployment used for browser submissions may have started before the scope update; fresh-deployment environment isolation remains a separate verification item.

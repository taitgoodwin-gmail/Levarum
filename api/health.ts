import type { ServerResponse } from 'node:http'

import { send } from '../server/handler'
import { backend } from '../server/store'
import { vercelRoute } from '../server/vercel'

/**
 * GET /api/health — one request that answers "is this deployment wired up?".
 *
 * This exists because the last outage was undiagnosable from outside. The
 * console said "no operator credential is set on this deployment" while the
 * variables were demonstrably set, scoped and predating the build, and there
 * was no way to tell from a browser whether the endpoint was missing, blocked,
 * erroring, or genuinely reporting an unset credential. That is a gap in the
 * product, not in whoever was reading the screen.
 *
 * It reports **presence only, never values**. A boolean saying an environment
 * variable exists is what you need to separate "not configured" from "not
 * reachable"; the value itself would be a credential leak on a public URL, and
 * nothing here reads one.
 *
 * If this route returns JSON at all, the function layer is alive and the SPA
 * rewrite is not swallowing /api/*. If it returns HTML or a 401, the request
 * never reached the function — look at Deployment Protection.
 */
export default vercelRoute((_req, res: ServerResponse) => {
  send(res, 200, {
    ok: true,
    // Presence, not values. Never log or return the credential itself.
    env: {
      OPERATOR_USER: Boolean(process.env.OPERATOR_USER),
      OPERATOR_PASSWORD: Boolean(process.env.OPERATOR_PASSWORD),
      SESSION_SECRET: Boolean(process.env.SESSION_SECRET),
      ANTHROPIC_API_KEY: Boolean(process.env.ANTHROPIC_API_KEY),
      KV_REST_API_URL: Boolean(process.env.KV_REST_API_URL),
      KV_REST_API_TOKEN: Boolean(process.env.KV_REST_API_TOKEN),
    },
    // Which Vercel environment answered, so a Preview URL cannot be mistaken
    // for Production when only one of them carries the variables.
    vercelEnv: process.env.VERCEL_ENV ?? null,
    // Node, not Edge. process.env of a Sensitive variable is readable here;
    // on the Edge runtime much of node: is not available at all.
    runtime: 'nodejs',
    nodeVersion: process.version,
    leadStorage: backend(),
  })
})

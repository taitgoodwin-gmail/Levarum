import { handleSession } from '../server/api'
import { vercelRoute } from '../server/vercel'

/**
 * GET/POST/DELETE /api/session, as a Vercel Function.
 *
 * Bound directly to the session handler. It cannot answer 404 because of a
 * path-string mismatch, which is the failure the console previously reported
 * to the user as "no operator credential is set on this deployment".
 */
export default vercelRoute(handleSession)

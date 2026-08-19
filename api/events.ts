import { handleEvents } from '../server/api'
import { vercelRoute } from '../server/vercel'

/** POST /api/events, as a Vercel Function. */
export default vercelRoute((_req, res, body) => handleEvents(res, body))

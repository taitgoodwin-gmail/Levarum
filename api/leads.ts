import { handleLeadPatch, handleLeads } from '../server/api'
import { vercelRoute } from '../server/vercel'

/** GET/PATCH /api/leads, as a Vercel Function. */
export default vercelRoute((req, res, body) =>
  req.method === 'PATCH' ? handleLeadPatch(req, res, body) : handleLeads(req, res),
)

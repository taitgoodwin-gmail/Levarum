import { handleSubmit } from '../server/api'
import { vercelRoute } from '../server/vercel'

/** POST/PATCH /api/submit, as a Vercel Function. */
export default vercelRoute(handleSubmit)

import { createHandler } from './index'

/**
 * /api/submit, as a Vercel Function.
 *
 * Vercel routes by file, so each endpoint needs its own module even though the
 * routing and the logic are shared. See api/index.ts.
 */
export default createHandler()

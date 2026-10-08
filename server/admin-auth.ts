import type { IncomingMessage } from 'node:http'
import { createClerkClient } from '@clerk/backend'

export class AdminError extends Error {
  status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}

export function requireOwner(userId: string | null, ownerId: string | undefined) {
  if (!ownerId) throw new AdminError(503, 'Admin setup is incomplete')
  if (!userId) throw new AdminError(401, 'Please sign in again')
  if (userId !== ownerId) throw new AdminError(403, 'This account does not have administrator access')
  return userId
}

type AuthDependencies = { environment: () => NodeJS.ProcessEnv; clientFactory: typeof createClerkClient }
export function createAdminAuthorizer({environment = () => process.env, clientFactory = createClerkClient}: Partial<AuthDependencies> = {}) {
  return async (req: IncomingMessage) => {
    const env = environment()
    const secretKey = env.CLERK_SECRET_KEY, publishableKey = env.VITE_CLERK_PUBLISHABLE_KEY
    const authorizedParties = (env.ADMIN_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
    // Vercel supplies this immutable deployment hostname; never derive trust from request headers.
    if (env.VERCEL_ENV === 'preview' && env.VERCEL_URL) authorizedParties.push(`https://${env.VERCEL_URL}`)
    if (!secretKey || !publishableKey || !env.ADMIN_OWNER_USER_ID || !env.ADMIN_OWNER_EMAIL || !authorizedParties.length) {
      throw new AdminError(503, 'Admin setup is incomplete')
    }
    if (req.headers.origin && !authorizedParties.includes(req.headers.origin)) throw new AdminError(403, 'Origin not allowed')
    // No ambient cookie authentication: private requests need a bearer session token.
    if (!req.headers.authorization?.startsWith('Bearer ')) throw new AdminError(401, 'Please sign in')
    const client = clientFactory({secretKey, publishableKey})
    const request = new Request(authorizedParties[0] + (req.url || '/api/admin'), {headers: {Authorization: req.headers.authorization}})
    const state = await client.authenticateRequest(request, {authorizedParties, acceptsToken: 'session_token'})
    const auth = state.toAuth()
    const userId = requireOwner(auth?.userId ?? null, env.ADMIN_OWNER_USER_ID)
    if (!auth?.sessionId) throw new AdminError(401, 'Please sign in again')
    // Online check prevents a revoked token remaining useful until JWT expiry.
    const session = await client.sessions.getSession(auth.sessionId)
    if (session.status !== 'active' || session.userId !== userId) throw new AdminError(401, 'Session has ended. Please sign in again')
    const user = await client.users.getUser(userId)
    const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)
    if (email?.emailAddress.toLowerCase() !== env.ADMIN_OWNER_EMAIL.toLowerCase() || email.verification?.status !== 'verified') {
      throw new AdminError(403, 'The administrator account must have its verified owner email')
    }
    return userId
  }
}
export const authorizeAdmin = createAdminAuthorizer()

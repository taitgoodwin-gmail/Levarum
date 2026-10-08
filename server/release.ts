/** System-provided deployment identity. Production intake fails closed if it is unavailable. */
export function releaseIdentity(env: NodeJS.ProcessEnv = process.env) {
  const sourceRevision = env.VERCEL_GIT_COMMIT_SHA
  const deploymentId = env.VERCEL_DEPLOYMENT_ID
  if (!sourceRevision || !/^[a-f\d]{40}$/i.test(sourceRevision) || !deploymentId || !/^dpl_[a-zA-Z0-9]+$/.test(deploymentId)) return null
  return { sourceRevision, deploymentId }
}
export function releaseConfigured(env: NodeJS.ProcessEnv = process.env) {
  return env.VERCEL_ENV !== 'production' || releaseIdentity(env) !== null
}

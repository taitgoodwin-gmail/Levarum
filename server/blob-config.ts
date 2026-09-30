/** Non-production must never inherit the SDK's default production credential. */
export function blobToken() {
  if (process.env.VERCEL_ENV === 'production') return process.env.BLOB_READ_WRITE_TOKEN
  const token = process.env.PREVIEW_READ_WRITE_TOKEN
  if (!token?.trim()) throw new Error('Dedicated preview Blob storage is not configured')
  return token
}
export function blobConfigured() {
  if (process.env.VERCEL_ENV !== 'production') return Boolean(process.env.PREVIEW_READ_WRITE_TOKEN?.trim())
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

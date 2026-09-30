/** Preview credentials are connected only to preview/development environments. */
export function blobToken() {
  if (process.env.VERCEL_ENV !== 'production' && process.env.PREVIEW_READ_WRITE_TOKEN) return process.env.PREVIEW_READ_WRITE_TOKEN
  return process.env.BLOB_READ_WRITE_TOKEN
}
export function blobConfigured() { return Boolean(blobToken() || process.env.BLOB_STORE_ID) }

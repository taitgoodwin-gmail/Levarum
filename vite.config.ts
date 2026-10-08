import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import leadHandler from './api/leads.ts'
import adminHandler from './api/admin.ts'
import { resolve } from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['BLOB_READ_WRITE_TOKEN', 'BLOB_STORE_ID', 'PREVIEW_READ_WRITE_TOKEN', 'RESEND_API_KEY', 'LEAD_EMAIL_FROM', 'DATABASE_URL', 'CLERK_SECRET_KEY', 'VITE_CLERK_PUBLISHABLE_KEY', 'ADMIN_OWNER_USER_ID', 'ADMIN_OWNER_EMAIL', 'ADMIN_ALLOWED_ORIGINS']) {
    if (env[key]) process.env[key] = env[key]
  }
  return { build: { rollupOptions: { input: { index: resolve('index.html'), admin: resolve('admin.html') } } }, plugins: [react(), {
    name: 'pilot-api',
    configureServer(server) {
      server.middlewares.use('/api/leads', (req, res) => { void leadHandler(req, res) })
      server.middlewares.use('/api/admin', (req, res) => { void adminHandler(req, res) })
      server.middlewares.use('/api/draft', (_req, res) => { res.statusCode = 404; res.end('Not found') })
    },
  }] }
})

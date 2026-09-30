import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import leadHandler from './api/leads.ts'
import partnerHandler from './api/partners.ts'
import adminHandler from './api/admin.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['BLOB_READ_WRITE_TOKEN', 'BLOB_STORE_ID', 'RESEND_API_KEY', 'LEAD_EMAIL_FROM', 'DATABASE_URL', 'CLERK_SECRET_KEY', 'VITE_CLERK_PUBLISHABLE_KEY', 'ADMIN_OWNER_USER_ID', 'ADMIN_ALLOWED_ORIGINS']) {
    if (env[key]) process.env[key] = env[key]
  }
  return { build: { manifest: true, rolldownOptions: { input: { public: 'index.html', admin: 'admin.html' } } }, plugins: [react(), {
    name: 'pilot-api',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => { if (/^\/admin(?:\/|$)/.test(req.url || '')) req.url = '/admin.html'; next() })
      server.middlewares.use('/api/partners', (req, res) => { void partnerHandler(req, res) })
      server.middlewares.use('/api/admin', (req, res) => { void adminHandler(req, res) })
      server.middlewares.use('/api/leads', (req, res) => { void leadHandler(req, res) })
      server.middlewares.use('/api/draft', (_req, res) => { res.statusCode = 404; res.end('Not found') })
    },
  }] }
})

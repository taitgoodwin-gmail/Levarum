import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import leadHandler from './api/leads.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['BLOB_READ_WRITE_TOKEN', 'BLOB_STORE_ID', 'RESEND_API_KEY', 'LEAD_EMAIL_FROM']) {
    if (env[key]) process.env[key] = env[key]
  }
  return { plugins: [react(), {
    name: 'pilot-api',
    configureServer(server) {
      server.middlewares.use('/api/leads', (req, res) => { void leadHandler(req, res) })
      server.middlewares.use('/api/draft', (_req, res) => { res.statusCode = 404; res.end('Not found') })
    },
  }] }
})

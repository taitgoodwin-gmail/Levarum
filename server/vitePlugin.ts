import type { Plugin } from 'vite'
import { handleDraftRequest, isDraftRequest } from './handler'
import { handleApiRequest, isApiRequest, readBody } from './api'

/**
 * Mounts the whole API on the dev server so `npm run dev` is the entire app —
 * intake, persistence, session and drafting — with nothing else to start.
 * Production runs these as Vercel Functions under api/; `vite preview` uses
 * `npm run serve:api`.
 */
export function draftApiPlugin(): Plugin {
  return {
    name: 'levarum-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (isDraftRequest(req)) {
          void handleDraftRequest(req, res)
          return
        }
        if (isApiRequest(req)) {
          void (async () => {
            const raw = req.method === 'GET' || req.method === 'DELETE' ? '' : await readBody(req)
            await handleApiRequest(req, res, raw ? JSON.parse(raw) : undefined)
          })()
          return
        }
        next()
      })
    },
  }
}

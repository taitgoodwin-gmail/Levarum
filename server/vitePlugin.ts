import type { Plugin } from 'vite'
import { handleDraftRequest, isDraftRequest } from './handler.ts'

/**
 * Mounts the draft endpoint on the dev server so `npm run dev` is the whole
 * app, key included, with nothing else to start. Production and `vite preview`
 * use `npm run serve:api` instead.
 */
export function draftApiPlugin(): Plugin {
  return {
    name: 'levarum-draft-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!isDraftRequest(req)) {
          next()
          return
        }
        void handleDraftRequest(req, res)
      })
    },
  }
}

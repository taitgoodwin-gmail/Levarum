import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No `.ts` extensions on relative imports under server/, src/domain/ or api/.
//
// Those directories are reachable from this file AND from the Vercel Functions
// in api/, and the two hosts want opposite things.
//
// Vercel compiles api/ to JavaScript. Emitting forbids
// `allowImportingTsExtensions`, so a `.ts` specifier anywhere in that graph is a
// hard TS5097 error — which is exactly how the API endpoints came to be missing
// from a deploy that otherwise reported success.
//
// Vite's config loader is the other side, and it is the more flexible one: it
// bundles this file today and resolves extensionless imports fine. Only the
// experimental `configLoader: 'native'` needs the extensions, and the npm
// scripts pin `--configLoader bundle` so its planned promotion to default
// cannot quietly reintroduce the problem.
//
// `npm run check:api` enforces this — see tsconfig.vercel.json.
import { draftApiPlugin } from './server/vitePlugin'

export default defineConfig({
  plugins: [react(), draftApiPlugin()],
})

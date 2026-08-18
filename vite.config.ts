import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Everything under server/ and src/domain/ is reachable from this file, which
// means Node's native TypeScript loader resolves it. That loader needs explicit
// file extensions, so imports in those two directories carry `.ts`. App code
// under src/prospect and src/operator goes through Vite and does not.
import { draftApiPlugin } from './server/vitePlugin.ts'

export default defineConfig({
  plugins: [react(), draftApiPlugin()],
})

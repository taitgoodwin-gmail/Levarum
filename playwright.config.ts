import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:4173', launchOptions: process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {} },
  webServer: process.env.TEST_BASE_URL ? undefined : { command: 'npm run dev -- --host 127.0.0.1 --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
  projects: [{ name: 'desktop', use: { viewport: { width: 1440, height: 1024 } } }, { name: 'tablet', use: { viewport: { width: 800, height: 1100 } } }, { name: 'mobile', use: { viewport: { width: 400, height: 850 } } }],
  reporter: 'list',
})

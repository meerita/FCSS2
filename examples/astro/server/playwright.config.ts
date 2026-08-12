// @file examples/astro/server/playwright.config.ts
// @description Playwright configuration for the FCSS Astro server (Node adapter) production build smoke test.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { headless: true, baseURL: 'http://localhost:4325' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm start',
    port: 4325,
    reuseExistingServer: true,
    env: { HOST: 'localhost', PORT: '4325' },
  },
});

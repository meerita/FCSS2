// @file examples/next-app-router/playwright.config.ts
// @description Playwright configuration for the FCSS Next.js App Router smoke test.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { headless: true },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'next start --port 3001',
    port: 3001,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

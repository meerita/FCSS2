// @file examples/react-vite/playwright.config.ts
// @description Playwright configuration for the FCSS React+Vite production build smoke test.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { headless: true },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm preview --port 4173',
    port: 4173,
    reuseExistingServer: true,
  },
});

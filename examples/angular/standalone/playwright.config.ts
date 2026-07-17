// @file examples/angular/standalone/playwright.config.ts
// @description Playwright configuration for the FCSS Angular standalone production build smoke test.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { headless: true },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx serve dist/standalone -l 4275 --no-clipboard',
    port: 4275,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});

// @file examples/astro/static/playwright.config.ts
// @description Playwright configuration for the FCSS Astro static production build smoke test.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { headless: true, baseURL: 'http://localhost:4323' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Astro's CLI auto-detects AI coding agents and daemonizes `preview`/`dev` in that
    // case (see astro/dist/cli/agent.js); ASTRO_PREVIEW_BACKGROUND opts back into the
    // normal foreground process Playwright's webServer expects.
    command: 'pnpm preview --port 4323',
    port: 4323,
    reuseExistingServer: true,
    env: { ASTRO_PREVIEW_BACKGROUND: '1' },
  },
});

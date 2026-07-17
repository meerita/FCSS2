// @file examples/react-vite/vitest.config.ts
// @description Vitest config — excludes Playwright .spec.ts files picked up by the default glob.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/.git/**', '**/*.spec.ts'],
  },
});

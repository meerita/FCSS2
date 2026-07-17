// @file packages/generator/vitest.config.ts
// @description Vitest configuration for @fcss/generator unit tests.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/__tests__/**/*.test.ts'],
    exclude: ['tests/browser/**'],
    testTimeout: 120000,
  },
});

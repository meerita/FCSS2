// @file packages/core/vitest.config.ts
// @description Vitest configuration for @fcss/core tests.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    testTimeout: 60000,
  },
});

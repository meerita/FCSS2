// @file packages/angular/tests/vitest.config.ts
// @description Vitest configuration for @fcss/angular schematic tests.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});

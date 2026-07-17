// @file packages/vscode/vitest.config.ts
// @description Vitest configuration for @fcss/vscode tests.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    conditions: ['require', 'node', 'default'],
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
});

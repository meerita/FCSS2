// @file eslint.config.mjs
// @description ESLint flat configuration for the FCSS monorepo.
// @layer root
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, {
  ignores: [
    '**/dist/**',
    '**/node_modules/**',
    '**/.next/**',
    '**/out/**',
    'packages/core/src/generated/**',
    // Legacy docs app — moved without modification per Phase 1 constraints
    'apps/docs/**',
  ],
});

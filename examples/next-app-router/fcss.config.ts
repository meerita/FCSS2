// @file examples/next-app-router/fcss.config.ts
// @description FCSS configuration for the Next.js App Router example fixture.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssNextConfig } from '@fcss/next';

const config: FcssNextConfig = {
  content: [
    'app/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '!node_modules/**',
  ],
};

export default config;

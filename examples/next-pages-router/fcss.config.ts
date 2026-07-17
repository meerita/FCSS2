// @file examples/next-pages-router/fcss.config.ts
// @description FCSS configuration for the Next.js Pages Router example fixture.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssNextConfig } from '@fcss/next';

const config: FcssNextConfig = {
  content: [
    'pages/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!node_modules/**',
  ],
};

export default config;

// @file examples/react-vite/fcss.config.ts
// @description FCSS configuration for the React+Vite example fixture.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssViteConfig } from '@fcss/vite';

const config: FcssViteConfig = {
  content: ['src/**/*.{ts,tsx}', '!node_modules/**'],
};

export default config;

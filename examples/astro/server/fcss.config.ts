// @file examples/astro/server/fcss.config.ts
// @description FCSS configuration for the Astro server example fixture.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssViteConfig } from '@fcss/astro';

const config: FcssViteConfig = {
  content: ['src/**/*.astro', '!node_modules/**'],
};

export default config;

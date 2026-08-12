// @file examples/astro/static/fcss.config.ts
// @description FCSS configuration for the Astro static example fixture.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssViteConfig } from '@fcss/astro';

const config: FcssViteConfig = {
  content: ['src/**/*.astro', '!node_modules/**'],
};

export default config;

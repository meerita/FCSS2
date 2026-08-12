// @file examples/astro/static/astro.config.mjs
// @description Astro configuration for the FCSS static (SSG) example fixture.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig } from 'astro/config';
import fcss from '@fcss/astro';

export default defineConfig({
  output: 'static',
  integrations: [fcss()],
});

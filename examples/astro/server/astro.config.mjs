// @file examples/astro/server/astro.config.mjs
// @description Astro configuration for the FCSS server (SSR, Node adapter) example fixture.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import fcss from '@fcss/astro';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [fcss()],
});

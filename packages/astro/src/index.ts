// @file packages/astro/src/index.ts
// @description FCSS Astro integration — registers @fcss/vite's plugin into Astro's Vite config.
// @layer adapters
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import * as url from 'node:url';
import { fcss as viteFcss, loadFcssConfig, type FcssPluginOptions } from '@fcss/vite';
import type { AstroIntegration } from 'astro';

export type { FcssPluginOptions, FcssViteConfig, FcssSafelistPattern } from '@fcss/vite';

// Mirrors @fcss/vite's own default content glob, with .astro added so Astro
// projects get purge coverage out of the box without hand-writing fcss.config.ts.
const ASTRO_DEFAULT_CONTENT = [
  'src/**/*.{html,js,jsx,ts,tsx,astro}',
  '!node_modules/**',
  '!dist/**',
];

export function fcss(options?: FcssPluginOptions): AstroIntegration {
  return {
    name: '@fcss/astro',
    hooks: {
      'astro:config:setup': async ({ config, updateConfig }) => {
        const root = url.fileURLToPath(config.root);
        const { config: userConfig } = await loadFcssConfig(root);

        // Respect an explicit `content` in the project's fcss.config.ts or in
        // options passed directly to this integration — only fall back to the
        // Astro-aware default when neither supplies one.
        const hasExplicitContent =
          userConfig.content !== undefined || options?.config?.content !== undefined;

        const pluginOptions: FcssPluginOptions = hasExplicitContent
          ? (options ?? {})
          : { ...options, config: { ...options?.config, content: ASTRO_DEFAULT_CONTENT } };

        updateConfig({
          vite: {
            plugins: [viteFcss(pluginOptions)],
          },
        });
      },
    },
  };
}

export default fcss;

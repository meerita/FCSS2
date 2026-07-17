// @file examples/angular/workspace/fcss-purge.mjs
// @description Post-build FCSS purge for app1 — removes unused utility classes from the production CSS bundle.
// @layer config
// @created Diego Lafuente <diego.lafuente@cognativinc.com>
/* global process, console */

import { createRequire } from 'module';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const require = createRequire(import.meta.url);
const manifestPath = require.resolve('@fcss/core/manifest.json');

const { default: postcss } = await import('postcss');
const { default: fcssPostcss } = await import('@fcss/postcss');

const distDir = process.argv[2] ?? 'dist/app1';
const contentPatterns = ['projects/app1/src/**/*.{ts,html}'];

const cssFiles = readdirSync(distDir).filter((f) => f.endsWith('.css'));

if (cssFiles.length === 0) {
  console.warn(`[@fcss/angular] No CSS files found in "${distDir}". Run ng build app1 first.`);
  process.exit(1);
}

for (const file of cssFiles) {
  const filePath = join(distDir, file);
  const css = readFileSync(filePath, 'utf-8');

  const result = await postcss([
    fcssPostcss({
      manifest: manifestPath,
      content: contentPatterns,
      report: true,
    }),
  ]).process(css, { from: filePath, to: filePath });

  writeFileSync(filePath, result.css, 'utf-8');
}

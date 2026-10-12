// @file packages/cli/src/commands/purge.ts
// @description fcss purge — scans source files and removes unused utilities from CSS.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import * as fs from 'node:fs';
import * as path from 'node:path';
import postcss from 'postcss';
import fcssPostcss from '@functionalcss/postcss';
import type { FcssPostcssOptions } from '@functionalcss/postcss';
import type { FcssConfig } from '../config/schema.js';

export interface PurgeOptions {
  input: string;
  output: string;
  reportJson?: string;
  cwd?: string;
}

function findCoreManifest(from: string): string | undefined {
  let dir = from;
  for (;;) {
    const candidate = path.join(dir, 'node_modules/@functionalcss/core/dist/manifest.json');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
}

export async function runPurge(config: FcssConfig, options: PurgeOptions): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const inputPath = path.resolve(cwd, options.input);
  const outputPath = path.resolve(cwd, options.output);

  // The core manifest lists every utility; `fcss build` adds custom ones (colors) on top.
  // Walks up node_modules like the Vite and Next.js plugins do, independent of NODE_PATH.
  const coreManifest = findCoreManifest(cwd);
  if (!coreManifest) {
    throw new Error(
      '[fcss] Cannot find @functionalcss/core. Install it in this project: npm install @functionalcss/core',
    );
  }
  const customManifest = path.resolve(cwd, '.fcss/manifest.json');
  const manifests = fs.existsSync(customManifest) ? [coreManifest, customManifest] : [coreManifest];
  if (!fs.existsSync(inputPath)) {
    throw new Error(`[fcss] Input CSS not found: "${inputPath}"`);
  }

  const inputCss = fs.readFileSync(inputPath, 'utf8');
  const content = config.content ?? [];

  const safelistExact = config.safelist?.filter((s): s is string => typeof s === 'string') ?? [];
  const safelistPatterns =
    config.safelist
      ?.filter((s): s is { pattern: RegExp } => typeof s === 'object' && 'pattern' in s)
      .map((s) => s.pattern) ?? [];

  const pluginOpts: FcssPostcssOptions = {
    manifest: manifests,
    content,
    cwd,
  };

  if (safelistExact.length > 0 || safelistPatterns.length > 0) {
    pluginOpts.safelist = { exact: safelistExact, patterns: safelistPatterns };
  }

  if (options.reportJson) {
    pluginOpts.report = 'json';
    pluginOpts.reportPath = options.reportJson;
  } else {
    pluginOpts.report = true;
  }

  const result = await postcss([fcssPostcss(pluginOpts)]).process(inputCss, {
    from: inputPath,
    to: outputPath,
  });

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, result.css, 'utf8');
  console.log(`[fcss] Purge complete → ${outputPath}`);
}

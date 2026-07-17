// @file packages/cli/src/commands/purge.ts
// @description fcss purge — scans source files and removes unused utilities from CSS.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import * as fs from 'node:fs';
import * as path from 'node:path';
import postcss from 'postcss';
import fcssPostcss from '@fcss/postcss';
import type { FcssPostcssOptions } from '@fcss/postcss';
import type { FcssConfig } from '../config/schema.js';

export interface PurgeOptions {
  input: string;
  output: string;
  reportJson?: string;
  cwd?: string;
}

export async function runPurge(config: FcssConfig, options: PurgeOptions): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const manifestPath = path.resolve(cwd, '.fcss/manifest.json');
  const inputPath = path.resolve(cwd, options.input);
  const outputPath = path.resolve(cwd, options.output);

  if (!fs.existsSync(manifestPath)) {
    throw new Error(`[fcss] No manifest found at "${manifestPath}". Run "fcss build" first.`);
  }
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
    manifest: manifestPath,
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

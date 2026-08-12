// @file packages/scanner/src/index.ts
// @description FCSS class name scanner — static analysis of source files to discover used utilities.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import * as fs from 'node:fs';
import * as path from 'node:path';
import { discoverFiles } from './discover.js';
import { extractFromHtml } from './extractors/html.js';
import { extractFromJsx } from './extractors/jsx.js';
import { extractFromAngular } from './extractors/angular.js';
import { extractFromAstro } from './extractors/astro.js';
import { applySafelist } from './safelist.js';
import { buildReport } from './report.js';
import type { DynamicWarning } from './extractors/types.js';
import type { SafelistOptions } from './safelist.js';

export type { DynamicWarning } from './extractors/types.js';
export type { ScanReport } from './report.js';
export type { SafelistOptions } from './safelist.js';

export interface ManifestEntry {
  className: string;
  selector: string;
}

export interface ScanOptions {
  content: string[];
  manifest: ManifestEntry[];
  safelist?: SafelistOptions;
  cwd?: string;
}

export interface ScanResult {
  usedClasses: Set<string>;
  report: import('./report.js').ScanReport;
}

const HTML_EXTS = new Set(['.html', '.htm']);
const JSX_EXTS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const ANGULAR_COMPONENT_EXTS = new Set(['.ts']);
const ASTRO_EXTS = new Set(['.astro']);

function isAngularTemplate(filePath: string): boolean {
  return filePath.endsWith('.component.html');
}

function isAngularComponent(filePath: string): boolean {
  return (
    ANGULAR_COMPONENT_EXTS.has(path.extname(filePath)) &&
    (filePath.endsWith('.component.ts') || filePath.endsWith('.module.ts'))
  );
}

function extractFromFile(
  filePath: string,
  source: string,
): { classes: Set<string>; warnings: DynamicWarning[] } {
  const ext = path.extname(filePath).toLowerCase();

  if (isAngularTemplate(filePath) || (HTML_EXTS.has(ext) && !isAngularComponent(filePath))) {
    return extractFromAngular(source);
  }

  if (ASTRO_EXTS.has(ext)) {
    return extractFromAstro(source, filePath);
  }

  if (JSX_EXTS.has(ext)) {
    return extractFromJsx(source, filePath);
  }

  if (HTML_EXTS.has(ext)) {
    return extractFromHtml(source);
  }

  return { classes: new Set(), warnings: [] };
}

export async function scan(options: ScanOptions): Promise<ScanResult> {
  const { content, manifest, safelist, cwd = process.cwd() } = options;

  if (content.length === 0) {
    throw new Error(
      '[@fcss/scanner] No content patterns provided. ' +
        'Configure the "content" option with glob patterns pointing to your source files.',
    );
  }

  const files = await discoverFiles({ patterns: content, cwd });

  if (files.length === 0) {
    throw new Error(
      `[@fcss/scanner] No files matched the content patterns: ${content.join(', ')}. ` +
        'Verify the patterns are correct and point to your source files.',
    );
  }

  // Build a Set of all FCSS class names from the manifest for O(1) lookup
  const allFcssClasses = new Set(manifest.map((e) => e.className));

  const usedClasses = new Set<string>();
  const allWarnings: DynamicWarning[] = [];

  for (const filePath of files) {
    let source: string;
    try {
      source = fs.readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }

    const { classes, warnings } = extractFromFile(filePath, source);
    allWarnings.push(...warnings);

    for (const cls of classes) {
      if (allFcssClasses.has(cls)) {
        usedClasses.add(cls);
      }
    }
  }

  const { safelistedClasses, warnings: safelistWarnings } = applySafelist(
    allFcssClasses,
    safelist,
    allFcssClasses,
  );

  for (const warning of safelistWarnings) {
    console.warn(warning);
  }

  for (const cls of safelistedClasses) {
    usedClasses.add(cls);
  }

  const report = buildReport(files.length, usedClasses, safelistedClasses.size, allWarnings);

  return { usedClasses, report };
}

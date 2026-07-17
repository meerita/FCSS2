// @file packages/scanner/src/discover.ts
// @description File discovery using glob patterns for the FCSS scanner.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { glob } from 'fast-glob';

export interface DiscoverOptions {
  patterns: string[];
  cwd?: string;
  ignore?: string[];
}

export async function discoverFiles(options: DiscoverOptions): Promise<string[]> {
  const { patterns, cwd = process.cwd(), ignore = ['**/node_modules/**', '**/.git/**'] } = options;

  if (patterns.length === 0) return [];

  const files = await glob(patterns, {
    cwd,
    absolute: true,
    ignore,
    onlyFiles: true,
    followSymbolicLinks: false,
  });

  return files.sort();
}

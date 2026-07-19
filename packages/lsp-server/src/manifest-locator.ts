// @file packages/lsp-server/src/manifest-locator.ts
// @description Locates node_modules/@fcss/core/dist/manifest.json from LSP workspace root URIs.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import * as fs from 'node:fs';
import * as path from 'node:path';
import { URL } from 'node:url';

const MANIFEST_REL = path.join('node_modules', '@fcss', 'core', 'dist', 'manifest.json');

export function findManifestPath(workspaceFolderUris: string[]): string | undefined {
  for (const uri of workspaceFolderUris) {
    let root: string;
    try {
      root = new URL(uri).pathname;
    } catch {
      continue;
    }
    const candidate = path.resolve(root, MANIFEST_REL);
    if (!isWithinRoot(candidate, root)) continue;
    if (fs.existsSync(candidate)) return candidate;
  }
  return undefined;
}

export function isWithinRoot(candidate: string, root: string): boolean {
  const resolvedCandidate = path.resolve(candidate);
  const resolvedRoot = path.resolve(root);
  return (
    resolvedCandidate === resolvedRoot || resolvedCandidate.startsWith(resolvedRoot + path.sep)
  );
}

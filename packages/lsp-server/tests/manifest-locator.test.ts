// @file packages/lsp-server/tests/manifest-locator.test.ts
// @description Unit tests for manifest discovery and path-escape guard.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, afterAll } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { findManifestPath, isWithinRoot } from '../src/manifest-locator';

const tmpdirs: string[] = [];

afterAll(() => {
  for (const d of tmpdirs) {
    fs.rmSync(d, { recursive: true, force: true });
  }
});

function mktmp(): string {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'fcss-lsp-test-'));
  tmpdirs.push(d);
  return d;
}

function createWorkspace(withManifest: boolean): { dir: string; uri: string } {
  const dir = mktmp();
  if (withManifest) {
    const manifestDir = path.join(dir, 'node_modules', '@fcss', 'core', 'dist');
    fs.mkdirSync(manifestDir, { recursive: true });
    fs.writeFileSync(path.join(manifestDir, 'manifest.json'), '[]');
  }
  return { dir, uri: pathToFileURL(dir).href };
}

describe('findManifestPath', () => {
  it('finds the manifest when it exists in the workspace', () => {
    const { dir, uri } = createWorkspace(true);
    const result = findManifestPath([uri]);
    const expected = path.join(dir, 'node_modules', '@fcss', 'core', 'dist', 'manifest.json');
    expect(result).toBe(expected);
  });

  it('returns undefined when the manifest does not exist', () => {
    const { uri } = createWorkspace(false);
    expect(findManifestPath([uri])).toBeUndefined();
  });

  it('returns undefined for an empty workspace list', () => {
    expect(findManifestPath([])).toBeUndefined();
  });

  it('finds the manifest in the first matching workspace', () => {
    const empty = createWorkspace(false);
    const withManifest = createWorkspace(true);
    const result = findManifestPath([empty.uri, withManifest.uri]);
    expect(result).toContain('manifest.json');
  });

  it('skips workspaces with invalid URIs', () => {
    const { uri } = createWorkspace(true);
    const result = findManifestPath(['not-a-valid-uri', uri]);
    expect(result).toContain('manifest.json');
  });
});

describe('isWithinRoot', () => {
  it('returns true when candidate is inside the root', () => {
    expect(isWithinRoot('/workspace/node_modules/pkg/file.json', '/workspace')).toBe(true);
  });

  it('returns true when candidate equals the root', () => {
    expect(isWithinRoot('/workspace', '/workspace')).toBe(true);
  });

  it('returns false for path traversal above root', () => {
    expect(isWithinRoot('/workspace/../secret/file.json', '/workspace')).toBe(false);
  });

  it('returns false for a completely different root', () => {
    expect(isWithinRoot('/other/file.json', '/workspace')).toBe(false);
  });

  it('returns false when candidate shares the root as a prefix but is not inside it', () => {
    // /workspace-extra should NOT be inside /workspace
    expect(isWithinRoot('/workspace-extra/file.json', '/workspace')).toBe(false);
  });
});

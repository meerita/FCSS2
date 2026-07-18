// @file packages/lsp-server/tests/server-initialize.test.ts
// @description Smoke test: manifest discovery → load → index pipeline with a fixture manifest.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, afterAll } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { findManifestPath } from '../src/manifest-locator';
import { loadManifestFromPath, createManifestIndex } from '@fcss/language-service';

const FIXTURE_MANIFEST = [
  {
    className: 'bg-red',
    selector: '.bg-red',
    property: 'background',
    value: 'red',
    category: 'color',
    source: 'fcss',
  },
  {
    className: 'text-sm',
    selector: '.text-sm',
    property: 'font-size',
    value: '0.875rem',
    category: 'typography',
    source: 'fcss',
  },
];

const tmpdirs: string[] = [];

afterAll(() => {
  for (const d of tmpdirs) {
    fs.rmSync(d, { recursive: true, force: true });
  }
});

function createFixtureWorkspace(): { dir: string; uri: string; manifestPath: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fcss-init-test-'));
  tmpdirs.push(dir);
  const manifestDir = path.join(dir, 'node_modules', '@fcss', 'core', 'dist');
  fs.mkdirSync(manifestDir, { recursive: true });
  const manifestPath = path.join(manifestDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(FIXTURE_MANIFEST));
  return { dir, uri: pathToFileURL(dir).href, manifestPath };
}

describe('initialize pipeline smoke test', () => {
  it('discovers, loads, and indexes the manifest from a workspace', () => {
    const { uri, manifestPath } = createFixtureWorkspace();

    const found = findManifestPath([uri]);
    expect(found).toBe(manifestPath);

    const entries = loadManifestFromPath(found!);
    expect(entries).toHaveLength(2);

    const index = createManifestIndex(entries);
    expect(index.byClassName.get('bg-red')).toBeDefined();
    expect(index.byClassName.get('text-sm')).toBeDefined();
    expect(index.byClassName.get('bg-red')?.property).toBe('background');
    expect(index.properties).toContain('background');
    expect(index.properties).toContain('font-size');
  });

  it('returns undefined from findManifestPath when workspace has no manifest', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fcss-empty-test-'));
    tmpdirs.push(dir);
    const uri = pathToFileURL(dir).href;
    expect(findManifestPath([uri])).toBeUndefined();
  });
});

// @file packages/core/tests/tarball.test.ts
// @description Verifies that npm pack includes only expected files (no source TS).
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as child_process from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgDir = path.resolve(__dirname, '..');

let tarballFiles: string[] = [];

beforeAll(() => {
  // npm pack --dry-run --json lists files without writing a tarball
  const result = child_process.spawnSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: pkgDir,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(`npm pack --dry-run failed: ${result.stderr}`);
  }
  const output = JSON.parse(result.stdout) as Array<{ files: Array<{ path: string }> }>;
  tarballFiles = (output[0]?.files ?? []).map((f) => f.path);
}, 60000);

afterAll(() => {
  // Clean up any .tgz files that might have been created
  const tgz = fs.readdirSync(pkgDir).filter((f) => f.endsWith('.tgz'));
  for (const f of tgz) {
    fs.unlinkSync(path.join(pkgDir, f));
  }
});

describe('tarball contents', () => {
  it('tarball file list is non-empty', () => {
    expect(tarballFiles.length).toBeGreaterThan(0);
  });

  it('no TypeScript source files (.ts or .tsx) included (declaration .d.ts allowed)', () => {
    // .d.ts declaration files are fine; raw .ts source files are not
    const tsFiles = tarballFiles.filter(
      (f) => f.endsWith('.ts') && !f.endsWith('.d.ts') && !f.endsWith('.d.ts.map'),
    );
    expect(tsFiles, `TypeScript files in tarball: ${tsFiles.join(', ')}`).toHaveLength(0);
  });

  it('no build scripts in tarball', () => {
    const scriptFiles = tarballFiles.filter((f) => f.includes('dist/scripts/'));
    expect(scriptFiles, `build scripts in tarball: ${scriptFiles.join(', ')}`).toHaveLength(0);
  });

  it('no node_modules in tarball', () => {
    const nodeModules = tarballFiles.filter((f) => f.includes('node_modules'));
    expect(nodeModules).toHaveLength(0);
  });

  it('dist files are included', () => {
    const distFiles = tarballFiles.filter((f) => f.startsWith('dist/'));
    expect(distFiles.length).toBeGreaterThan(0);
  });

  it('includes dist/full.css', () => {
    expect(tarballFiles.some((f) => f === 'dist/full.css' || f.endsWith('/full.css'))).toBe(true);
  });

  it('includes dist/manifest.json', () => {
    expect(
      tarballFiles.some((f) => f === 'dist/manifest.json' || f.endsWith('/manifest.json')),
    ).toBe(true);
  });

  it('includes package.json', () => {
    expect(tarballFiles.some((f) => f === 'package.json')).toBe(true);
  });
});

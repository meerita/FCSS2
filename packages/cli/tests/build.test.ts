// @file packages/cli/tests/build.test.ts
// @description Integration tests for fcss build command.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { runBuild } from '../src/commands/build.js';

describe('runBuild', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fcss-build-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('creates .fcss/generated.css and manifest.json', async () => {
    await runBuild({}, tmpDir);
    expect(fs.existsSync(path.join(tmpDir, '.fcss', 'generated.css'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, '.fcss', 'manifest.json'))).toBe(true);
  });

  it('generates custom color token variables', async () => {
    await runBuild({ colors: { brand: '#7557ff', accent: '#ff5733' } }, tmpDir);
    const css = fs.readFileSync(path.join(tmpDir, '.fcss', 'generated.css'), 'utf8');
    expect(css).toContain('--fcss-color-brand: #7557ff');
    expect(css).toContain('--fcss-color-accent: #ff5733');
  });

  it('generates color utility classes for each color', async () => {
    await runBuild({ colors: { primary: '#123456' } }, tmpDir);
    const css = fs.readFileSync(path.join(tmpDir, '.fcss', 'generated.css'), 'utf8');
    expect(css).toContain('color--primary');
  });

  it('generates custom breakpoint media queries', async () => {
    await runBuild({ breakpoints: { widescreen: { minWidth: 1600 } } }, tmpDir);
    const css = fs.readFileSync(path.join(tmpDir, '.fcss', 'generated.css'), 'utf8');
    expect(css).toContain('1600px');
  });

  it('manifest contains entries for custom colors', async () => {
    await runBuild({ colors: { brand: '#7557ff' } }, tmpDir);
    const manifest = JSON.parse(
      fs.readFileSync(path.join(tmpDir, '.fcss', 'manifest.json'), 'utf8'),
    ) as Array<{ className: string; selector: string; source: string }>;
    expect(manifest.some((e) => e.source === 'custom-colors')).toBe(true);
    expect(manifest.some((e) => e.className.includes('brand'))).toBe(true);
  });

  it('creates output directory if it does not exist', async () => {
    const nestedDir = path.join(tmpDir, 'nested', 'project');
    fs.mkdirSync(nestedDir, { recursive: true });
    await runBuild({}, nestedDir);
    expect(fs.existsSync(path.join(nestedDir, '.fcss'))).toBe(true);
  });
});

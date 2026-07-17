// @file packages/next/tests/plugin.test.ts
// @description Integration tests for the FCSS Next.js plugin hooks.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { withFcss, loadFcssConfig, resolveManifestPath } from '../src/index.js';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fcss-next-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('withFcss plugin factory', () => {
  it('returns a next config with webpack function', () => {
    const result = withFcss({});
    expect(typeof result.webpack).toBe('function');
  });

  it('preserves existing nextConfig properties', () => {
    const result = withFcss({ reactStrictMode: true, poweredByHeader: false });
    expect(result.reactStrictMode).toBe(true);
    expect(result.poweredByHeader).toBe(false);
  });

  it('calls existing webpack function if provided', () => {
    let called = false;
    const existingWebpack = (cfg: Record<string, unknown>) => {
      called = true;
      return cfg;
    };
    const result = withFcss({ webpack: existingWebpack });
    const fakeConfig = { module: { rules: [] } };
    const options = { dir: tmpDir, dev: true, isServer: false, buildId: 'test' };
    result.webpack(fakeConfig, options);
    expect(called).toBe(true);
  });

  it('does not add a plugin in dev mode', () => {
    const result = withFcss({});
    const fakeConfig = { plugins: [] as unknown[] };
    const options = { dir: tmpDir, dev: true, isServer: false, buildId: 'test' };
    result.webpack(fakeConfig, options);
    expect(fakeConfig.plugins).toHaveLength(0);
  });

  it('does not add a plugin for server builds', () => {
    const result = withFcss({});
    const fakeConfig = { plugins: [] as unknown[] };
    const options = { dir: tmpDir, dev: false, isServer: true, buildId: 'test' };
    result.webpack(fakeConfig, options);
    expect(fakeConfig.plugins).toHaveLength(0);
  });

  it('adds FcssWebpackPlugin for production client builds', () => {
    const result = withFcss({});
    const fakeConfig = { plugins: [] as unknown[] };
    const options = { dir: tmpDir, dev: false, isServer: false, buildId: 'test' };
    result.webpack(fakeConfig, options);
    expect(fakeConfig.plugins).toHaveLength(1);
    const plugin = fakeConfig.plugins[0] as Record<string, unknown>;
    expect(typeof plugin['apply']).toBe('function');
  });
});

describe('loadFcssConfig', () => {
  it('returns empty config when no config file exists', async () => {
    const result = await loadFcssConfig(tmpDir);
    expect(result.config).toEqual({});
    expect(result.configPath).toBe('');
  });

  it('loads a .js config file', async () => {
    const configPath = path.join(tmpDir, 'fcss.config.js');
    fs.writeFileSync(configPath, `export default { content: ['app/**/*.tsx'] };\n`, 'utf8');
    const result = await loadFcssConfig(tmpDir);
    expect(result.config.content).toEqual(['app/**/*.tsx']);
    expect(result.configPath).toBe(configPath);
  });

  it('loads a .mjs config file', async () => {
    const configPath = path.join(tmpDir, 'fcss.config.mjs');
    fs.writeFileSync(
      configPath,
      `export default { content: ['pages/**/*.jsx', '!dist/**'] };\n`,
      'utf8',
    );
    const result = await loadFcssConfig(tmpDir);
    expect(result.config.content).toEqual(['pages/**/*.jsx', '!dist/**']);
  });
});

describe('resolveManifestPath', () => {
  it('finds manifest in direct node_modules', () => {
    const manifestDir = path.join(tmpDir, 'node_modules/@fcss/core/dist');
    fs.mkdirSync(manifestDir, { recursive: true });
    const manifestFile = path.join(manifestDir, 'manifest.json');
    fs.writeFileSync(manifestFile, '[]', 'utf8');

    const result = resolveManifestPath(tmpDir);
    expect(result).toBe(manifestFile);
  });

  it('finds manifest in parent node_modules (hoisted)', () => {
    const parentDir = path.join(tmpDir, 'parent');
    const childDir = path.join(parentDir, 'child');
    fs.mkdirSync(childDir, { recursive: true });

    const manifestDir = path.join(parentDir, 'node_modules/@fcss/core/dist');
    fs.mkdirSync(manifestDir, { recursive: true });
    const manifestFile = path.join(manifestDir, 'manifest.json');
    fs.writeFileSync(manifestFile, '[]', 'utf8');

    const result = resolveManifestPath(childDir);
    expect(result).toBe(manifestFile);
  });

  it('throws when manifest is not found', () => {
    expect(() => resolveManifestPath(tmpDir)).toThrow('@fcss/next');
  });
});

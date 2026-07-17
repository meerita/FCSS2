// @file packages/vite/tests/plugin.test.ts
// @description Integration tests for the FCSS Vite plugin hooks.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { fcss, loadFcssConfig, resolveManifestPath, collectDynamicWarnings } from '../src/index.js';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fcss-vite-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('fcss plugin factory', () => {
  it('returns a plugin with the correct name', () => {
    const plugin = fcss();
    expect(plugin.name).toBe('vite-plugin-fcss');
  });

  it('enforce is "pre" — purge runs before CSS minification', () => {
    const plugin = fcss();
    expect(plugin.enforce).toBe('pre');
  });

  it('exposes all required hooks', () => {
    const plugin = fcss();
    expect(typeof plugin.configResolved).toBe('function');
    expect(typeof plugin.buildStart).toBe('function');
    expect(typeof plugin.transform).toBe('function');
    expect(typeof plugin.handleHotUpdate).toBe('function');
    expect(typeof plugin.configureServer).toBe('function');
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
    fs.writeFileSync(configPath, `export default { content: ['src/**/*.tsx'] };\n`, 'utf8');
    const result = await loadFcssConfig(tmpDir);
    expect(result.config.content).toEqual(['src/**/*.tsx']);
    expect(result.configPath).toBe(configPath);
  });

  it('loads a .mjs config file', async () => {
    const configPath = path.join(tmpDir, 'fcss.config.mjs');
    fs.writeFileSync(
      configPath,
      `export default { content: ['src/**/*.jsx', '!dist/**'] };\n`,
      'utf8',
    );
    const result = await loadFcssConfig(tmpDir);
    expect(result.config.content).toEqual(['src/**/*.jsx', '!dist/**']);
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
    expect(() => resolveManifestPath(tmpDir)).toThrow('@fcss/vite');
  });
});

describe('collectDynamicWarnings', () => {
  it('returns empty array for static className', () => {
    const source = `<div className="display--flex padding--16" />`;
    expect(collectDynamicWarnings(source, 'file.tsx')).toHaveLength(0);
  });

  it('detects dynamic template literal in className', () => {
    const source = `<div className={\`display--flex \${isActive ? 'opacity--1' : 'opacity--0'}\`} />`;
    const warnings = collectDynamicWarnings(source, 'file.tsx');
    expect(warnings).toHaveLength(1);
    expect(warnings[0]?.file).toBe('file.tsx');
    expect(warnings[0]?.line).toBe(1);
  });

  it('detects multiple dynamic fragments', () => {
    const source = [
      `<div className={\`display--flex \${a}\`} />`,
      `<span className={\`color--black \${b}\`} />`,
    ].join('\n');
    const warnings = collectDynamicWarnings(source, 'comp.tsx');
    expect(warnings).toHaveLength(2);
    expect(warnings[0]?.line).toBe(1);
    expect(warnings[1]?.line).toBe(2);
  });

  it('does not warn on static template literals without ${', () => {
    const source = 'const cls = `display--flex padding--16`;';
    expect(collectDynamicWarnings(source, 'f.ts')).toHaveLength(0);
  });
});

describe('transform — CSS purge (production)', () => {
  it('purges unused FCSS classes from an @fcss/core CSS asset', async () => {
    // Minimal manifest with two classes
    const manifestDir = path.join(tmpDir, 'node_modules/@fcss/core/dist');
    fs.mkdirSync(manifestDir, { recursive: true });
    const manifest = [
      { className: 'display--flex', selector: '.display--flex' },
      { className: 'display--none', selector: '.display--none' },
    ];
    fs.writeFileSync(path.join(manifestDir, 'manifest.json'), JSON.stringify(manifest), 'utf8');

    // Source file using only display--flex
    const srcDir = path.join(tmpDir, 'src');
    fs.mkdirSync(srcDir);
    fs.writeFileSync(path.join(srcDir, 'App.tsx'), `<div className="display--flex" />`, 'utf8');

    // CSS containing both classes
    const css = `.display--flex { display: flex }\n.display--none { display: none }`;
    const cssId = path.join(tmpDir, 'node_modules/@fcss/core/dist/full.css');
    fs.writeFileSync(cssId, css, 'utf8');

    const plugin = fcss();
    const fakeConfig = {
      root: tmpDir,
      command: 'build' as const,
      mode: 'production',
    };

    await (plugin.configResolved as (...args: unknown[]) => unknown)(fakeConfig);
    await (plugin.buildStart as (...args: unknown[]) => unknown).call({ warn: () => {} });

    const result = await (plugin.transform as (...args: unknown[]) => unknown)(css, cssId);

    expect(result).not.toBeNull();
    expect(result.code).toContain('display--flex');
    expect(result.code).not.toContain('display--none');
  });

  it('returns null for non-FCSS CSS files', async () => {
    const plugin = fcss();
    const fakeConfig = {
      root: tmpDir,
      command: 'build' as const,
      mode: 'production',
    };
    await (plugin.configResolved as (...args: unknown[]) => unknown)(fakeConfig);

    const result = await (plugin.transform as (...args: unknown[]) => unknown)(
      '.foo { color: red }',
      '/app/style.css',
    );
    expect(result).toBeNull();
  });
});

// @file packages/astro/tests/integration.test.ts
// @description Unit tests for the @fcss/astro integration factory.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import * as url from 'node:url';

const { fcssPluginMock } = vi.hoisted(() => ({
  fcssPluginMock: vi.fn((opts?: unknown) => ({ name: 'vite-plugin-fcss', __opts: opts })),
}));

vi.mock('@fcss/vite', async () => {
  const actual = await vi.importActual<typeof import('@fcss/vite')>('@fcss/vite');
  return { ...actual, fcss: fcssPluginMock };
});

import { fcss } from '../src/index.js';

let tmpDir: string;

beforeEach(() => {
  fcssPluginMock.mockClear();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fcss-astro-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function fakeHookContext(overrides: { updateConfig: (cfg: unknown) => unknown }) {
  return {
    config: { root: url.pathToFileURL(tmpDir + path.sep) },
    command: 'build' as const,
    isRestart: false,
    updateConfig: overrides.updateConfig,
    addRenderer: vi.fn(),
    addWatchFile: vi.fn(),
    injectScript: vi.fn(),
    injectRoute: vi.fn(),
    addClientDirective: vi.fn(),
    addDevToolbarApp: vi.fn(),
    addMiddleware: vi.fn(),
    createCodegenDir: vi.fn(),
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
}

describe('fcss() integration factory', () => {
  it('returns an AstroIntegration with the correct name and hook shape', () => {
    const integration = fcss();
    expect(integration.name).toBe('@fcss/astro');
    expect(typeof integration.hooks['astro:config:setup']).toBe('function');
  });

  it('calls updateConfig with the @fcss/vite plugin in astro:config:setup', async () => {
    const updateConfig = vi.fn();
    const integration = fcss();
    const hook = integration.hooks['astro:config:setup'];
    await hook?.(fakeHookContext({ updateConfig }));

    expect(updateConfig).toHaveBeenCalledTimes(1);
    const [arg] = updateConfig.mock.calls[0] as [{ vite: { plugins: unknown[] } }];
    expect(arg.vite.plugins).toHaveLength(1);
    expect(fcssPluginMock).toHaveBeenCalledTimes(1);
    expect(arg.vite.plugins[0]).toBe(fcssPluginMock.mock.results[0]?.value);
  });

  it('supplies the Astro-aware default content glob when no config sets content', async () => {
    const updateConfig = vi.fn();
    const integration = fcss();
    const hook = integration.hooks['astro:config:setup'];
    await hook?.(fakeHookContext({ updateConfig }));

    const [opts] = fcssPluginMock.mock.calls[0] as [{ config?: { content?: string[] } }];
    expect(opts.config?.content).toEqual([
      'src/**/*.{html,js,jsx,ts,tsx,astro}',
      '!node_modules/**',
      '!dist/**',
    ]);
  });

  it('does not override an explicit content option passed to the integration', async () => {
    const updateConfig = vi.fn();
    const integration = fcss({ config: { content: ['custom/**/*.astro'] } });
    const hook = integration.hooks['astro:config:setup'];
    await hook?.(fakeHookContext({ updateConfig }));

    const [opts] = fcssPluginMock.mock.calls[0] as [{ config?: { content?: string[] } }];
    expect(opts.config?.content).toEqual(['custom/**/*.astro']);
  });

  it('does not override an explicit content set in the project fcss.config.ts', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'fcss.config.js'),
      `export default { content: ['app/**/*.astro'] };\n`,
      'utf8',
    );

    const updateConfig = vi.fn();
    const integration = fcss();
    const hook = integration.hooks['astro:config:setup'];
    await hook?.(fakeHookContext({ updateConfig }));

    const [opts] = fcssPluginMock.mock.calls[0] as [{ config?: { content?: string[] } }];
    expect(opts.config?.content).toBeUndefined();
  });
});

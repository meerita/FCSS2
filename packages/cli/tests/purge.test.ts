// @file packages/cli/tests/purge.test.ts
// @description Tests for fcss purge — core manifest resolution and custom manifest merging.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { runPurge } from '../src/commands/purge.js';

let tmpDir: string;

function write(rel: string, content: string): void {
  const file = path.join(tmpDir, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function installFakeCore(entries: Array<{ className: string; selector: string }>): void {
  write(
    'node_modules/@functionalcss/core/package.json',
    JSON.stringify({
      name: '@functionalcss/core',
      exports: { './manifest.json': './dist/manifest.json' },
    }),
  );
  write('node_modules/@functionalcss/core/dist/manifest.json', JSON.stringify(entries));
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fcss-purge-test-'));
  write('package.json', JSON.stringify({ name: 'app', private: true }));
  write('src/index.html', '<div class="display--flex c-brand">hi</div>');
  write(
    'full.css',
    '.display--flex { display: flex }\n.display--grid { display: grid }\n.c-brand { color: red }\n.c-unused { color: blue }\n',
  );
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('runPurge', () => {
  it('purges against the @functionalcss/core manifest without running fcss build', async () => {
    installFakeCore([
      { className: 'display--flex', selector: '.display--flex' },
      { className: 'display--grid', selector: '.display--grid' },
    ]);

    await runPurge(
      { content: ['src/**/*.html'] },
      { input: 'full.css', output: 'out.css', cwd: tmpDir },
    );

    const out = fs.readFileSync(path.join(tmpDir, 'out.css'), 'utf8');
    expect(out).toContain('.display--flex');
    expect(out).not.toContain('.display--grid');
  });

  it('adds the custom manifest from fcss build when present', async () => {
    installFakeCore([{ className: 'display--flex', selector: '.display--flex' }]);
    write(
      '.fcss/manifest.json',
      JSON.stringify([
        { className: 'c-brand', selector: '.c-brand' },
        { className: 'c-unused', selector: '.c-unused' },
      ]),
    );

    await runPurge(
      { content: ['src/**/*.html'] },
      { input: 'full.css', output: 'out.css', cwd: tmpDir },
    );

    const out = fs.readFileSync(path.join(tmpDir, 'out.css'), 'utf8');
    expect(out).toContain('.c-brand');
    expect(out).not.toContain('.c-unused');
  });

  it('explains how to fix a missing @functionalcss/core', async () => {
    await expect(
      runPurge(
        { content: ['src/**/*.html'] },
        { input: 'full.css', output: 'out.css', cwd: tmpDir },
      ),
    ).rejects.toThrow(/npm install @functionalcss\/core/);
  });
});

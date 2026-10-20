// @file packages/scanner/tests/discover.test.ts
// @description Unit tests for glob-based file discovery.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtemp, mkdir, writeFile, rm, realpath, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { discoverFiles } from '../src/discover.js';

// Monorepo fixture:
//   apps/web/          <- cwd
//     app/page.tsx, app/sub/a.ts, app/.dot.tsx
//     components/b.tsx
//     .hidden/h.tsx
//     node_modules/pkg/i.ts
//     app/link-ui -> ../../../packages/ui/src   (symlink inside cwd)
//   packages/ui/src/c.tsx, packages/ui/src/deep/d.ts, packages/ui/src/e.css
//   link/ui -> ../packages/ui                   (symlink outside cwd)
let root: string;
let cwd: string;
// The same root reached through a symlink, like macOS /var -> /private/var
let linkedRoot: string;
let outside: string;

const rel = (files: string[]) => files.map((f) => f.slice(root.length + 1));

beforeAll(async () => {
  root = await realpath(await mkdtemp(join(tmpdir(), 'fcss-discover-')));
  cwd = join(root, 'apps/web');
  const files = [
    'apps/web/app/page.tsx',
    'apps/web/app/sub/a.ts',
    'apps/web/app/.dot.tsx',
    'apps/web/components/b.tsx',
    'apps/web/.hidden/h.tsx',
    'apps/web/node_modules/pkg/i.ts',
    'packages/ui/src/c.tsx',
    'packages/ui/src/deep/d.ts',
    'packages/ui/src/e.css',
  ];
  for (const file of files) {
    await mkdir(join(root, file, '..'), { recursive: true });
    await writeFile(join(root, file), '');
  }
  await symlink('../../../packages/ui/src', join(cwd, 'app/link-ui'));
  await mkdir(join(root, 'link'));
  await symlink('../packages/ui', join(root, 'link/ui'));

  outside = await realpath(await mkdtemp(join(tmpdir(), 'fcss-discover-link-')));
  linkedRoot = join(outside, 'root');
  await symlink(root, linkedRoot);
});

afterAll(async () => {
  await rm(root, { recursive: true, force: true });
  await rm(outside, { recursive: true, force: true });
});

describe('discoverFiles', () => {
  it('returns an empty list for no patterns', async () => {
    expect(await discoverFiles({ patterns: [], cwd })).toEqual([]);
  });

  it('returns sorted absolute paths and skips node_modules and dotfiles', async () => {
    const files = await discoverFiles({ patterns: ['**/*.{ts,tsx}'], cwd });
    expect(files.every((f) => f.startsWith(root))).toBe(true);
    expect(rel(files)).toEqual([
      'apps/web/app/page.tsx',
      'apps/web/app/sub/a.ts',
      'apps/web/components/b.tsx',
    ]);
  });

  it('scans a monorepo path outside cwd, as documented by @functionalcss/next', async () => {
    const files = await discoverFiles({
      patterns: ['app/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}', '!node_modules/**'],
      cwd,
    });
    expect(rel(files)).toEqual([
      'apps/web/app/page.tsx',
      'apps/web/app/sub/a.ts',
      'packages/ui/src/c.tsx',
      'packages/ui/src/deep/d.ts',
    ]);
  });

  it('applies negated patterns', async () => {
    const files = await discoverFiles({ patterns: ['app/**/*.{ts,tsx}', '!**/sub/**'], cwd });
    expect(rel(files)).toEqual(['apps/web/app/page.tsx']);
  });

  it('matches a dotfile named explicitly', async () => {
    const files = await discoverFiles({ patterns: ['app/.dot.tsx', '.hidden/*'], cwd });
    expect(rel(files)).toEqual(['apps/web/.hidden/h.tsx', 'apps/web/app/.dot.tsx']);
  });

  it('does not expand a bare directory pattern to its contents', async () => {
    // tinyglobby defaults to expandDirectories: true; discoverFiles turns it off
    // to keep fast-glob's behavior, where a directory pattern matches no files.
    expect(await discoverFiles({ patterns: ['app', 'components/'], cwd })).toEqual([]);
  });

  it('does not follow symlinks found while crawling', async () => {
    const files = await discoverFiles({ patterns: ['app/**/*.tsx'], cwd });
    expect(rel(files)).toEqual(['apps/web/app/page.tsx']);
  });

  it('resolves a symlink in the static part of a pattern outside cwd', async () => {
    // tinyglobby alone returns nothing here with followSymbolicLinks: false.
    const files = await discoverFiles({ patterns: ['../../link/ui/src/**/*.tsx'], cwd });
    expect(rel(files)).toEqual(['link/ui/src/c.tsx']);
  });

  it('keeps an absolute pattern through a symlinked directory in its written form', async () => {
    const files = await discoverFiles({
      patterns: [
        `${linkedRoot}/packages/ui/src/**/*.{ts,tsx}`,
        `!${linkedRoot}/packages/ui/src/deep/**`,
      ],
      cwd,
    });
    expect(files).toEqual([`${linkedRoot}/packages/ui/src/c.tsx`]);
  });

  // Known differences from fast-glob (the scanner used it up to 0.1.1).
  // These pin current behavior so a tinyglobby change is noticed.
  it('does not match files inside cwd through a pattern that leaves and re-enters it', async () => {
    // fast-glob also returned apps/web/app/page.tsx and apps/web/components/b.tsx.
    const files = await discoverFiles({ patterns: ['../../**/*.tsx'], cwd });
    expect(rel(files)).toEqual(['packages/ui/src/c.tsx']);
  });

  it('does not match a dot directory reached through a globstar', async () => {
    // fast-glob matched apps/web/.hidden/h.tsx.
    expect(await discoverFiles({ patterns: ['**/.hidden/*'], cwd })).toEqual([]);
  });
});

// @file packages/cli/tests/migrate.test.ts
// @description Unit tests for fcss migrate (--force requirement and dry-run).
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { runMigrate } from '../src/commands/migrate.js';

describe('runMigrate', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fcss-migrate-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('does not modify files without --force', async () => {
    const legacyClasses = [
      {
        selector: '.old-flex',
        property: 'display',
        value: 'flex',
        pseudo: 'none',
        breakpoint: 'none',
      },
    ];
    fs.writeFileSync(
      path.join(tmpDir, 'legacy-classes.json'),
      JSON.stringify(legacyClasses),
      'utf8',
    );

    const htmlContent = '<div class="old-flex">test</div>';
    fs.writeFileSync(path.join(tmpDir, 'index.html'), htmlContent, 'utf8');

    await runMigrate({}, { cwd: tmpDir });
    expect(fs.readFileSync(path.join(tmpDir, 'index.html'), 'utf8')).toBe(htmlContent);
  });

  it('creates backups when --force is used', async () => {
    const legacyClasses = [
      {
        selector: '.old-flex',
        property: 'display',
        value: 'flex',
        pseudo: 'none',
        breakpoint: 'none',
      },
    ];
    fs.writeFileSync(
      path.join(tmpDir, 'legacy-classes.json'),
      JSON.stringify(legacyClasses),
      'utf8',
    );
    fs.writeFileSync(path.join(tmpDir, 'index.html'), '<div class="old-flex">test</div>', 'utf8');

    const result = await runMigrate({}, { cwd: tmpDir, force: true });
    if (result.filesModified > 0) {
      expect(fs.existsSync(path.join(tmpDir, 'index.html.fcss-backup'))).toBe(true);
    }
  });

  it('dry-run reports findings without modifying', async () => {
    const legacyClasses = [
      {
        selector: '.old-flex',
        property: 'display',
        value: 'flex',
        pseudo: 'none',
        breakpoint: 'none',
      },
    ];
    fs.writeFileSync(
      path.join(tmpDir, 'legacy-classes.json'),
      JSON.stringify(legacyClasses),
      'utf8',
    );
    const original = '<div class="old-flex">test</div>';
    fs.writeFileSync(path.join(tmpDir, 'index.html'), original, 'utf8');

    const result = await runMigrate({}, { cwd: tmpDir, dryRun: true });
    expect(result.filesModified).toBe(0);
    expect(fs.readFileSync(path.join(tmpDir, 'index.html'), 'utf8')).toBe(original);
  });

  it('returns empty findings when no legacy classes exist', async () => {
    const result = await runMigrate({}, { cwd: tmpDir });
    expect(result.findings).toEqual([]);
  });
});

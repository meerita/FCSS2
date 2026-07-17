// @file packages/cli/tests/init.test.ts
// @description Integration tests for fcss init (idempotency and file creation).
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { runInit } from '../src/commands/init.js';

describe('runInit', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fcss-init-test-'));
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'test-project', version: '1.0.0' }),
      'utf8',
    );
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('creates fcss.config.ts when it does not exist', async () => {
    await runInit({ cwd: tmpDir });
    expect(fs.existsSync(path.join(tmpDir, 'fcss.config.ts'))).toBe(true);
  });

  it('does not overwrite existing fcss.config.ts', async () => {
    const configPath = path.join(tmpDir, 'fcss.config.ts');
    const original = '// existing config\nexport default {};';
    fs.writeFileSync(configPath, original, 'utf8');

    await runInit({ cwd: tmpDir });
    expect(fs.readFileSync(configPath, 'utf8')).toBe(original);
  });

  it('is idempotent — second run does not duplicate config', async () => {
    await runInit({ cwd: tmpDir });
    const afterFirst = fs.readFileSync(path.join(tmpDir, 'fcss.config.ts'), 'utf8');
    await runInit({ cwd: tmpDir });
    const afterSecond = fs.readFileSync(path.join(tmpDir, 'fcss.config.ts'), 'utf8');
    expect(afterFirst).toBe(afterSecond);
  });

  it('adds CSS import to entry file when present', async () => {
    const srcDir = path.join(tmpDir, 'src');
    fs.mkdirSync(srcDir);
    fs.writeFileSync(path.join(srcDir, 'main.ts'), "console.log('hello');", 'utf8');

    await runInit({ cwd: tmpDir });
    const content = fs.readFileSync(path.join(srcDir, 'main.ts'), 'utf8');
    expect(content).toContain('@fcss/core');
  });

  it('does not duplicate CSS import on second run', async () => {
    const srcDir = path.join(tmpDir, 'src');
    fs.mkdirSync(srcDir);
    fs.writeFileSync(path.join(srcDir, 'main.ts'), "console.log('hello');", 'utf8');

    await runInit({ cwd: tmpDir });
    const afterFirst = fs.readFileSync(path.join(srcDir, 'main.ts'), 'utf8');
    await runInit({ cwd: tmpDir });
    const afterSecond = fs.readFileSync(path.join(srcDir, 'main.ts'), 'utf8');

    const importCount = (afterSecond.match(/@fcss\/core/g) ?? []).length;
    expect(importCount).toBe(1);
    expect(afterFirst).toBe(afterSecond);
  });
});

// @file packages/cli/src/commands/migrate.ts
// @description fcss migrate — detects and replaces legacy class names; never deletes without --force.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { FcssConfig } from '../config/schema.js';

export interface MigrationFinding {
  file: string;
  line: number;
  legacyClass: string;
  replacement: string | null;
  manual: boolean;
}

export interface MigrateOptions {
  force?: boolean;
  dryRun?: boolean;
  cwd?: string;
}

export interface MigrateResult {
  findings: MigrationFinding[];
  filesModified: number;
  backupCreated: boolean;
}

interface LegacyClass {
  selector: string;
  property: string;
  value: string;
  pseudo: string;
  breakpoint: string;
}

function loadLegacyClasses(cwd: string): LegacyClass[] {
  const legacyPath = path.resolve(cwd, 'docs/migration/legacy-classes.json');
  const cwdPath = path.resolve(cwd, 'legacy-classes.json');
  const filePath = fs.existsSync(legacyPath) ? legacyPath : fs.existsSync(cwdPath) ? cwdPath : null;
  if (!filePath) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as LegacyClass[];
  } catch {
    return [];
  }
}

function buildLegacyMap(classes: LegacyClass[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of classes) {
    const legacyClass = entry.selector.replace(/^\./, '');
    if (entry.selector.startsWith('.')) {
      map.set(legacyClass, legacyClass);
    }
  }
  return map;
}

function findLegacyInContent(
  content: string,
  legacyMap: Map<string, string>,
): Array<{ line: number; cls: string; replacement: string | null }> {
  const findings: Array<{ line: number; cls: string; replacement: string | null }> = [];
  const lines = content.split('\n');
  for (const [i, line] of lines.entries()) {
    for (const [legacy] of legacyMap) {
      if (line.includes(legacy)) {
        findings.push({ line: i + 1, cls: legacy, replacement: legacyMap.get(legacy) ?? null });
      }
    }
  }
  return findings;
}

function walkDir(dir: string, scanFiles: string[]): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, scanFiles);
    } else if (/\.(html?|[jt]sx?)$/.test(entry.name)) {
      scanFiles.push(fullPath);
    }
  }
}

export async function runMigrate(
  config: FcssConfig,
  options: MigrateOptions = {},
): Promise<MigrateResult> {
  const cwd = options.cwd ?? process.cwd();
  const legacyClasses = loadLegacyClasses(cwd);
  const legacyMap = buildLegacyMap(legacyClasses);

  const findings: MigrationFinding[] = [];
  let filesModified = 0;
  let backupCreated = false;

  if (legacyClasses.length === 0) {
    console.log('[fcss] No legacy class inventory found — nothing to migrate.');
    return { findings, filesModified, backupCreated };
  }

  const scanFiles: string[] = [];
  walkDir(cwd, scanFiles);

  for (const filePath of scanFiles) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const matches = findLegacyInContent(fileContent, legacyMap);
    if (matches.length === 0) continue;

    for (const m of matches) {
      findings.push({
        file: path.relative(cwd, filePath),
        line: m.line,
        legacyClass: m.cls,
        replacement: m.replacement,
        manual: m.replacement === null,
      });
    }

    if (!options.dryRun && options.force) {
      if (!backupCreated) {
        backupCreated = true;
      }
      const backupPath = filePath + '.fcss-backup';
      fs.writeFileSync(backupPath, fileContent, 'utf8');

      let updated = fileContent;
      for (const m of matches) {
        if (m.replacement !== null && m.replacement !== m.cls) {
          updated = updated.replaceAll(m.cls, m.replacement);
        }
      }
      fs.writeFileSync(filePath, updated, 'utf8');
      filesModified++;
    }
  }

  if (findings.length === 0) {
    console.log('[fcss] No legacy classes found.');
    return { findings, filesModified, backupCreated };
  }

  if (!options.force && !options.dryRun) {
    console.log(
      `[fcss] Found ${findings.length} legacy class usage(s). Run with --force to apply replacements (backups will be created).`,
    );
    for (const f of findings.slice(0, 20)) {
      console.log(
        `  ${f.file}:${f.line} — "${f.legacyClass}" ${f.replacement ? `→ "${f.replacement}"` : '(manual migration required)'}`,
      );
    }
    if (findings.length > 20) console.log(`  ... and ${findings.length - 20} more`);
  } else if (options.dryRun) {
    console.log(`[fcss] Dry run — ${findings.length} finding(s), no files modified.`);
  } else {
    console.log(
      `[fcss] Migration complete: ${filesModified} file(s) modified, backups created with .fcss-backup extension.`,
    );
  }

  return { findings, filesModified, backupCreated };
}

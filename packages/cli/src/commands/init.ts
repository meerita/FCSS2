// @file packages/cli/src/commands/init.ts
// @description fcss init — scaffold fcss.config.ts and add CSS imports (idempotent).
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

export type Framework = 'react' | 'next' | 'angular' | 'none';
export type PackageManager = 'pnpm' | 'yarn' | 'npm';

const CONFIG_TEMPLATE = `import { defineConfig } from '@fcss/cli';

export default defineConfig({
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
});
`;

const CSS_IMPORT = `@import '@fcss/core';`;

function detectPackageManager(cwd: string): PackageManager {
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function detectFramework(cwd: string): Framework {
  const pkgPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) return 'none';
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as Record<string, unknown>;
    const deps = {
      ...((pkg['dependencies'] as Record<string, string> | undefined) ?? {}),
      ...((pkg['devDependencies'] as Record<string, string> | undefined) ?? {}),
    };
    if ('next' in deps) return 'next';
    if ('@angular/core' in deps) return 'angular';
    if ('react' in deps || 'react-dom' in deps) return 'react';
  } catch {
    // Unparseable package.json — default to none
  }
  return 'none';
}

function installPackages(pm: PackageManager, packages: string[], cwd: string): void {
  const cmd =
    pm === 'pnpm'
      ? `pnpm add -D ${packages.join(' ')}`
      : pm === 'yarn'
        ? `yarn add -D ${packages.join(' ')}`
        : `npm install -D ${packages.join(' ')}`;
  execSync(cmd, { cwd, stdio: 'inherit' });
}

export interface InitOptions {
  framework?: Framework;
  yes?: boolean;
  cwd?: string;
}

export interface InitResult {
  createdFiles: string[];
  modifiedFiles: string[];
  skippedFiles: string[];
}

export async function runInit(options: InitOptions = {}): Promise<InitResult> {
  const cwd = options.cwd ?? process.cwd();
  const pm = detectPackageManager(cwd);
  const framework = options.framework ?? detectFramework(cwd);

  const result: InitResult = { createdFiles: [], modifiedFiles: [], skippedFiles: [] };

  const configPath = path.join(cwd, 'fcss.config.ts');
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, CONFIG_TEMPLATE, 'utf8');
    result.createdFiles.push('fcss.config.ts');
  } else {
    result.skippedFiles.push('fcss.config.ts (already exists)');
  }

  const packages = ['@fcss/core', '@fcss/cli'];
  if (framework === 'react' || framework === 'next') packages.push('@fcss/vite');
  if (framework === 'next') packages.push('@fcss/next');
  if (framework === 'angular') packages.push('@fcss/angular');

  if (!options.yes) {
    console.log(`[fcss] Will install: ${packages.join(', ')}`);
    console.log(`[fcss] Package manager: ${pm}`);
    console.log(`[fcss] Framework: ${framework}`);
    console.log(`[fcss] Run with --yes to proceed without confirmation.`);
  }

  if (options.yes) {
    try {
      installPackages(pm, packages, cwd);
      result.modifiedFiles.push('package.json');
    } catch (err) {
      console.error(`[fcss] Package install failed: ${String(err)}`);
    }
  }

  // Add CSS import to entry point (idempotent — check before adding)
  const possibleEntries = [
    'src/main.ts',
    'src/main.tsx',
    'src/index.ts',
    'src/index.tsx',
    'src/main.css',
    'src/index.css',
    'src/styles.css',
  ];
  for (const rel of possibleEntries) {
    const entryPath = path.join(cwd, rel);
    if (!fs.existsSync(entryPath)) continue;
    const content = fs.readFileSync(entryPath, 'utf8');
    if (content.includes('@fcss/core')) {
      result.skippedFiles.push(`${rel} (FCSS import already present)`);
      break;
    }
    fs.writeFileSync(entryPath, `${CSS_IMPORT}\n${content}`, 'utf8');
    result.modifiedFiles.push(rel);
    break;
  }

  if (result.createdFiles.length > 0)
    console.log('[fcss] Created:', result.createdFiles.join(', '));
  if (result.modifiedFiles.length > 0)
    console.log('[fcss] Modified:', result.modifiedFiles.join(', '));
  if (result.skippedFiles.length > 0)
    console.log('[fcss] Skipped:', result.skippedFiles.join(', '));

  return result;
}

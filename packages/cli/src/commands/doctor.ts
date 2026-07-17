// @file packages/cli/src/commands/doctor.ts
// @description fcss doctor — checks Node version, package versions, config, and build setup.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import type { FcssConfig } from '../config/schema.js';

export interface HealthCheck {
  name: string;
  status: 'ok' | 'warn' | 'error';
  message: string;
}

export interface DoctorResult {
  checks: HealthCheck[];
  healthy: boolean;
}

function checkNodeVersion(): HealthCheck {
  const [major] = process.versions.node.split('.').map(Number);
  const ok = (major ?? 0) >= 22;
  return {
    name: 'Node.js version',
    status: ok ? 'ok' : 'error',
    message: ok
      ? `Node.js ${process.versions.node} (≥22 required)`
      : `Node.js ${process.versions.node} is below the required minimum of 22`,
  };
}

function checkPackageInstalled(cwd: string, pkg: string): HealthCheck {
  const pkgDir = path.join(cwd, 'node_modules', pkg);
  const exists = fs.existsSync(pkgDir);
  return {
    name: `${pkg} installed`,
    status: exists ? 'ok' : 'error',
    message: exists ? `${pkg} found` : `${pkg} not found — run npm install`,
  };
}

function checkManifest(cwd: string): HealthCheck {
  const manifestPath = path.join(cwd, 'node_modules/@fcss/core/dist/manifest.json');
  const exists = fs.existsSync(manifestPath);
  return {
    name: '@fcss/core manifest',
    status: exists ? 'ok' : 'warn',
    message: exists
      ? 'manifest.json found'
      : 'manifest.json not found — @fcss/core may not be installed',
  };
}

function checkConfigPresent(cwd: string): HealthCheck {
  const files = ['fcss.config.ts', 'fcss.config.js', 'fcss.config.mjs'];
  const found = files.find((f) => fs.existsSync(path.join(cwd, f)));
  return {
    name: 'Config file',
    status: found ? 'ok' : 'warn',
    message: found ? `Config found: ${found}` : 'No fcss.config.ts found — run "fcss init"',
  };
}

function checkContentPaths(config: FcssConfig): HealthCheck {
  const hasContent = config.content && config.content.length > 0;
  return {
    name: 'Content paths',
    status: hasContent ? 'ok' : 'warn',
    message: hasContent
      ? `${config.content!.length} content pattern(s) configured`
      : 'No content patterns configured — purge will not work',
  };
}

function checkDuplicateInstalls(cwd: string): HealthCheck {
  const fcssDir = path.join(cwd, 'node_modules/@fcss');
  if (!fs.existsSync(fcssDir)) {
    return {
      name: 'Duplicate packages',
      status: 'ok',
      message: 'No @fcss packages found in node_modules (install @fcss/core first)',
    };
  }
  let duplicates: string[] = [];
  try {
    const result = execSync('npm ls @fcss/core 2>&1', { cwd, encoding: 'utf8' });
    const lines = result.split('\n').filter((l) => l.includes('@fcss/core'));
    if (lines.length > 1) duplicates = lines;
  } catch {
    // npm ls may fail in non-npm projects — skip
  }
  return {
    name: 'Duplicate packages',
    status: duplicates.length > 1 ? 'warn' : 'ok',
    message:
      duplicates.length > 1
        ? `Multiple @fcss/core installs detected — may cause purge inconsistencies`
        : 'No duplicate @fcss/core installs',
  };
}

export async function runDoctor(config: FcssConfig, cwd = process.cwd()): Promise<DoctorResult> {
  const checks: HealthCheck[] = [
    checkNodeVersion(),
    checkPackageInstalled(cwd, '@fcss/core'),
    checkManifest(cwd),
    checkConfigPresent(cwd),
    checkContentPaths(config),
    checkDuplicateInstalls(cwd),
  ];

  const healthy = checks.every((c) => c.status !== 'error');

  for (const check of checks) {
    const icon = check.status === 'ok' ? '✓' : check.status === 'warn' ? '!' : '✗';
    console.log(`  ${icon} ${check.name}: ${check.message}`);
  }

  return { checks, healthy };
}

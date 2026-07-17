// @file packages/cli/src/commands/audit.ts
// @description fcss audit — static analysis for unknown classes, conflicts, and config issues.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import * as fs from 'node:fs';
import * as path from 'node:path';
import { scan } from '@fcss/scanner';
import { FCSS_PROPERTIES } from '@fcss/spec';
import type { FcssConfig } from '../config/schema.js';

export interface AuditFinding {
  type: 'unknown-class' | 'deprecated-class' | 'conflict' | 'dynamic-fragment' | 'missing-config';
  severity: 'error' | 'warning' | 'info';
  message: string;
  file?: string;
}

export interface AuditResult {
  findings: AuditFinding[];
  scannedFiles: number;
}

export async function runAudit(config: FcssConfig, cwd = process.cwd()): Promise<AuditResult> {
  const manifestPath = path.resolve(cwd, 'node_modules/@fcss/core/dist/manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return {
      findings: [
        {
          type: 'missing-config',
          severity: 'error',
          message:
            'Cannot audit: @fcss/core manifest not found. Run "npm install @fcss/core" first.',
        },
      ],
      scannedFiles: 0,
    };
  }

  const manifestRaw = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as Array<{
    className: string;
    selector: string;
  }>;
  const content = config.content ?? [];

  if (content.length === 0) {
    return {
      findings: [
        {
          type: 'missing-config',
          severity: 'warning',
          message: 'No content patterns configured. Add a "content" field to fcss.config.ts.',
        },
      ],
      scannedFiles: 0,
    };
  }

  const { usedClasses, report } = await scan({ content, manifest: manifestRaw, cwd });
  const findings: AuditFinding[] = [];

  if (report.dynamicWarnings.length > 0) {
    for (const warn of report.dynamicWarnings) {
      findings.push({
        type: 'dynamic-fragment',
        severity: 'warning',
        message: `Dynamic class fragment detected — purge may be unreliable. Fragment: "${warn.fragment}"`,
        file: warn.file,
      });
    }
  }

  const deprecatedSet = new Set(
    FCSS_PROPERTIES.flatMap((p) => p.values)
      .filter((v) => v.deprecated)
      .map((v) => v.classValue),
  );

  for (const cls of usedClasses) {
    if (deprecatedSet.has(cls)) {
      findings.push({
        type: 'deprecated-class',
        severity: 'warning',
        message: `Class "${cls}" is deprecated and will be removed in a future release.`,
      });
    }
  }

  return { findings, scannedFiles: report.filesScanned };
}

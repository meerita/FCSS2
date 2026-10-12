// @file packages/language-service/src/diagnostics.ts
// @description All 7 FCSS diagnostic types: unknown-property, unknown-value, conflict,
//   duplicate, invalid-condition-chain, deprecated-class, dynamic-purge-risk.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { ManifestIndex } from './manifest';
import { parseClass } from './parser';
import { detectConflicts } from './conflict';

export type DiagnosticCode =
  | 'fcss/unknown-property'
  | 'fcss/unknown-value'
  | 'fcss/conflict'
  | 'fcss/duplicate'
  | 'fcss/invalid-condition-chain'
  | 'fcss/deprecated-class'
  | 'fcss/dynamic-purge-risk';

export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export interface DiagnosticItem {
  className: string;
  code: DiagnosticCode;
  severity: DiagnosticSeverity;
  message: string;
  suggestion?: string;
}

// Template literal that contains interpolation AND an FCSS class separator
const TEMPLATE_LITERAL_RE = /`[^`]+`/g;

function findClosestProperty(input: string, properties: string[]): string | undefined {
  const lower = input.toLowerCase();
  return (
    properties.find((p) => p.startsWith(lower)) ??
    properties.find((p) => p.includes(lower)) ??
    undefined
  );
}

export function getDiagnostics(classNames: string[], index: ManifestIndex): DiagnosticItem[] {
  const diagnostics: DiagnosticItem[] = [];
  const seen = new Map<string, number>();

  for (const cls of classNames) {
    seen.set(cls, (seen.get(cls) ?? 0) + 1);
  }

  for (const [cls, count] of seen) {
    if (count > 1) {
      diagnostics.push({
        className: cls,
        code: 'fcss/duplicate',
        severity: 'warning',
        message: `"${cls}" appears ${count} times.`,
      });
    }
  }

  for (const cls of [...seen.keys()]) {
    const token = parseClass(cls);

    if (!token.isValid) {
      if (token.errors.some((e) => e.code === 'INVALID_CONDITION_CHAIN')) {
        diagnostics.push({
          className: cls,
          code: 'fcss/invalid-condition-chain',
          severity: 'error',
          message: `Invalid condition chain in "${cls}". Only one condition (pseudo or ARIA) is allowed.`,
        });
        continue;
      }
      if (token.errors.some((e) => e.code === 'MISSING_SEPARATOR')) {
        continue;
      }
    }

    const entry = index.byClassName.get(cls);

    if (!entry) {
      const propertyEntries = index.byProperty.get(token.property);
      if (!propertyEntries || propertyEntries.length === 0) {
        const suggestion = findClosestProperty(token.property, index.properties);
        diagnostics.push({
          className: cls,
          code: 'fcss/unknown-property',
          severity: 'error',
          message: `Unknown FCSS property "${token.property}" in class "${cls}".`,
          ...(suggestion ? { suggestion: `Did you mean "${suggestion}"?` } : {}),
        });
      } else {
        diagnostics.push({
          className: cls,
          code: 'fcss/unknown-value',
          severity: 'error',
          message: `Unknown value "${token.classValue}" for property "${token.property}" in class "${cls}".`,
          suggestion: `Check the FCSS class list for valid "${token.property}" values.`,
        });
      }
      continue;
    }

    if (entry.deprecated) {
      diagnostics.push({
        className: cls,
        code: 'fcss/deprecated-class',
        severity: 'warning',
        message: `"${cls}" is deprecated.`,
        ...(entry.canonical ? { suggestion: `Use "${entry.canonical}" instead.` } : {}),
      });
    }
  }

  const conflicts = detectConflicts([...seen.keys()], index);
  for (const conflict of conflicts) {
    if (conflict.type === 'conflict') {
      diagnostics.push({
        className: conflict.classA,
        code: 'fcss/conflict',
        severity: 'error',
        message: `"${conflict.classA}" and "${conflict.classB}" both set "${conflict.property}"${conflict.breakpoint ? ` at breakpoint ${conflict.breakpoint}` : ''}${conflict.condition ? ` with condition ${conflict.condition}` : ''}.`,
        suggestion: `Remove one of the conflicting classes.`,
      });
    }
  }

  return diagnostics;
}

export function getSourceDiagnostics(source: string): DiagnosticItem[] {
  const diagnostics: DiagnosticItem[] = [];
  TEMPLATE_LITERAL_RE.lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = TEMPLATE_LITERAL_RE.exec(source)) !== null) {
    const literal = m[0]!;
    const hasDynamicPart = literal.includes('${');
    const hasFcssFragment = literal.includes('--') || /:\$\{/.test(literal);
    if (!hasDynamicPart || !hasFcssFragment) continue;

    const fragment = literal.slice(0, 60);
    diagnostics.push({
      className: fragment,
      code: 'fcss/dynamic-purge-risk',
      severity: 'warning',
      message: `Dynamic FCSS fragment detected: ${fragment}. This may be incorrectly purged.`,
      suggestion: `Replace with a static class map to ensure correct purging.`,
    });
  }

  return diagnostics;
}

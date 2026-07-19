// @file packages/lsp-server/src/handlers/diagnostics.ts
// @description Computes LSP Diagnostics from @fcss/language-service, mapping each item to its real occurrence range.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { Diagnostic, Range } from 'vscode-languageserver';
import { getDiagnostics, getSourceDiagnostics } from '@fcss/language-service';
import type { DiagnosticItem, ManifestIndex } from '@fcss/language-service';
import { mapDiagnosticSeverity } from '../lsp-mapping';
import { extractClassOccurrences, occurrenceToRange, offsetToPosition } from '../class-extraction';

export interface StoredDiagnostic {
  item: DiagnosticItem;
  range: Range;
}

const SOURCE_LANGUAGE_IDS = new Set([
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
]);

function fullDocumentRange(text: string): Range {
  const lines = text.split('\n');
  const lastLine = lines.length - 1;
  return {
    start: { line: 0, character: 0 },
    end: { line: lastLine, character: (lines[lastLine] ?? '').length },
  };
}

function findFragmentRange(text: string, fragment: string): Range {
  const idx = text.indexOf(fragment);
  if (idx < 0) {
    // Whole-document fallback: fragment is a 60-char truncation and could not be located exactly.
    return fullDocumentRange(text);
  }
  return {
    start: offsetToPosition(text, idx),
    end: offsetToPosition(text, idx + fragment.length),
  };
}

function toLspDiagnostic(item: DiagnosticItem, range: Range): Diagnostic {
  const message = item.suggestion ? `${item.message} ${item.suggestion}` : item.message;
  return {
    range,
    severity: mapDiagnosticSeverity(item.severity),
    source: 'FCSS',
    code: item.code,
    message,
  };
}

export function computeDiagnostics(
  text: string,
  languageId: string,
  index: ManifestIndex | null,
): { lspDiagnostics: Diagnostic[]; stored: StoredDiagnostic[] } {
  if (!index) return { lspDiagnostics: [], stored: [] };

  const occurrences = extractClassOccurrences(text);
  const classNames = occurrences.map((o) => o.value);

  const occurrenceRanges = new Map<string, Range[]>();
  for (const occ of occurrences) {
    const range = occurrenceToRange(text, occ);
    const existing = occurrenceRanges.get(occ.value);
    if (existing) {
      existing.push(range);
    } else {
      occurrenceRanges.set(occ.value, [range]);
    }
  }

  const items = getDiagnostics(classNames, index);
  const lspDiagnostics: Diagnostic[] = [];
  const stored: StoredDiagnostic[] = [];

  for (const item of items) {
    const ranges = occurrenceRanges.get(item.className);
    if (ranges && ranges.length > 0) {
      for (const range of ranges) {
        lspDiagnostics.push(toLspDiagnostic(item, range));
        stored.push({ item, range });
      }
    } else {
      // Whole-document fallback: className not found as a standalone token (e.g. inside a template literal).
      const range = fullDocumentRange(text);
      lspDiagnostics.push(toLspDiagnostic(item, range));
      stored.push({ item, range });
    }
  }

  if (SOURCE_LANGUAGE_IDS.has(languageId)) {
    const sourceItems = getSourceDiagnostics(text);
    for (const item of sourceItems) {
      const range = findFragmentRange(text, item.className);
      lspDiagnostics.push(toLspDiagnostic(item, range));
      stored.push({ item, range });
    }
  }

  return { lspDiagnostics, stored };
}

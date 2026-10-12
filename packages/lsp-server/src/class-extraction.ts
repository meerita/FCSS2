// @file packages/lsp-server/src/class-extraction.ts
// @description Range-aware FCSS class occurrence extraction from document text.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { Position, Range } from 'vscode-languageserver';

const CLASS_ATTR_RE = /class(?:Name)?\s*=\s*["']([^"']*)["']/g;
const WORD_RE = /[\w.%:-]+/g;

export interface ClassOccurrence {
  value: string;
  start: number;
  end: number;
}

export function extractClassOccurrences(text: string): ClassOccurrence[] {
  const occurrences: ClassOccurrence[] = [];
  CLASS_ATTR_RE.lastIndex = 0;
  let attrMatch: RegExpExecArray | null;

  while ((attrMatch = CLASS_ATTR_RE.exec(text)) !== null) {
    const fullMatch = attrMatch[0];
    if (fullMatch === undefined) continue;
    const attrValue = attrMatch[1] ?? '';
    // fullMatch ends with: attrValue + closing-quote, so the content starts at:
    const valueStart = attrMatch.index + fullMatch.length - attrValue.length - 1;

    const tokenRe = /\S+/g;
    let tokenMatch: RegExpExecArray | null;
    while ((tokenMatch = tokenRe.exec(attrValue)) !== null) {
      const cls = tokenMatch[0];
      if (cls === undefined) continue;
      const start = valueStart + tokenMatch.index;
      occurrences.push({ value: cls, start, end: start + cls.length });
    }
  }

  return occurrences;
}

export function offsetToPosition(text: string, offset: number): Position {
  const before = text.slice(0, offset);
  const lines = before.split('\n');
  const lineIndex = lines.length - 1;
  const character = (lines[lineIndex] ?? '').length;
  return { line: lineIndex, character };
}

export function occurrenceToRange(text: string, occ: ClassOccurrence): Range {
  return {
    start: offsetToPosition(text, occ.start),
    end: offsetToPosition(text, occ.end),
  };
}

export function isInsideClassAttribute(text: string, offset: number): boolean {
  CLASS_ATTR_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = CLASS_ATTR_RE.exec(text)) !== null) {
    const fullMatch = match[0] ?? '';
    const attrValue = match[1] ?? '';
    const contentStart = match.index + fullMatch.length - attrValue.length - 1;
    const contentEnd = contentStart + attrValue.length;
    if (contentStart <= offset && offset <= contentEnd) return true;
  }
  return false;
}

export function wordAtCursor(text: string, offset: number): string | null {
  WORD_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = WORD_RE.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (start <= offset && offset <= end) return match[0];
  }
  return null;
}

export function wordBeforeCursor(text: string, offset: number): string {
  WORD_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = WORD_RE.exec(text)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (start <= offset && offset <= end) return text.slice(start, offset);
  }
  return '';
}

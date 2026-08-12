// @file packages/scanner/src/extractors/astro.ts
// @description Extracts FCSS class names from Astro (.astro) template markup.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { splitClassString } from '../normalize.js';
import type { DynamicWarning, ExtractionResult } from './types.js';

// class="..." or class='...' (handles multi-line attributes via [\s\S])
const CLASS_ATTR_RE = /class\s*=\s*(?:"([^"]*?)"|'([^']*?)')/gs;

// The opening brace of an Astro class:list={...} expression container.
const CLASS_LIST_OPEN_RE = /class:list\s*=\s*\{/g;

const QUOTED_STRING_RE = /"([^"\\]*)"|'([^'\\]*)'/g;
const TEMPLATE_LITERAL_RE = /`([^`]*)`/g;
const OBJECT_KEY_RE = /(?:'([^'\\]+)'|"([^"\\]+)")\s*:/g;

function lineAt(source: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < source.length; i++) {
    if (source[i] === '\n') line++;
  }
  return line;
}

// Scans past a quoted/template string starting at `start`, returning the index
// of its closing quote, so callers counting brackets/commas ignore its contents.
function skipStringLiteral(source: string, start: number, quote: string): number {
  let i = start + 1;
  while (i < source.length) {
    if (source[i] === '\\') {
      i += 2;
      continue;
    }
    if (source[i] === quote) return i;
    i++;
  }
  return i;
}

// Finds the index of the '}' matching the '{' at openIndex.
function findMatchingBrace(source: string, openIndex: number): number {
  let depth = 0;
  for (let i = openIndex; i < source.length; i++) {
    const ch = source[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      i = skipStringLiteral(source, i, ch);
      continue;
    }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

// Splits array/object body text on top-level commas, ignoring commas nested
// inside brackets, braces, parens, or quoted/template strings.
function splitTopLevel(text: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      i = skipStringLiteral(text, i, ch);
      continue;
    }
    if (ch === '[' || ch === '{' || ch === '(') depth++;
    else if (ch === ']' || ch === '}' || ch === ')') depth--;
    else if (ch === ',' && depth === 0) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(text.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

// Extracts classes from a template literal, warning on the whole literal if it
// has any interpolation, and only pulling out whitespace-separated tokens that
// contain no interpolation of their own (never a truncated/malformed class).
function extractFromTemplateLiteral(
  tpl: string,
  filePath: string,
  line: number,
  warnings: DynamicWarning[],
): string[] {
  if (!tpl.includes('${')) {
    return splitClassString(tpl);
  }
  warnings.push({ file: filePath, line, fragment: tpl.slice(0, 80) });
  const classes: string[] = [];
  for (const token of tpl.split(/\s+/)) {
    if (token && !token.includes('${')) {
      classes.push(...splitClassString(token));
    }
  }
  return classes;
}

// Classifies one class:list array entry — a plain string, an object literal,
// or a static-boolean-guarded string/template (`cond && 'x'`, `cond ? 'a' : 'b'`)
// — and extracts its static classes. Anything with no statically resolvable
// string (a bare identifier, a function call) warns instead of guessing.
function extractFromListEntry(
  entry: string,
  filePath: string,
  line: number,
  warnings: DynamicWarning[],
): string[] {
  const classes: string[] = [];

  if (entry.startsWith('{') && entry.endsWith('}')) {
    let foundKey = false;
    OBJECT_KEY_RE.lastIndex = 0;
    let km: RegExpExecArray | null;
    while ((km = OBJECT_KEY_RE.exec(entry)) !== null) {
      foundKey = true;
      classes.push(...splitClassString(km[1] ?? km[2] ?? ''));
    }
    if (!foundKey) {
      warnings.push({ file: filePath, line, fragment: entry.slice(0, 80) });
    }
    return classes;
  }

  let foundLiteral = false;

  TEMPLATE_LITERAL_RE.lastIndex = 0;
  let tm: RegExpExecArray | null;
  while ((tm = TEMPLATE_LITERAL_RE.exec(entry)) !== null) {
    foundLiteral = true;
    classes.push(...extractFromTemplateLiteral(tm[1] ?? '', filePath, line, warnings));
  }

  QUOTED_STRING_RE.lastIndex = 0;
  let qm: RegExpExecArray | null;
  while ((qm = QUOTED_STRING_RE.exec(entry)) !== null) {
    foundLiteral = true;
    classes.push(...splitClassString(qm[1] ?? qm[2] ?? ''));
  }

  if (!foundLiteral) {
    warnings.push({ file: filePath, line, fragment: entry.slice(0, 80) });
  }

  return classes;
}

function extractFromClassList(
  source: string,
  filePath: string,
  warnings: DynamicWarning[],
): string[] {
  const classes: string[] = [];

  CLASS_LIST_OPEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = CLASS_LIST_OPEN_RE.exec(source)) !== null) {
    const openIndex = m.index + m[0].length - 1;
    const closeIndex = findMatchingBrace(source, openIndex);
    if (closeIndex === -1) break;

    const line = lineAt(source, m.index);
    const body = source.slice(openIndex + 1, closeIndex).trim();

    if (body.startsWith('[') && body.endsWith(']')) {
      for (const entry of splitTopLevel(body.slice(1, -1))) {
        classes.push(...extractFromListEntry(entry, filePath, line, warnings));
      }
    } else if (body.startsWith('{') && body.endsWith('}')) {
      classes.push(...extractFromListEntry(body, filePath, line, warnings));
    } else {
      // A bare expression (identifier, function call, etc.) — nothing
      // statically resolvable.
      warnings.push({ file: filePath, line, fragment: body.slice(0, 80) });
    }

    CLASS_LIST_OPEN_RE.lastIndex = closeIndex + 1;
  }

  return classes;
}

export function extractFromAstro(source: string, filePath: string): ExtractionResult {
  const classes = new Set<string>();
  const warnings: DynamicWarning[] = [];

  CLASS_ATTR_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = CLASS_ATTR_RE.exec(source)) !== null) {
    const value = m[1] ?? m[2] ?? '';
    for (const cls of splitClassString(value)) classes.add(cls);
  }

  for (const cls of extractFromClassList(source, filePath, warnings)) {
    classes.add(cls);
  }

  return { classes, warnings };
}

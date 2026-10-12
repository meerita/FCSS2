// @file packages/scanner/src/extractors/angular.ts
// @description Extracts FCSS class names from Angular template files and component metadata.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { splitClassString } from '../normalize.js';
import type { ExtractionResult } from './types.js';

// class="..." and class='...' in Angular templates (same as HTML)
const CLASS_ATTR_RE = /class\s*=\s*(?:"([^"]*?)"|'([^']*?)')/gs;

// [class.some-class]="expr" — extract the class name from the binding key
const CLASS_BINDING_RE = /\[class\.([^\]]+)\]/g;

// [ngClass]="..." — parse the value for string literals (object keys and array items)
const NG_CLASS_RE = /\[ngClass\]\s*=\s*"([^"]+)"/g;

function extractFromNgClassValue(value: string): string[] {
  const classes: string[] = [];

  // Object literal: {'class-name': expr, "other-class": expr}
  const objKeyRe = /['"]([^'"]+)['"]\s*:/g;
  let m: RegExpExecArray | null;
  objKeyRe.lastIndex = 0;
  while ((m = objKeyRe.exec(value)) !== null) {
    classes.push(...splitClassString(m[1] ?? ''));
  }

  // Array literal: ['class-a', 'class-b']
  const arrItemRe = /['"]([^'"]+)['"]/g;
  arrItemRe.lastIndex = 0;
  while ((m = arrItemRe.exec(value)) !== null) {
    // Skip items that look like object keys (already captured above)
    const match = m[0] ?? '';
    const nextChar = value[arrItemRe.lastIndex]?.trimStart()[0];
    if (nextChar === ':') continue;
    classes.push(...splitClassString(m[1] ?? ''));
    void match;
  }

  return classes;
}

export function extractFromAngular(source: string): ExtractionResult {
  const classes = new Set<string>();

  let m: RegExpExecArray | null;

  CLASS_ATTR_RE.lastIndex = 0;
  while ((m = CLASS_ATTR_RE.exec(source)) !== null) {
    const value = m[1] ?? m[2] ?? '';
    for (const cls of splitClassString(value)) classes.add(cls);
  }

  CLASS_BINDING_RE.lastIndex = 0;
  while ((m = CLASS_BINDING_RE.exec(source)) !== null) {
    const cls = (m[1] ?? '').trim();
    if (cls) classes.add(cls);
  }

  NG_CLASS_RE.lastIndex = 0;
  while ((m = NG_CLASS_RE.exec(source)) !== null) {
    for (const cls of extractFromNgClassValue(m[1] ?? '')) classes.add(cls);
  }

  return { classes, warnings: [] };
}

// @file packages/scanner/src/extractors/jsx.ts
// @description Extracts FCSS class names from JSX/TSX/JS/TS source files.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { splitClassString } from '../normalize.js';
import type { DynamicWarning, ExtractionResult } from './types.js';

function lineAt(source: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < source.length; i++) {
    if (source[i] === '\n') line++;
  }
  return line;
}

function extractFromStringValue(value: string): string[] {
  return splitClassString(value);
}

// Collect all string literals from a clsx/cn/classnames call body (shallow pass).
function extractFromCallArgs(args: string): string[] {
  const classes: string[] = [];
  // Single/double quoted strings in the arg list
  const strRe = /(?:"([^"\\]*)"|'([^'\\]*)')/g;
  let m: RegExpExecArray | null;
  strRe.lastIndex = 0;
  while ((m = strRe.exec(args)) !== null) {
    const val = m[1] ?? m[2] ?? '';
    classes.push(...extractFromStringValue(val));
  }
  // Object literal keys: { 'class-name': condition } or { "class-name": condition }
  const keyRe = /\{\s*(?:'([^']+)'|"([^"]+)")\s*:/g;
  keyRe.lastIndex = 0;
  while ((m = keyRe.exec(args)) !== null) {
    const key = m[1] ?? m[2] ?? '';
    classes.push(...extractFromStringValue(key));
  }
  return classes;
}

export function extractFromJsx(source: string, filePath: string): ExtractionResult {
  const classes = new Set<string>();
  const warnings: DynamicWarning[] = [];

  // 1. className="..." or className='...'
  const staticDoubleRe = /className\s*=\s*"([^"\\]*)"/g;
  const staticSingleRe = /className\s*=\s*'([^'\\]*)'/g;

  let m: RegExpExecArray | null;

  staticDoubleRe.lastIndex = 0;
  while ((m = staticDoubleRe.exec(source)) !== null) {
    for (const cls of extractFromStringValue(m[1] ?? '')) classes.add(cls);
  }

  staticSingleRe.lastIndex = 0;
  while ((m = staticSingleRe.exec(source)) !== null) {
    for (const cls of extractFromStringValue(m[1] ?? '')) classes.add(cls);
  }

  // 2. className={'...'} or className={"..."}
  const exprStringRe = /className\s*=\s*\{(?:\s*)(?:'([^'\\]*)'|"([^"\\]*)")\s*\}/g;
  exprStringRe.lastIndex = 0;
  while ((m = exprStringRe.exec(source)) !== null) {
    const val = m[1] ?? m[2] ?? '';
    for (const cls of extractFromStringValue(val)) classes.add(cls);
  }

  // 3. Template literals: className={`...`}
  // A static template literal has no ${...} expressions.
  const templateRe = /className\s*=\s*\{`([^`]*)`\}/g;
  templateRe.lastIndex = 0;
  while ((m = templateRe.exec(source)) !== null) {
    const tpl = m[1] ?? '';
    const hasDynamic = tpl.includes('${');
    if (hasDynamic) {
      // Warn about dynamic fragment; extract only the static parts outside ${...}
      const line = lineAt(source, m.index);
      warnings.push({ file: filePath, line, fragment: tpl.slice(0, 80) });
      const staticParts = tpl.split(/\$\{[^}]*\}/g);
      for (const part of staticParts) {
        for (const cls of extractFromStringValue(part)) classes.add(cls);
      }
    } else {
      for (const cls of extractFromStringValue(tpl)) classes.add(cls);
    }
  }

  // 4. Ternary: className={cond ? 'a b' : 'c d'}
  // Matches both quoted forms in ternary position
  const ternaryRe =
    /className\s*=\s*\{[^?}]+\?\s*(?:'([^'\\]*)'|"([^"\\]*)")\s*:\s*(?:'([^'\\]*)'|"([^"\\]*)")\s*\}/g;
  ternaryRe.lastIndex = 0;
  while ((m = ternaryRe.exec(source)) !== null) {
    const trueBranch = m[1] ?? m[2] ?? '';
    const falseBranch = m[3] ?? m[4] ?? '';
    for (const cls of extractFromStringValue(trueBranch)) classes.add(cls);
    for (const cls of extractFromStringValue(falseBranch)) classes.add(cls);
  }

  // 5. clsx(...) / classnames(...) / cn(...) call sites
  const callRe = /(?:clsx|classnames|cn)\s*\(([^)]*(?:\([^)]*\)[^)]*)*)\)/g;
  callRe.lastIndex = 0;
  while ((m = callRe.exec(source)) !== null) {
    const args = m[1] ?? '';
    // Check for dynamic template literals inside the call
    const innerTemplateRe = /`([^`]*)`/g;
    let tm: RegExpExecArray | null;
    innerTemplateRe.lastIndex = 0;
    while ((tm = innerTemplateRe.exec(args)) !== null) {
      const tpl = tm[1] ?? '';
      if (tpl.includes('${')) {
        const line = lineAt(source, m.index);
        warnings.push({ file: filePath, line, fragment: tpl.slice(0, 80) });
        const staticParts = tpl.split(/\$\{[^}]*\}/g);
        for (const part of staticParts) {
          for (const cls of extractFromStringValue(part)) classes.add(cls);
        }
      } else {
        for (const cls of extractFromStringValue(tpl)) classes.add(cls);
      }
    }
    for (const cls of extractFromCallArgs(args)) classes.add(cls);
  }

  return { classes, warnings };
}

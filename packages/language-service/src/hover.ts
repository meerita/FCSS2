// @file packages/language-service/src/hover.ts
// @description Hover provider — returns CSS, category, state, and deprecation info.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { ManifestEntry, ManifestIndex } from './manifest';

export interface HoverResult {
  contents: string;
}

const BREAKPOINT_WIDTHS: Record<string, number> = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

function buildCssSnippet(entry: ManifestEntry): string {
  const decl = `${entry.property}: ${entry.value};`;

  if (entry.breakpoint) {
    const w = BREAKPOINT_WIDTHS[entry.breakpoint] ?? 0;
    return `@media (min-width: ${w}px) {\n  ${entry.selector} {\n    ${decl}\n  }\n}`;
  }

  return `${entry.selector} {\n  ${decl}\n}`;
}

export function getHover(className: string, index: ManifestIndex): HoverResult | null {
  const entry = index.byClassName.get(className);
  if (!entry) return null;

  const lines: string[] = [];

  lines.push('```css');
  lines.push(buildCssSnippet(entry));
  lines.push('```');
  lines.push('');
  lines.push(`**Property:** \`${entry.property}: ${entry.value}\``);
  lines.push(`**Category:** ${entry.category}`);

  if (entry.condition) {
    if (entry.condition.type === 'pseudo') {
      lines.push(`**State:** \`:${entry.condition.value}\``);
    } else if (entry.condition.attribute) {
      lines.push(`**State:** \`${entry.condition.attribute}="${entry.condition.value}"\``);
    }
  }

  if (entry.breakpoint) {
    const w = BREAKPOINT_WIDTHS[entry.breakpoint] ?? 0;
    lines.push(`**Breakpoint:** \`${entry.breakpoint}\` (min-width: ${w}px)`);
  }

  lines.push(`**Source:** ${entry.source}`);

  if (entry.deprecated) {
    lines.push('');
    lines.push(`⚠️ **Deprecated.** Use \`${entry.canonical ?? '?'}\` instead.`);
  }

  return { contents: lines.join('\n') };
}

// @file packages/scanner/src/normalize.ts
// @description Normalizes CSS-escaped class name tokens to their unescaped form for manifest lookup.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

// CSS escape sequences: \XX (hex) or \<char> (literal)
const CSS_HEX_ESCAPE = /\\([0-9a-fA-F]{1,6})\s?/g;
const CSS_LITERAL_ESCAPE = /\\(.)/g;

export function normalizeClassName(className: string): string {
  return className
    .replace(CSS_HEX_ESCAPE, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(CSS_LITERAL_ESCAPE, (_, ch: string) => ch)
    .trim();
}

export function splitClassString(value: string): string[] {
  return value.split(/\s+/).map(normalizeClassName).filter(Boolean);
}

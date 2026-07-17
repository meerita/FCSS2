// @file packages/generator/src/declaration.ts
// @description CSS declaration builder with numeric behavior conversion for FCSS utilities.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssNumericBehavior } from '@fcss/spec';

export function buildDeclaration(
  property: string,
  value: string,
  numericBehavior?: FcssNumericBehavior,
): string {
  return `${property}: ${resolveCssValue(value, numericBehavior)}`;
}

function resolveCssValue(value: string, numericBehavior: FcssNumericBehavior | undefined): string {
  if (!numericBehavior) return value;
  if (value.endsWith('%')) return value;

  const num = parseFloat(value);
  if (isNaN(num) || (value !== String(num) && value !== `-${Math.abs(num)}`)) {
    // Non-numeric keyword (e.g. 'auto') — use as-is regardless of numericBehavior
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(value)) return value;
  }

  switch (numericBehavior) {
    case 'length':
    case 'length-percentage':
      return num === 0 ? '0' : `${num}px`;
    case 'integer':
    case 'positive-integer':
    case 'number':
      return String(num);
    case 'percentage':
      return value;
    default:
      return value;
  }
}

// @file packages/generator/src/selector.ts
// @description CSS selector builder for FCSS utility classes.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { escapeClassName } from './escape.js';

export function buildSelector(
  className: string,
  pseudo?: string,
  ariaAttr?: string,
  ariaValue?: string,
): string {
  const escaped = escapeClassName(className);
  if (ariaAttr !== undefined && ariaValue !== undefined) {
    return `.${escaped}[${ariaAttr}='${ariaValue}']`;
  }
  if (pseudo !== undefined) {
    return `.${escaped}:${pseudo}`;
  }
  return `.${escaped}`;
}

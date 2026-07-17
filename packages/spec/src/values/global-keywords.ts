// @file packages/spec/src/values/global-keywords.ts
// @description CSS-wide keyword values applicable to any property.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssValueDefinition } from '../types.js';

export const FCSS_GLOBAL_KEYWORDS: readonly FcssValueDefinition[] = [
  { classValue: 'inherit', cssValue: 'inherit' },
  { classValue: 'initial', cssValue: 'initial' },
  { classValue: 'unset', cssValue: 'unset' },
];

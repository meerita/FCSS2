// @file packages/spec/src/values/length-scales.ts
// @description Default spacing/size numeric scale for length-type properties.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssValueDefinition } from '../types.js';

const SCALE_PX = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96];

function makeLength(n: number): FcssValueDefinition {
  if (n === 0) {
    return { classValue: '0', cssValue: '0' };
  }
  return { classValue: String(n), cssValue: `${n}px`, legacyAliases: [`${n}px`] };
}

export const FCSS_LENGTH_SCALE: readonly FcssValueDefinition[] = SCALE_PX.map(makeLength);

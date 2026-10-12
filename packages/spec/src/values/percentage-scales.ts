// @file packages/spec/src/values/percentage-scales.ts
// @description Default percentage scale for percentage-type properties.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssValueDefinition } from '../types.js';

const SCALE_PCT = [0, 10, 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 90, 100];

export const FCSS_PERCENTAGE_SCALE: readonly FcssValueDefinition[] = SCALE_PCT.map((n) => ({
  classValue: `${n}%`,
  cssValue: `${n}%`,
}));

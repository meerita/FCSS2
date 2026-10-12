// @file packages/spec/src/values/timing-functions.ts
// @description Approved timing function presets for transition and animation properties.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssValueDefinition } from '../types.js';

export const FCSS_TIMING_FUNCTIONS: readonly FcssValueDefinition[] = [
  { classValue: 'ease', cssValue: 'ease' },
  { classValue: 'linear', cssValue: 'linear' },
  { classValue: 'ease-in', cssValue: 'ease-in' },
  { classValue: 'ease-out', cssValue: 'ease-out' },
  { classValue: 'ease-in-out', cssValue: 'ease-in-out' },
  { classValue: 'step-start', cssValue: 'step-start' },
  { classValue: 'step-end', cssValue: 'step-end' },
];

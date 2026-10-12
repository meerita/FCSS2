// @file packages/spec/src/properties/transforms.ts
// @description CSS transform properties (CSS Transforms Level 1).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_INTERACTION, PC_NONE } from '../states/pseudo-classes.js';
import { SUPPORTED_ARIA_STATES } from '../states/aria.js';

const ARIA = SUPPORTED_ARIA_STATES;

export const TRANSFORMS_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'transform',
    category: 'transforms',
    specification: 'CSS Transforms Level 1',
    status: 'preset-only',
    values: [
      { classValue: 'none', cssValue: 'none' },
      { classValue: 'flip-x', cssValue: 'scaleX(-1)' },
      { classValue: 'flip-y', cssValue: 'scaleY(-1)' },
      { classValue: 'rotate-45', cssValue: 'rotate(45deg)' },
      { classValue: 'rotate-90', cssValue: 'rotate(90deg)' },
      { classValue: 'rotate-180', cssValue: 'rotate(180deg)' },
      { classValue: 'rotate--45', cssValue: 'rotate(-45deg)' },
      { classValue: 'rotate--90', cssValue: 'rotate(-90deg)' },
      { classValue: 'scale-50', cssValue: 'scale(0.5)' },
      { classValue: 'scale-75', cssValue: 'scale(0.75)' },
      { classValue: 'scale-90', cssValue: 'scale(0.9)' },
      { classValue: 'scale-95', cssValue: 'scale(0.95)' },
      { classValue: 'scale-100', cssValue: 'scale(1)' },
      { classValue: 'scale-105', cssValue: 'scale(1.05)' },
      { classValue: 'scale-110', cssValue: 'scale(1.1)' },
      { classValue: 'scale-125', cssValue: 'scale(1.25)' },
      { classValue: 'scale-150', cssValue: 'scale(1.5)' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_INTERACTION,
    supportedAriaStates: ARIA,
  },
  {
    property: 'transform-origin',
    category: 'transforms',
    specification: 'CSS Transforms Level 1',
    status: 'preset-only',
    values: [
      { classValue: 'center', cssValue: 'center' },
      { classValue: 'top', cssValue: 'top' },
      { classValue: 'top-right', cssValue: 'top right' },
      { classValue: 'right', cssValue: 'right' },
      { classValue: 'bottom-right', cssValue: 'bottom right' },
      { classValue: 'bottom', cssValue: 'bottom' },
      { classValue: 'bottom-left', cssValue: 'bottom left' },
      { classValue: 'left', cssValue: 'left' },
      { classValue: 'top-left', cssValue: 'top left' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
];

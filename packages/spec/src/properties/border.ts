// @file packages/spec/src/properties/border.ts
// @description Border table-model properties: border-collapse and border-spacing.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_NONE } from '../states/pseudo-classes.js';

export const BORDER_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'border-collapse',
    category: 'border',
    specification: 'CSS2.1',
    status: 'supported',
    values: [
      { classValue: 'collapse', cssValue: 'collapse' },
      { classValue: 'separate', cssValue: 'separate' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'border-spacing',
    category: 'border',
    specification: 'CSS2.1',
    status: 'supported',
    values: [],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    numericBehavior: 'length',
  },
];

// @file packages/spec/src/properties/lists.ts
// @description List style properties (CSS Lists and Counters Level 3).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_NONE } from '../states/pseudo-classes.js';

export const LISTS_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'list-style-type',
    category: 'lists',
    specification: 'CSS2.1 / CSS Lists and Counters Level 3',
    status: 'supported',
    values: [
      { classValue: 'none', cssValue: 'none' },
      { classValue: 'disc', cssValue: 'disc' },
      { classValue: 'circle', cssValue: 'circle' },
      { classValue: 'square', cssValue: 'square' },
      { classValue: 'decimal', cssValue: 'decimal' },
      { classValue: 'decimal-leading-zero', cssValue: 'decimal-leading-zero' },
      { classValue: 'lower-alpha', cssValue: 'lower-alpha' },
      { classValue: 'upper-alpha', cssValue: 'upper-alpha' },
      { classValue: 'lower-roman', cssValue: 'lower-roman' },
      { classValue: 'upper-roman', cssValue: 'upper-roman' },
      { classValue: 'lower-latin', cssValue: 'lower-latin' },
      { classValue: 'upper-latin', cssValue: 'upper-latin' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'list-style-position',
    category: 'lists',
    specification: 'CSS2.1',
    status: 'supported',
    values: [
      { classValue: 'inside', cssValue: 'inside' },
      { classValue: 'outside', cssValue: 'outside' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'list-style-image',
    category: 'lists',
    specification: 'CSS2.1',
    status: 'preset-only',
    values: [{ classValue: 'none', cssValue: 'none' }],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
];

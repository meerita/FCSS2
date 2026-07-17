// @file packages/spec/src/properties/tables.ts
// @description Table layout properties (CSS2.1).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_NONE } from '../states/pseudo-classes.js';

export const TABLES_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'caption-side',
    category: 'tables',
    specification: 'CSS2.1',
    status: 'supported',
    values: [
      { classValue: 'top', cssValue: 'top' },
      { classValue: 'bottom', cssValue: 'bottom' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'empty-cells',
    category: 'tables',
    specification: 'CSS2.1',
    status: 'supported',
    values: [
      { classValue: 'show', cssValue: 'show' },
      { classValue: 'hide', cssValue: 'hide' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'table-layout',
    category: 'tables',
    specification: 'CSS2.1',
    status: 'supported',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: 'fixed', cssValue: 'fixed' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
];

// @file packages/spec/src/properties/positioning.ts
// @description Positioning properties: position, inset longhands, and z-index.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_INTERACTION, PC_NONE } from '../states/pseudo-classes.js';
import { SUPPORTED_ARIA_STATES } from '../states/aria.js';

const ARIA = SUPPORTED_ARIA_STATES;

const INSET_VALUES = [{ classValue: 'auto', cssValue: 'auto' }];

export const POSITIONING_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'position',
    category: 'positioning',
    specification: 'CSS2.1 / CSS Positioned Layout Level 3',
    status: 'supported',
    values: [
      { classValue: 'static', cssValue: 'static' },
      { classValue: 'relative', cssValue: 'relative' },
      { classValue: 'absolute', cssValue: 'absolute' },
      { classValue: 'fixed', cssValue: 'fixed' },
      { classValue: 'sticky', cssValue: 'sticky' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
  },
  {
    property: 'top',
    category: 'positioning',
    specification: 'CSS2.1',
    status: 'supported',
    values: INSET_VALUES,
    supportsResponsive: true,
    supportedPseudoClasses: PC_INTERACTION,
    supportedAriaStates: ARIA,
    numericBehavior: 'length-percentage',
  },
  {
    property: 'right',
    category: 'positioning',
    specification: 'CSS2.1',
    status: 'supported',
    values: INSET_VALUES,
    supportsResponsive: true,
    supportedPseudoClasses: PC_INTERACTION,
    supportedAriaStates: ARIA,
    numericBehavior: 'length-percentage',
  },
  {
    property: 'bottom',
    category: 'positioning',
    specification: 'CSS2.1',
    status: 'supported',
    values: INSET_VALUES,
    supportsResponsive: true,
    supportedPseudoClasses: PC_INTERACTION,
    supportedAriaStates: ARIA,
    numericBehavior: 'length-percentage',
  },
  {
    property: 'left',
    category: 'positioning',
    specification: 'CSS2.1',
    status: 'supported',
    values: INSET_VALUES,
    supportsResponsive: true,
    supportedPseudoClasses: PC_INTERACTION,
    supportedAriaStates: ARIA,
    numericBehavior: 'length-percentage',
  },
  {
    property: 'z-index',
    category: 'positioning',
    specification: 'CSS2.1',
    status: 'supported',
    values: [{ classValue: 'auto', cssValue: 'auto' }],
    supportsResponsive: false,
    supportedPseudoClasses: PC_INTERACTION,
    supportedAriaStates: ARIA,
    numericBehavior: 'integer',
  },
];

// @file packages/spec/src/properties/flexbox.ts
// @description Flexbox layout properties (CSS Flexible Box Layout Level 1).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_NONE } from '../states/pseudo-classes.js';
import { SUPPORTED_ARIA_STATES } from '../states/aria.js';

const ARIA = SUPPORTED_ARIA_STATES;

export const FLEXBOX_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'flex-direction',
    category: 'flexbox',
    specification: 'CSS Flexible Box Layout Level 1',
    status: 'supported',
    values: [
      { classValue: 'row', cssValue: 'row' },
      { classValue: 'row-reverse', cssValue: 'row-reverse' },
      { classValue: 'column', cssValue: 'column' },
      { classValue: 'column-reverse', cssValue: 'column-reverse' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
  },
  {
    property: 'flex-wrap',
    category: 'flexbox',
    specification: 'CSS Flexible Box Layout Level 1',
    status: 'supported',
    values: [
      { classValue: 'nowrap', cssValue: 'nowrap' },
      { classValue: 'wrap', cssValue: 'wrap' },
      { classValue: 'wrap-reverse', cssValue: 'wrap-reverse' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
  },
  {
    property: 'flex-flow',
    category: 'flexbox',
    specification: 'CSS Flexible Box Layout Level 1',
    status: 'preset-only',
    values: [
      { classValue: 'row-nowrap', cssValue: 'row nowrap' },
      { classValue: 'row-wrap', cssValue: 'row wrap' },
      { classValue: 'column-nowrap', cssValue: 'column nowrap' },
      { classValue: 'column-wrap', cssValue: 'column wrap' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
  },
  {
    property: 'flex-grow',
    category: 'flexbox',
    specification: 'CSS Flexible Box Layout Level 1',
    status: 'supported',
    values: [
      { classValue: '0', cssValue: '0' },
      { classValue: '1', cssValue: '1' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    numericBehavior: 'number',
  },
  {
    property: 'flex-shrink',
    category: 'flexbox',
    specification: 'CSS Flexible Box Layout Level 1',
    status: 'supported',
    values: [
      { classValue: '0', cssValue: '0' },
      { classValue: '1', cssValue: '1' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    numericBehavior: 'number',
  },
  {
    property: 'flex-basis',
    category: 'flexbox',
    specification: 'CSS Flexible Box Layout Level 1',
    status: 'supported',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: 'content', cssValue: 'content' },
      { classValue: 'max-content', cssValue: 'max-content' },
      { classValue: 'min-content', cssValue: 'min-content' },
      { classValue: 'fit-content', cssValue: 'fit-content' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    numericBehavior: 'length-percentage',
  },
  {
    property: 'flex',
    category: 'flexbox',
    specification: 'CSS Flexible Box Layout Level 1',
    status: 'preset-only',
    values: [
      { classValue: 'none', cssValue: 'none' },
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: '1', cssValue: '1 1 0%' },
      { classValue: 'initial', cssValue: '0 1 auto' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
];

// @file packages/spec/src/properties/dimensions.ts
// @description Dimension properties: width, height, and their min/max variants.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_INTERACTION, PC_NONE } from '../states/pseudo-classes.js';
import { SUPPORTED_ARIA_STATES } from '../states/aria.js';

const ARIA = SUPPORTED_ARIA_STATES;

const SIZE_KEYWORDS = [
  { classValue: 'auto', cssValue: 'auto' },
  { classValue: 'max-content', cssValue: 'max-content' },
  { classValue: 'min-content', cssValue: 'min-content' },
  { classValue: 'fit-content', cssValue: 'fit-content' },
];

const MAX_KEYWORDS = [...SIZE_KEYWORDS, { classValue: 'none', cssValue: 'none' }];

const MIN_KEYWORDS = [
  { classValue: 'max-content', cssValue: 'max-content' },
  { classValue: 'min-content', cssValue: 'min-content' },
  { classValue: 'fit-content', cssValue: 'fit-content' },
];

export const DIMENSIONS_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'width',
    category: 'dimensions',
    specification: 'CSS2.1 / CSS Box Sizing Level 3',
    status: 'supported',
    values: SIZE_KEYWORDS,
    supportsResponsive: true,
    supportedPseudoClasses: PC_INTERACTION,
    supportedAriaStates: ARIA,
    numericBehavior: 'length-percentage',
  },
  {
    property: 'min-width',
    category: 'dimensions',
    specification: 'CSS2.1 / CSS Box Sizing Level 3',
    status: 'supported',
    values: MIN_KEYWORDS,
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
    numericBehavior: 'length-percentage',
  },
  {
    property: 'max-width',
    category: 'dimensions',
    specification: 'CSS2.1 / CSS Box Sizing Level 3',
    status: 'supported',
    values: MAX_KEYWORDS,
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
    numericBehavior: 'length-percentage',
  },
  {
    property: 'height',
    category: 'dimensions',
    specification: 'CSS2.1 / CSS Box Sizing Level 3',
    status: 'supported',
    values: SIZE_KEYWORDS,
    supportsResponsive: true,
    supportedPseudoClasses: PC_INTERACTION,
    supportedAriaStates: ARIA,
    numericBehavior: 'length-percentage',
  },
  {
    property: 'min-height',
    category: 'dimensions',
    specification: 'CSS2.1 / CSS Box Sizing Level 3',
    status: 'supported',
    values: MIN_KEYWORDS,
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
    numericBehavior: 'length-percentage',
  },
  {
    property: 'max-height',
    category: 'dimensions',
    specification: 'CSS2.1 / CSS Box Sizing Level 3',
    status: 'supported',
    values: MAX_KEYWORDS,
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
    numericBehavior: 'length-percentage',
  },
];

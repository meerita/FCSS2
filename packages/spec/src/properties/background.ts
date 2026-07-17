// @file packages/spec/src/properties/background.ts
// @description Background properties (CSS Backgrounds and Borders Level 3).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_INTERACTION, PC_NONE } from '../states/pseudo-classes.js';
import { SUPPORTED_ARIA_STATES } from '../states/aria.js';

const ARIA = SUPPORTED_ARIA_STATES;

export const BACKGROUND_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'background-image',
    category: 'background',
    specification: 'CSS Backgrounds and Borders Level 3',
    status: 'preset-only',
    values: [
      { classValue: 'none', cssValue: 'none' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_INTERACTION,
    supportedAriaStates: ARIA,
  },
  {
    property: 'background-position',
    category: 'background',
    specification: 'CSS Backgrounds and Borders Level 3',
    status: 'preset-only',
    values: [
      { classValue: 'center', cssValue: 'center' },
      { classValue: 'top', cssValue: 'top' },
      { classValue: 'bottom', cssValue: 'bottom' },
      { classValue: 'left', cssValue: 'left' },
      { classValue: 'right', cssValue: 'right' },
      { classValue: 'top-left', cssValue: 'top left' },
      { classValue: 'top-right', cssValue: 'top right' },
      { classValue: 'bottom-left', cssValue: 'bottom left' },
      { classValue: 'bottom-right', cssValue: 'bottom right' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'background-size',
    category: 'background',
    specification: 'CSS Backgrounds and Borders Level 3',
    status: 'supported',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: 'cover', cssValue: 'cover' },
      { classValue: 'contain', cssValue: 'contain' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'background-repeat',
    category: 'background',
    specification: 'CSS Backgrounds and Borders Level 3',
    status: 'supported',
    values: [
      { classValue: 'no-repeat', cssValue: 'no-repeat' },
      { classValue: 'repeat', cssValue: 'repeat' },
      { classValue: 'repeat-x', cssValue: 'repeat-x' },
      { classValue: 'repeat-y', cssValue: 'repeat-y' },
      { classValue: 'space', cssValue: 'space' },
      { classValue: 'round', cssValue: 'round' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'background-origin',
    category: 'background',
    specification: 'CSS Backgrounds and Borders Level 3',
    status: 'supported',
    values: [
      { classValue: 'padding-box', cssValue: 'padding-box' },
      { classValue: 'border-box', cssValue: 'border-box' },
      { classValue: 'content-box', cssValue: 'content-box' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'background-clip',
    category: 'background',
    specification: 'CSS Backgrounds and Borders Level 3',
    status: 'supported',
    values: [
      { classValue: 'padding-box', cssValue: 'padding-box' },
      { classValue: 'border-box', cssValue: 'border-box' },
      { classValue: 'content-box', cssValue: 'content-box' },
      { classValue: 'text', cssValue: 'text' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'background-attachment',
    category: 'background',
    specification: 'CSS Backgrounds and Borders Level 3',
    status: 'supported',
    values: [
      { classValue: 'scroll', cssValue: 'scroll' },
      { classValue: 'fixed', cssValue: 'fixed' },
      { classValue: 'local', cssValue: 'local' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
];

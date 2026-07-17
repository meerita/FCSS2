// @file packages/spec/src/properties/transitions.ts
// @description CSS transition properties (CSS Transitions Level 1).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_NONE } from '../states/pseudo-classes.js';
import { FCSS_TIMING_FUNCTIONS } from '../values/timing-functions.js';

const TRANSITION_PROPERTY_VALUES = [
  { classValue: 'none', cssValue: 'none' },
  { classValue: 'all', cssValue: 'all' },
  { classValue: 'colors', cssValue: 'color, background-color, border-color, text-decoration-color, fill, stroke' },
  { classValue: 'opacity', cssValue: 'opacity' },
  { classValue: 'shadow', cssValue: 'box-shadow' },
  { classValue: 'transform', cssValue: 'transform' },
];

const TRANSITION_DURATION_VALUES = [
  { classValue: '75', cssValue: '75ms', legacyAliases: ['75ms'] },
  { classValue: '100', cssValue: '100ms', legacyAliases: ['100ms'] },
  { classValue: '150', cssValue: '150ms', legacyAliases: ['150ms'] },
  { classValue: '200', cssValue: '200ms', legacyAliases: ['200ms'] },
  { classValue: '300', cssValue: '300ms', legacyAliases: ['300ms'] },
  { classValue: '500', cssValue: '500ms', legacyAliases: ['500ms'] },
  { classValue: '700', cssValue: '700ms', legacyAliases: ['700ms'] },
  { classValue: '1000', cssValue: '1000ms', legacyAliases: ['1000ms'] },
];

const TRANSITION_PRESETS = [
  { classValue: 'none', cssValue: 'none' },
  { classValue: 'all', cssValue: 'all 150ms ease' },
  { classValue: 'colors', cssValue: 'color, background-color, border-color 150ms ease' },
  { classValue: 'opacity', cssValue: 'opacity 150ms ease' },
  { classValue: 'shadow', cssValue: 'box-shadow 150ms ease' },
  { classValue: 'transform', cssValue: 'transform 150ms ease' },
];

export const TRANSITIONS_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'transition',
    category: 'transitions',
    specification: 'CSS Transitions Level 1',
    status: 'preset-only',
    values: TRANSITION_PRESETS,
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'transition-property',
    category: 'transitions',
    specification: 'CSS Transitions Level 1',
    status: 'supported',
    values: TRANSITION_PROPERTY_VALUES,
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'transition-duration',
    category: 'transitions',
    specification: 'CSS Transitions Level 1',
    status: 'supported',
    values: TRANSITION_DURATION_VALUES,
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'transition-timing-function',
    category: 'transitions',
    specification: 'CSS Transitions Level 1',
    status: 'supported',
    values: [...FCSS_TIMING_FUNCTIONS],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'transition-delay',
    category: 'transitions',
    specification: 'CSS Transitions Level 1',
    status: 'supported',
    values: TRANSITION_DURATION_VALUES,
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
];

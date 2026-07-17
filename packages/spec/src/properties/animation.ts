// @file packages/spec/src/properties/animation.ts
// @description CSS animation properties (CSS Animations Level 1).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_NONE } from '../states/pseudo-classes.js';
import { FCSS_TIMING_FUNCTIONS } from '../values/timing-functions.js';

const ANIMATION_DURATION_VALUES = [
  { classValue: '75', cssValue: '75ms' },
  { classValue: '100', cssValue: '100ms' },
  { classValue: '150', cssValue: '150ms' },
  { classValue: '200', cssValue: '200ms' },
  { classValue: '300', cssValue: '300ms' },
  { classValue: '500', cssValue: '500ms' },
  { classValue: '700', cssValue: '700ms' },
  { classValue: '1000', cssValue: '1000ms' },
];

export const ANIMATION_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'animation',
    category: 'animation',
    specification: 'CSS Animations Level 1',
    status: 'preset-only',
    values: [
      { classValue: 'none', cssValue: 'none' },
      { classValue: 'spin', cssValue: 'spin 1s linear infinite' },
      { classValue: 'ping', cssValue: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' },
      { classValue: 'pulse', cssValue: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' },
      { classValue: 'bounce', cssValue: 'bounce 1s infinite' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'animation-name',
    category: 'animation',
    specification: 'CSS Animations Level 1',
    status: 'custom-only',
    values: [],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    notes: 'Animation names reference @keyframes defined in project c- CSS; cannot be enumerated as utility class values',
  },
  {
    property: 'animation-duration',
    category: 'animation',
    specification: 'CSS Animations Level 1',
    status: 'supported',
    values: ANIMATION_DURATION_VALUES,
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'animation-timing-function',
    category: 'animation',
    specification: 'CSS Animations Level 1',
    status: 'supported',
    values: [...FCSS_TIMING_FUNCTIONS],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'animation-delay',
    category: 'animation',
    specification: 'CSS Animations Level 1',
    status: 'supported',
    values: ANIMATION_DURATION_VALUES,
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'animation-iteration-count',
    category: 'animation',
    specification: 'CSS Animations Level 1',
    status: 'supported',
    values: [
      { classValue: 'infinite', cssValue: 'infinite' },
      { classValue: '1', cssValue: '1' },
      { classValue: '2', cssValue: '2' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    numericBehavior: 'positive-integer',
  },
  {
    property: 'animation-direction',
    category: 'animation',
    specification: 'CSS Animations Level 1',
    status: 'supported',
    values: [
      { classValue: 'normal', cssValue: 'normal' },
      { classValue: 'reverse', cssValue: 'reverse' },
      { classValue: 'alternate', cssValue: 'alternate' },
      { classValue: 'alternate-reverse', cssValue: 'alternate-reverse' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'animation-fill-mode',
    category: 'animation',
    specification: 'CSS Animations Level 1',
    status: 'supported',
    values: [
      { classValue: 'none', cssValue: 'none' },
      { classValue: 'forwards', cssValue: 'forwards' },
      { classValue: 'backwards', cssValue: 'backwards' },
      { classValue: 'both', cssValue: 'both' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'animation-play-state',
    category: 'animation',
    specification: 'CSS Animations Level 1',
    status: 'supported',
    values: [
      { classValue: 'running', cssValue: 'running' },
      { classValue: 'paused', cssValue: 'paused' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
];

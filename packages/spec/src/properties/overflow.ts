// @file packages/spec/src/properties/overflow.ts
// @description Overflow-adjacent experimental properties: scroll-snap, scroll-behavior, overscroll, logical overflow.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_NONE } from '../states/pseudo-classes.js';

// overflow, overflow-x, overflow-y are defined in display.ts.
// This file covers scroll-snap and related experimental overflow properties from the legacy catalog.

export const OVERFLOW_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'scroll-behavior',
    category: 'overflow',
    specification: 'CSS Overflow Level 3',
    status: 'experimental',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: 'smooth', cssValue: 'smooth' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    notes: 'CSS Overflow Level 3 — outside the CSS3 profile; well-supported in modern browsers',
  },
  {
    property: 'scroll-snap-type',
    category: 'overflow',
    specification: 'CSS Scroll Snap Level 1',
    status: 'experimental',
    values: [
      { classValue: 'none', cssValue: 'none' },
      { classValue: 'x', cssValue: 'x' },
      { classValue: 'y', cssValue: 'y' },
      { classValue: 'both', cssValue: 'both' },
      { classValue: 'x-mandatory', cssValue: 'x mandatory' },
      { classValue: 'y-mandatory', cssValue: 'y mandatory' },
      { classValue: 'both-mandatory', cssValue: 'both mandatory' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    notes: 'CSS Scroll Snap Level 1 — outside the CSS3 profile',
  },
  {
    property: 'scroll-snap-align',
    category: 'overflow',
    specification: 'CSS Scroll Snap Level 1',
    status: 'experimental',
    values: [
      { classValue: 'none', cssValue: 'none' },
      { classValue: 'start', cssValue: 'start' },
      { classValue: 'end', cssValue: 'end' },
      { classValue: 'center', cssValue: 'center' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    notes: 'CSS Scroll Snap Level 1 — outside the CSS3 profile',
  },
  {
    property: 'scroll-snap-stop',
    category: 'overflow',
    specification: 'CSS Scroll Snap Level 1',
    status: 'experimental',
    values: [
      { classValue: 'normal', cssValue: 'normal' },
      { classValue: 'always', cssValue: 'always' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    notes: 'CSS Scroll Snap Level 1 — outside the CSS3 profile',
  },
  {
    property: 'overscroll-behavior',
    category: 'overflow',
    specification: 'CSS Overscroll Behavior',
    status: 'experimental',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: 'contain', cssValue: 'contain' },
      { classValue: 'none', cssValue: 'none' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    notes: 'CSS Overscroll Behavior (CSS Overflow Level 4) — outside the CSS3 profile',
  },
  {
    property: 'overflow-block',
    category: 'overflow',
    specification: 'CSS Overflow Level 3 / CSS Logical Properties',
    status: 'experimental',
    values: [
      { classValue: 'visible', cssValue: 'visible' },
      { classValue: 'hidden', cssValue: 'hidden' },
      { classValue: 'scroll', cssValue: 'scroll' },
      { classValue: 'auto', cssValue: 'auto' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    notes:
      'CSS Logical Properties — outside the CSS3 profile; use overflow-y for the CSS3 equivalent in horizontal writing modes',
  },
  {
    property: 'overflow-inline',
    category: 'overflow',
    specification: 'CSS Overflow Level 3 / CSS Logical Properties',
    status: 'experimental',
    values: [
      { classValue: 'visible', cssValue: 'visible' },
      { classValue: 'hidden', cssValue: 'hidden' },
      { classValue: 'scroll', cssValue: 'scroll' },
      { classValue: 'auto', cssValue: 'auto' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    notes:
      'CSS Logical Properties — outside the CSS3 profile; use overflow-x for the CSS3 equivalent in horizontal writing modes',
  },
];

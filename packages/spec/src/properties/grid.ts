// @file packages/spec/src/properties/grid.ts
// @description CSS Grid Layout properties (CSS Grid Layout Level 1).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_NONE } from '../states/pseudo-classes.js';
import { SUPPORTED_ARIA_STATES } from '../states/aria.js';

const ARIA = SUPPORTED_ARIA_STATES;

const GRID_LINE_VALUES = [
  { classValue: 'auto', cssValue: 'auto' },
];

const GRID_TRACK_PRESETS = [
  { classValue: 'none', cssValue: 'none' },
  { classValue: '1', cssValue: 'repeat(1, minmax(0, 1fr))' },
  { classValue: '2', cssValue: 'repeat(2, minmax(0, 1fr))' },
  { classValue: '3', cssValue: 'repeat(3, minmax(0, 1fr))' },
  { classValue: '4', cssValue: 'repeat(4, minmax(0, 1fr))' },
  { classValue: '5', cssValue: 'repeat(5, minmax(0, 1fr))' },
  { classValue: '6', cssValue: 'repeat(6, minmax(0, 1fr))' },
  { classValue: '7', cssValue: 'repeat(7, minmax(0, 1fr))' },
  { classValue: '8', cssValue: 'repeat(8, minmax(0, 1fr))' },
  { classValue: '12', cssValue: 'repeat(12, minmax(0, 1fr))' },
];

export const GRID_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'grid-template-columns',
    category: 'grid',
    specification: 'CSS Grid Layout Level 1',
    status: 'preset-only',
    values: [
      ...GRID_TRACK_PRESETS,
      { classValue: 'subgrid', cssValue: 'subgrid' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
  },
  {
    property: 'grid-template-rows',
    category: 'grid',
    specification: 'CSS Grid Layout Level 1',
    status: 'preset-only',
    values: [
      { classValue: 'none', cssValue: 'none' },
      { classValue: 'auto', cssValue: 'auto' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
  },
  {
    property: 'grid-auto-columns',
    category: 'grid',
    specification: 'CSS Grid Layout Level 1',
    status: 'preset-only',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: 'min', cssValue: 'min-content' },
      { classValue: 'max', cssValue: 'max-content' },
      { classValue: 'fr', cssValue: 'minmax(0, 1fr)' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
  },
  {
    property: 'grid-auto-rows',
    category: 'grid',
    specification: 'CSS Grid Layout Level 1',
    status: 'preset-only',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: 'min', cssValue: 'min-content' },
      { classValue: 'max', cssValue: 'max-content' },
      { classValue: 'fr', cssValue: 'minmax(0, 1fr)' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
  },
  {
    property: 'grid-auto-flow',
    category: 'grid',
    specification: 'CSS Grid Layout Level 1',
    status: 'supported',
    values: [
      { classValue: 'row', cssValue: 'row' },
      { classValue: 'column', cssValue: 'column' },
      { classValue: 'dense', cssValue: 'dense' },
      { classValue: 'row-dense', cssValue: 'row dense' },
      { classValue: 'column-dense', cssValue: 'column dense' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
  },
  {
    property: 'grid-column-start',
    category: 'grid',
    specification: 'CSS Grid Layout Level 1',
    status: 'supported',
    values: GRID_LINE_VALUES,
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
    numericBehavior: 'integer',
  },
  {
    property: 'grid-column-end',
    category: 'grid',
    specification: 'CSS Grid Layout Level 1',
    status: 'supported',
    values: GRID_LINE_VALUES,
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
    numericBehavior: 'integer',
  },
  {
    property: 'grid-row-start',
    category: 'grid',
    specification: 'CSS Grid Layout Level 1',
    status: 'supported',
    values: GRID_LINE_VALUES,
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
    numericBehavior: 'integer',
  },
  {
    property: 'grid-row-end',
    category: 'grid',
    specification: 'CSS Grid Layout Level 1',
    status: 'supported',
    values: GRID_LINE_VALUES,
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
    numericBehavior: 'integer',
  },
  {
    property: 'grid-column',
    category: 'grid',
    specification: 'CSS Grid Layout Level 1',
    status: 'preset-only',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: 'span-1', cssValue: 'span 1 / span 1', legacyAliases: ['span 1'] },
      { classValue: 'span-2', cssValue: 'span 2 / span 2', legacyAliases: ['span 2'] },
      { classValue: 'span-3', cssValue: 'span 3 / span 3', legacyAliases: ['span 3'] },
      { classValue: 'span-4', cssValue: 'span 4 / span 4', legacyAliases: ['span 4'] },
      { classValue: 'span-5', cssValue: 'span 5 / span 5', legacyAliases: ['span 5'] },
      { classValue: 'span-6', cssValue: 'span 6 / span 6', legacyAliases: ['span 6'] },
      { classValue: 'span-7', cssValue: 'span 7 / span 7', legacyAliases: ['span 7'] },
      { classValue: 'span-8', cssValue: 'span 8 / span 8', legacyAliases: ['span 8'] },
      { classValue: 'span-9', cssValue: 'span 9 / span 9', legacyAliases: ['span 9'] },
      { classValue: 'span-10', cssValue: 'span 10 / span 10', legacyAliases: ['span 10'] },
      { classValue: 'span-full', cssValue: '1 / -1' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
  },
  {
    property: 'grid-row',
    category: 'grid',
    specification: 'CSS Grid Layout Level 1',
    status: 'preset-only',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: 'span-1', cssValue: 'span 1 / span 1' },
      { classValue: 'span-2', cssValue: 'span 2 / span 2' },
      { classValue: 'span-3', cssValue: 'span 3 / span 3' },
      { classValue: 'span-full', cssValue: '1 / -1' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
  },
];

// @file packages/spec/src/properties/columns.ts
// @description CSS Multi-column Layout properties (CSS Multi-column Layout Level 1).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_NONE } from '../states/pseudo-classes.js';
import { FCSS_COLOR_VALUES } from '../values/colors.js';

const COLUMN_RULE_STYLE_VALUES = [
  { classValue: 'none', cssValue: 'none' },
  { classValue: 'hidden', cssValue: 'hidden' },
  { classValue: 'dotted', cssValue: 'dotted' },
  { classValue: 'dashed', cssValue: 'dashed' },
  { classValue: 'solid', cssValue: 'solid' },
  { classValue: 'double', cssValue: 'double' },
  { classValue: 'groove', cssValue: 'groove' },
  { classValue: 'ridge', cssValue: 'ridge' },
  { classValue: 'inset', cssValue: 'inset' },
  { classValue: 'outset', cssValue: 'outset' },
];

export const COLUMNS_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'column-count',
    category: 'columns',
    specification: 'CSS Multi-column Layout Level 1',
    status: 'supported',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: '1', cssValue: '1' },
      { classValue: '2', cssValue: '2' },
      { classValue: '3', cssValue: '3' },
      { classValue: '4', cssValue: '4' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    numericBehavior: 'positive-integer',
  },
  {
    property: 'column-width',
    category: 'columns',
    specification: 'CSS Multi-column Layout Level 1',
    status: 'supported',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    numericBehavior: 'length',
  },
  {
    property: 'column-rule-width',
    category: 'columns',
    specification: 'CSS Multi-column Layout Level 1',
    status: 'supported',
    values: [
      { classValue: 'thin', cssValue: 'thin' },
      { classValue: 'medium', cssValue: 'medium' },
      { classValue: 'thick', cssValue: 'thick' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    numericBehavior: 'length',
  },
  {
    property: 'column-rule-style',
    category: 'columns',
    specification: 'CSS Multi-column Layout Level 1',
    status: 'supported',
    values: COLUMN_RULE_STYLE_VALUES,
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'column-rule-color',
    category: 'columns',
    specification: 'CSS Multi-column Layout Level 1',
    status: 'supported',
    values: [...FCSS_COLOR_VALUES],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'column-rule',
    category: 'columns',
    specification: 'CSS Multi-column Layout Level 1',
    status: 'preset-only',
    values: [
      { classValue: 'none', cssValue: 'none' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'column-fill',
    category: 'columns',
    specification: 'CSS Multi-column Layout Level 1',
    status: 'supported',
    values: [
      { classValue: 'auto', cssValue: 'auto' },
      { classValue: 'balance', cssValue: 'balance' },
      { classValue: 'balance-all', cssValue: 'balance-all' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
  {
    property: 'column-span',
    category: 'columns',
    specification: 'CSS Multi-column Layout Level 1',
    status: 'supported',
    values: [
      { classValue: 'none', cssValue: 'none' },
      { classValue: 'all', cssValue: 'all' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
  },
];

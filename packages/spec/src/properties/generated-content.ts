// @file packages/spec/src/properties/generated-content.ts
// @description Generated content properties — custom-only due to complex value syntax.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_NONE } from '../states/pseudo-classes.js';

export const GENERATED_CONTENT_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'content',
    category: 'generated-content',
    specification: 'CSS2.1 / CSS Generated Content Level 3',
    status: 'custom-only',
    values: [],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    notes:
      'The content property accepts strings, counter(), attr(), url(), and combinatorial values that cannot be expressed as a single FCSS class value; define content rules in project c- CSS instead',
  },
  {
    property: 'quotes',
    category: 'generated-content',
    specification: 'CSS2.1 / CSS Generated Content Level 3',
    status: 'custom-only',
    values: [],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    notes:
      'The quotes property requires multi-value string pairs (\'"" ""\' etc.) that cannot be expressed as a single FCSS class value; define quotes rules in project c- CSS instead',
  },
];

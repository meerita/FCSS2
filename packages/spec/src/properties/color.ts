// @file packages/spec/src/properties/color.ts
// @description Color, background-color, opacity, and related visual color properties.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from '../types.js';
import { PC_INTERACTION, PC_WITH_LINK, PC_NONE } from '../states/pseudo-classes.js';
import { SUPPORTED_ARIA_STATES } from '../states/aria.js';
import { FCSS_COLOR_VALUES } from '../values/colors.js';

const ARIA = SUPPORTED_ARIA_STATES;

export const COLOR_PROPERTIES: readonly FcssPropertyDefinition[] = [
  {
    property: 'color',
    category: 'color',
    specification: 'CSS2.1',
    status: 'supported',
    values: [...FCSS_COLOR_VALUES],
    supportsResponsive: true,
    supportedPseudoClasses: PC_WITH_LINK,
    supportedAriaStates: ARIA,
  },
  {
    property: 'background-color',
    category: 'color',
    specification: 'CSS2.1 / CSS Backgrounds and Borders Level 3',
    status: 'supported',
    values: [...FCSS_COLOR_VALUES],
    supportsResponsive: true,
    supportedPseudoClasses: PC_WITH_LINK,
    supportedAriaStates: ARIA,
  },
  {
    property: 'opacity',
    category: 'color',
    specification: 'CSS Color Level 3',
    status: 'supported',
    values: [
      { classValue: '0', cssValue: '0' },
      { classValue: '0.05', cssValue: '0.05' },
      { classValue: '0.1', cssValue: '0.1' },
      { classValue: '0.2', cssValue: '0.2' },
      { classValue: '0.25', cssValue: '0.25' },
      { classValue: '0.3', cssValue: '0.3' },
      { classValue: '0.4', cssValue: '0.4' },
      { classValue: '0.5', cssValue: '0.5' },
      { classValue: '0.6', cssValue: '0.6' },
      { classValue: '0.7', cssValue: '0.7' },
      { classValue: '0.75', cssValue: '0.75' },
      { classValue: '0.8', cssValue: '0.8' },
      { classValue: '0.9', cssValue: '0.9' },
      { classValue: '0.95', cssValue: '0.95' },
      { classValue: '1', cssValue: '1' },
    ],
    supportsResponsive: true,
    supportedPseudoClasses: PC_INTERACTION,
    supportedAriaStates: ARIA,
    numericBehavior: 'number',
  },
  // experimental legacy color properties
  {
    property: 'accent-color',
    category: 'color',
    specification: 'CSS Basic User Interface Level 4',
    status: 'experimental',
    values: [{ classValue: 'auto', cssValue: 'auto' }, ...FCSS_COLOR_VALUES],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: ARIA,
    notes:
      'CSS Basic UI Level 4 — outside the CSS3 profile; sets the accent color for form controls',
  },
  {
    property: 'mix-blend-mode',
    category: 'color',
    specification: 'CSS Compositing and Blending Level 1',
    status: 'experimental',
    values: [
      { classValue: 'normal', cssValue: 'normal' },
      { classValue: 'multiply', cssValue: 'multiply' },
      { classValue: 'screen', cssValue: 'screen' },
      { classValue: 'overlay', cssValue: 'overlay' },
      { classValue: 'darken', cssValue: 'darken' },
      { classValue: 'lighten', cssValue: 'lighten' },
      { classValue: 'color-dodge', cssValue: 'color-dodge' },
      { classValue: 'color-burn', cssValue: 'color-burn' },
      { classValue: 'hard-light', cssValue: 'hard-light' },
      { classValue: 'soft-light', cssValue: 'soft-light' },
      { classValue: 'difference', cssValue: 'difference' },
      { classValue: 'exclusion', cssValue: 'exclusion' },
      { classValue: 'hue', cssValue: 'hue' },
      { classValue: 'saturation', cssValue: 'saturation' },
      { classValue: 'color', cssValue: 'color' },
      { classValue: 'luminosity', cssValue: 'luminosity' },
    ],
    supportsResponsive: false,
    supportedPseudoClasses: PC_NONE,
    supportedAriaStates: [],
    notes: 'CSS Compositing Level 1 — outside the CSS3 profile',
  },
  {
    property: 'fill',
    category: 'color',
    specification: 'SVG / CSS Fill and Stroke Level 3',
    status: 'experimental',
    values: [{ classValue: 'none', cssValue: 'none' }, ...FCSS_COLOR_VALUES],
    supportsResponsive: false,
    supportedPseudoClasses: PC_INTERACTION,
    supportedAriaStates: ARIA,
    notes:
      'SVG-specific property (also in CSS Fill and Stroke Level 3) — outside the CSS3 profile; primarily relevant for SVG elements',
  },
];

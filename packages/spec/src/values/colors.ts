// @file packages/spec/src/values/colors.ts
// @description Built-in named color token catalog for FCSS (fcss-color-* custom properties).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssValueDefinition } from '../types.js';

export const FCSS_COLOR_VALUES: readonly FcssValueDefinition[] = [
  { classValue: 'black', cssValue: 'var(--fcss-color-black)', legacyAliases: ['var(--black)'] },
  { classValue: 'white', cssValue: 'var(--fcss-color-white)', legacyAliases: ['var(--white)'] },
  { classValue: 'blue', cssValue: 'var(--fcss-color-blue)', legacyAliases: ['var(--blue)'] },
  { classValue: 'green', cssValue: 'var(--fcss-color-green)', legacyAliases: ['var(--green)'] },
  { classValue: 'yellow', cssValue: 'var(--fcss-color-yellow)', legacyAliases: ['var(--yellow)'] },
  { classValue: 'orange', cssValue: 'var(--fcss-color-orange)', legacyAliases: ['var(--orange)'] },
  { classValue: 'red', cssValue: 'var(--fcss-color-red)', legacyAliases: ['var(--red)'] },
  { classValue: 'pink', cssValue: 'var(--fcss-color-pink)', legacyAliases: ['var(--pink)'] },
  { classValue: 'purple', cssValue: 'var(--fcss-color-purple)', legacyAliases: ['var(--purple)'] },
  { classValue: 'gray', cssValue: 'var(--fcss-color-gray)', legacyAliases: ['var(--gray)'] },
  {
    classValue: 'light-gray',
    cssValue: 'var(--fcss-color-light-gray)',
    legacyAliases: ['var(--light-gray)'],
  },
  {
    classValue: 'lighter-gray',
    cssValue: 'var(--fcss-color-lighter-gray)',
    legacyAliases: ['var(--lighter-gray)'],
  },
  {
    classValue: 'lightest-gray',
    cssValue: 'var(--fcss-color-lightest-gray)',
    legacyAliases: ['var(--lightest-gray)'],
  },
  {
    classValue: 'dark-gray',
    cssValue: 'var(--fcss-color-dark-gray)',
    legacyAliases: ['var(--dark-gray)'],
  },
  {
    classValue: 'darkest-gray',
    cssValue: 'var(--fcss-color-darkest-gray)',
    legacyAliases: ['var(--darkest-gray)'],
  },
  { classValue: 'transparent', cssValue: 'transparent' },
  { classValue: 'currentColor', cssValue: 'currentColor' },
];

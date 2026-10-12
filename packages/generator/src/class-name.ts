// @file packages/generator/src/class-name.ts
// @description Re-exports the class-name builders, which live in @functionalcss/spec so manifest expansion shares them.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export {
  buildBaseClassName,
  buildResponsiveClassName,
  buildPseudoClassName,
  buildAriaClassName,
  buildResponsivePseudoClassName,
  buildResponsiveAriaClassName,
} from '@functionalcss/spec';

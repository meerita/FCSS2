// @file packages/generator/src/class-name.ts
// @description Class name builders for FCSS utility variants (base, responsive, pseudo, ARIA).
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export function buildBaseClassName(property: string, classValue: string): string {
  return `${property}--${classValue}`;
}

export function buildResponsiveClassName(breakpoint: string, property: string, classValue: string): string {
  return `${breakpoint}-${property}--${classValue}`;
}

export function buildPseudoClassName(property: string, classValue: string, pseudo: string): string {
  return `${property}--${classValue}:${pseudo}`;
}

export function buildAriaClassName(
  property: string,
  classValue: string,
  ariaAttr: string,
  ariaValue: string,
): string {
  return `${property}--${classValue}:${ariaAttr}:${ariaValue}`;
}

export function buildResponsivePseudoClassName(
  breakpoint: string,
  property: string,
  classValue: string,
  pseudo: string,
): string {
  return `${breakpoint}-${property}--${classValue}:${pseudo}`;
}

export function buildResponsiveAriaClassName(
  breakpoint: string,
  property: string,
  classValue: string,
  ariaAttr: string,
  ariaValue: string,
): string {
  return `${breakpoint}-${property}--${classValue}:${ariaAttr}:${ariaValue}`;
}

// @file packages/spec/src/states/pseudo-classes.ts
// @description Approved CSS pseudo-class catalog for FCSS state variant support.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export type PseudoClassCategory = 'interaction' | 'form' | 'structural';

export interface FcssPseudoClassDefinition {
  readonly name: string;
  readonly category: PseudoClassCategory;
}

export const FCSS_PSEUDO_CLASSES: readonly FcssPseudoClassDefinition[] = [
  // interaction
  { name: 'hover', category: 'interaction' },
  { name: 'focus', category: 'interaction' },
  { name: 'focus-within', category: 'interaction' },
  { name: 'active', category: 'interaction' },
  { name: 'visited', category: 'interaction' },
  { name: 'link', category: 'interaction' },
  // form
  { name: 'enabled', category: 'form' },
  { name: 'disabled', category: 'form' },
  { name: 'checked', category: 'form' },
  { name: 'indeterminate', category: 'form' },
  { name: 'required', category: 'form' },
  { name: 'optional', category: 'form' },
  { name: 'valid', category: 'form' },
  { name: 'invalid', category: 'form' },
  { name: 'in-range', category: 'form' },
  { name: 'out-of-range', category: 'form' },
  { name: 'read-only', category: 'form' },
  { name: 'read-write', category: 'form' },
  // structural
  { name: 'first-child', category: 'structural' },
  { name: 'last-child', category: 'structural' },
  { name: 'only-child', category: 'structural' },
  { name: 'first-of-type', category: 'structural' },
  { name: 'last-of-type', category: 'structural' },
  { name: 'only-of-type', category: 'structural' },
  { name: 'empty', category: 'structural' },
  { name: 'target', category: 'structural' },
];

// Convenience subsets for property definitions.
export const PC_INTERACTION: string[] = ['hover', 'focus', 'focus-within', 'active'];
export const PC_WITH_LINK: string[] = ['hover', 'focus', 'focus-within', 'active', 'visited', 'link'];
export const PC_FORM: string[] = [
  'hover', 'focus', 'active',
  'enabled', 'disabled', 'checked', 'indeterminate',
  'required', 'optional', 'valid', 'invalid',
  'in-range', 'out-of-range', 'read-only', 'read-write',
];
export const PC_ALL: string[] = FCSS_PSEUDO_CLASSES.map((pc) => pc.name);
export const PC_NONE: string[] = [];

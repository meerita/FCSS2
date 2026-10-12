// @file packages/spec/src/breakpoints.ts
// @description Mobile-first min-width breakpoint definitions for FCSS (ADR-007).
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export interface FcssBreakpoint {
  readonly name: string;
  readonly minWidth: number;
  readonly strategy: 'min-width';
}

export const FCSS_BREAKPOINTS: readonly FcssBreakpoint[] = [
  { name: 'sm', minWidth: 576, strategy: 'min-width' },
  { name: 'md', minWidth: 768, strategy: 'min-width' },
  { name: 'lg', minWidth: 992, strategy: 'min-width' },
  { name: 'xl', minWidth: 1200, strategy: 'min-width' },
  { name: 'xxl', minWidth: 1400, strategy: 'min-width' },
];

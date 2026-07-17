// @file packages/spec/src/types.ts
// @description TypeScript interfaces for FCSS property and value catalog entries.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export type FcssPropertyStatus =
  'supported' | 'preset-only' | 'custom-only' | 'deprecated' | 'experimental';

export type FcssNumericBehavior =
  'integer' | 'positive-integer' | 'number' | 'length' | 'percentage' | 'length-percentage';

export interface FcssValueDefinition {
  readonly classValue: string;
  readonly cssValue: string;
  readonly legacyAliases?: readonly string[];
  readonly deprecated?: boolean;
  readonly notes?: string;
}

export interface FcssPropertyDefinition {
  readonly property: string;
  readonly category: string;
  readonly specification: string;
  readonly status: FcssPropertyStatus;
  readonly values: readonly FcssValueDefinition[];
  readonly supportsResponsive: boolean;
  readonly supportedPseudoClasses: readonly string[];
  readonly supportedAriaStates: readonly string[];
  readonly numericBehavior?: FcssNumericBehavior;
  readonly notes?: string;
}

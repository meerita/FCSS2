export interface ManifestCondition {
  type: 'pseudo' | 'aria';
  attribute?: string;
  value?: string;
}
export interface ManifestEntry {
  className: string;
  selector: string;
  property: string;
  value: string;
  condition?: ManifestCondition;
  breakpoint?: string;
  category: string;
  deprecated?: boolean;
  source: string;
}
export declare function escapeClassName(className: string): string;
export declare function buildBaseClassName(property: string, classValue: string): string;
export declare function buildResponsiveClassName(
  breakpoint: string,
  property: string,
  classValue: string,
): string;
export declare function buildPseudoClassName(
  property: string,
  classValue: string,
  pseudo: string,
): string;
export declare function buildAriaClassName(
  property: string,
  classValue: string,
  ariaAttr: string,
  ariaValue: string,
): string;
export declare function buildResponsivePseudoClassName(
  breakpoint: string,
  property: string,
  classValue: string,
  pseudo: string,
): string;
export declare function buildResponsiveAriaClassName(
  breakpoint: string,
  property: string,
  classValue: string,
  ariaAttr: string,
  ariaValue: string,
): string;
export declare function buildSelector(
  className: string,
  pseudo?: string,
  ariaAttr?: string,
  ariaValue?: string,
): string;
export declare const COMPACT_MANIFEST_FORMAT = 'fcss-manifest-compact';
/** [classValue, cssValue] or [classValue, cssValue, 1] when the value is deprecated. */
export type CompactManifestValue = [string, string] | [string, string, 1];
export interface CompactManifestProperty {
  property: string;
  category: string;
  source: string;
  pseudo: string[];
  aria: string[];
  responsive: boolean;
  values: CompactManifestValue[];
}
export interface CompactManifest {
  format: typeof COMPACT_MANIFEST_FORMAT;
  version: 1;
  breakpoints: string[];
  ariaValues: Record<string, string[]>;
  properties: CompactManifestProperty[];
}
export declare function isCompactManifest(value: unknown): value is CompactManifest;
/** Expands a compact manifest into the full entry list, in generation order. */
export declare function expandManifest(compact: CompactManifest): ManifestEntry[];
/**
 * Normalizes parsed manifest JSON to an entry list. Accepts the compact format
 * (`@functionalcss/core/manifest.json`) and the flat entry array (`fcss build` output).
 */
export declare function parseManifest(json: unknown): ManifestEntry[];
//# sourceMappingURL=manifest.d.ts.map

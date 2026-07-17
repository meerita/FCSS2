// @file packages/generator/src/manifest.ts
// @description Manifest entry type and builder for the FCSS utility catalog.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

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

export function buildManifestEntry(params: {
  className: string;
  selector: string;
  property: string;
  value: string;
  condition?: ManifestCondition;
  breakpoint?: string;
  category: string;
  deprecated?: boolean;
  source: string;
}): ManifestEntry {
  return { ...params };
}

// @file packages/scanner/src/extractors/types.ts
// @description Shared types for FCSS extractor modules.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export interface DynamicWarning {
  file: string;
  line: number;
  fragment: string;
}

export interface ExtractionResult {
  classes: Set<string>;
  warnings: DynamicWarning[];
}

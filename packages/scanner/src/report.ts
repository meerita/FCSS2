// @file packages/scanner/src/report.ts
// @description Usage report builder for the FCSS scanner.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { DynamicWarning } from './extractors/types.js';

export interface ScanReport {
  filesScanned: number;
  classesFound: number;
  dynamicWarnings: DynamicWarning[];
  safelistedClasses: number;
}

export function buildReport(
  filesScanned: number,
  usedClasses: ReadonlySet<string>,
  safelistedCount: number,
  dynamicWarnings: DynamicWarning[],
): ScanReport {
  return {
    filesScanned,
    classesFound: usedClasses.size,
    dynamicWarnings,
    safelistedClasses: safelistedCount,
  };
}

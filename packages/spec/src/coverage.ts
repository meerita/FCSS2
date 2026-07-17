// @file packages/spec/src/coverage.ts
// @description Coverage report script — counts FCSS_PROPERTIES entries by status.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { FCSS_PROPERTIES } from './index.js';
import type { FcssPropertyStatus } from './types.js';

export interface CoverageReport {
  total: number;
  byStatus: Record<FcssPropertyStatus, number>;
}

export function generateCoverage(): CoverageReport {
  const byStatus: Record<FcssPropertyStatus, number> = {
    supported: 0,
    'preset-only': 0,
    'custom-only': 0,
    deprecated: 0,
    experimental: 0,
  };

  for (const def of FCSS_PROPERTIES) {
    byStatus[def.status] = (byStatus[def.status] ?? 0) + 1;
  }

  return { total: FCSS_PROPERTIES.length, byStatus };
}

const report = generateCoverage();

console.log('# FCSS Spec Coverage Report');
console.log('');
console.log(`Total properties: ${report.total}`);
console.log('');
console.log('## By status');
console.log('');
for (const [status, count] of Object.entries(report.byStatus) as [FcssPropertyStatus, number][]) {
  console.log(`- ${status}: ${count}`);
}
console.log('');
console.log('## Property list by status');
console.log('');
for (const status of [
  'supported',
  'preset-only',
  'custom-only',
  'deprecated',
  'experimental',
] as FcssPropertyStatus[]) {
  const props = FCSS_PROPERTIES.filter((d) => d.status === status).map((d) => d.property);
  if (props.length > 0) {
    console.log(`### ${status} (${props.length})`);
    console.log('');
    for (const prop of props) {
      console.log(`- ${prop}`);
    }
    console.log('');
  }
}

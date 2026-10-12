// @file packages/generator/src/statistics.ts
// @description Statistics builder — counts utilities and measures CSS byte sizes.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { gzip } from 'node:zlib';
import { promisify } from 'node:util';
import { minifyCss } from './minify.js';
import type { GenerateResult } from './generate.js';
import type { BundleOutput } from './bundles.js';

const gzipAsync = promisify(gzip);

export interface FcssStatistics {
  utilities: number;
  baseUtilities: number;
  pseudoUtilities: number;
  ariaUtilities: number;
  responsiveUtilities: number;
  rawBytes: number;
  minifiedBytes: number;
  gzipBytes: number;
}

export async function buildStatistics(
  result: GenerateResult,
  bundles: BundleOutput,
): Promise<FcssStatistics> {
  let baseUtilities = 0;
  let pseudoUtilities = 0;
  let ariaUtilities = 0;
  let responsiveUtilities = 0;

  for (const rule of result.rules) {
    if (rule.mediaQuery) {
      responsiveUtilities++;
    } else if (rule.selector.includes('[aria-')) {
      ariaUtilities++;
    } else if (/:[a-z-]+$/.test(rule.selector)) {
      pseudoUtilities++;
    } else {
      baseUtilities++;
    }
  }

  const fullCss = bundles['full.css'];
  const minified = minifyCss(fullCss);
  const rawBytes = Buffer.byteLength(fullCss, 'utf8');
  const minifiedBytes = Buffer.byteLength(minified, 'utf8');
  const gzipBuffer = await gzipAsync(Buffer.from(minified, 'utf8'));
  const gzipBytes = gzipBuffer.length;

  return {
    utilities: result.rules.length,
    baseUtilities,
    pseudoUtilities,
    ariaUtilities,
    responsiveUtilities,
    rawBytes,
    minifiedBytes,
    gzipBytes,
  };
}

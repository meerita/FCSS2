// @file packages/generator/src/index.ts
// @description Public API entry point for @fcss/generator.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export { escapeClassName } from './escape.js';

export {
  buildBaseClassName,
  buildResponsiveClassName,
  buildPseudoClassName,
  buildAriaClassName,
  buildResponsivePseudoClassName,
  buildResponsiveAriaClassName,
} from './class-name.js';

export { buildSelector } from './selector.js';
export { buildDeclaration } from './declaration.js';
export type { ManifestCondition, ManifestEntry } from './manifest.js';
export { buildManifestEntry } from './manifest.js';
export type { GeneratedRule, GenerateResult } from './generate.js';
export { generate, GENERATED_FILE_HEADER } from './generate.js';
export type { BundleOutput } from './bundles.js';
export { buildBundles } from './bundles.js';
export { minifyCss } from './minify.js';
export type { FcssStatistics } from './statistics.js';
export { buildStatistics } from './statistics.js';
export { validateCss } from './validate-css.js';

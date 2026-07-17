// @file packages/spec/src/validate.ts
// @description Schema validator for FcssPropertyDefinition entries.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { FcssPropertyDefinition } from './types.js';

const VALID_STATUSES = new Set([
  'supported',
  'preset-only',
  'custom-only',
  'deprecated',
  'experimental',
]);

const VALID_NUMERIC_BEHAVIORS = new Set([
  'integer',
  'positive-integer',
  'number',
  'length',
  'percentage',
  'length-percentage',
]);

export function validatePropertyDefinition(def: FcssPropertyDefinition): void {
  if (!def.property) throw new Error('property must be a non-empty string');
  const p = def.property;

  if (!def.category) throw new Error(`[${p}] category is required`);
  if (!def.specification) throw new Error(`[${p}] specification is required`);
  if (!VALID_STATUSES.has(def.status)) throw new Error(`[${p}] invalid status: ${def.status}`);
  if (def.status === 'custom-only' && !def.notes) {
    throw new Error(`[${p}] custom-only properties must include a notes field`);
  }
  if (!Array.isArray(def.values)) throw new Error(`[${p}] values must be an array`);
  if (typeof def.supportsResponsive !== 'boolean') {
    throw new Error(`[${p}] supportsResponsive must be boolean`);
  }
  if (!Array.isArray(def.supportedPseudoClasses)) {
    throw new Error(`[${p}] supportedPseudoClasses must be an array`);
  }
  if (!Array.isArray(def.supportedAriaStates)) {
    throw new Error(`[${p}] supportedAriaStates must be an array`);
  }
  if (def.numericBehavior !== undefined && !VALID_NUMERIC_BEHAVIORS.has(def.numericBehavior)) {
    throw new Error(`[${p}] invalid numericBehavior: ${def.numericBehavior}`);
  }

  for (const v of def.values) {
    if (!v.classValue) throw new Error(`[${p}] a value entry is missing classValue`);
    if (!v.cssValue) throw new Error(`[${p}] value "${v.classValue}" is missing cssValue`);
  }
}

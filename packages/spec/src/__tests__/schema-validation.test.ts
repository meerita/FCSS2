// @file packages/spec/src/__tests__/schema-validation.test.ts
// @description Schema validation test — every entry in FCSS_PROPERTIES must pass the validator.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { FCSS_PROPERTIES } from '../index.js';
import { validatePropertyDefinition } from '../validate.js';

describe('FCSS_PROPERTIES schema validation', () => {
  it('exports a non-empty array', () => {
    expect(FCSS_PROPERTIES.length).toBeGreaterThan(0);
  });

  for (const def of FCSS_PROPERTIES) {
    it(`validates property: ${def.property}`, () => {
      expect(() => validatePropertyDefinition(def)).not.toThrow();
    });
  }
});

describe('FCSS_PROPERTIES uniqueness', () => {
  it('has no duplicate property names', () => {
    const names = FCSS_PROPERTIES.map((d) => d.property);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });
});

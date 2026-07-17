// @file packages/generator/src/__tests__/generate.test.ts
// @description Unit tests for the generate() pipeline.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { generate } from '../generate.js';
import type { FcssPropertyDefinition } from '@fcss/spec';

describe('generate() — basic output', () => {
  it('returns rules and manifest arrays', () => {
    const result = generate();
    expect(Array.isArray(result.rules)).toBe(true);
    expect(Array.isArray(result.manifest)).toBe(true);
  });

  it('generates more than zero rules', () => {
    const result = generate();
    expect(result.rules.length).toBeGreaterThan(0);
  });

  it('sample of rules all have selector and declaration', () => {
    const result = generate();
    // Spot-check first, middle, and last 10 rules — avoids iterating all rules at once.
    const sample = [
      ...result.rules.slice(0, 10),
      ...result.rules.slice(
        Math.floor(result.rules.length / 2),
        Math.floor(result.rules.length / 2) + 10,
      ),
      ...result.rules.slice(-10),
    ];
    for (const rule of sample) {
      expect(typeof rule.selector).toBe('string');
      expect(rule.selector.length).toBeGreaterThan(0);
      expect(typeof rule.declaration).toBe('string');
      expect(rule.declaration.length).toBeGreaterThan(0);
    }
  });

  it('rules count equals manifest count', () => {
    const result = generate();
    expect(result.rules.length).toBe(result.manifest.length);
  });
});

describe('generate() — specific utilities', () => {
  it('includes display--flex', () => {
    const result = generate();
    const rule = result.rules.find((r) => r.selector === '.display--flex');
    expect(rule).toBeDefined();
    expect(rule?.declaration).toBe('display: flex');
  });

  it('includes display--block:aria-expanded:true with correct selector', () => {
    const result = generate();
    const rule = result.rules.find(
      (r) => r.selector.includes("[aria-expanded='true']") && r.selector.includes('display'),
    );
    expect(rule).toBeDefined();
    expect(rule?.selector).toContain("[aria-expanded='true']");
  });

  it('includes responsive rule with mediaQuery', () => {
    const result = generate();
    const rule = result.rules.find((r) => r.mediaQuery?.includes('768px'));
    expect(rule).toBeDefined();
    expect(rule?.mediaQuery).toBe('@media (min-width: 768px)');
  });
});

describe('generate() — status filtering', () => {
  it('does not generate rules for experimental properties', () => {
    const experimentalProp: FcssPropertyDefinition = {
      property: 'experimental-prop',
      category: 'test',
      specification: 'test',
      status: 'experimental',
      values: [{ classValue: 'val', cssValue: 'val' }],
      supportsResponsive: false,
      supportedPseudoClasses: [],
      supportedAriaStates: [],
    };
    const result = generate([experimentalProp]);
    expect(result.rules.length).toBe(0);
  });

  it('does not generate rules for deprecated properties', () => {
    const deprecatedProp: FcssPropertyDefinition = {
      property: 'deprecated-prop',
      category: 'test',
      specification: 'test',
      status: 'deprecated',
      values: [{ classValue: 'val', cssValue: 'val' }],
      supportsResponsive: false,
      supportedPseudoClasses: [],
      supportedAriaStates: [],
    };
    const result = generate([deprecatedProp]);
    expect(result.rules.length).toBe(0);
  });

  it('does not generate rules for custom-only properties', () => {
    const customProp: FcssPropertyDefinition = {
      property: 'custom-only-prop',
      category: 'test',
      specification: 'test',
      status: 'custom-only',
      values: [{ classValue: 'val', cssValue: 'val' }],
      supportsResponsive: false,
      supportedPseudoClasses: [],
      supportedAriaStates: [],
    };
    const result = generate([customProp]);
    expect(result.rules.length).toBe(0);
  });

  it('generates rules for supported properties', () => {
    const prop: FcssPropertyDefinition = {
      property: 'test-prop',
      category: 'test',
      specification: 'test',
      status: 'supported',
      values: [{ classValue: 'val', cssValue: 'testval' }],
      supportsResponsive: false,
      supportedPseudoClasses: [],
      supportedAriaStates: [],
    };
    const result = generate([prop]);
    expect(result.rules.length).toBeGreaterThan(0);
    expect(result.rules[0]?.selector).toBe('.test-prop--val');
    expect(result.rules[0]?.declaration).toBe('test-prop: testval');
  });

  it('generates rules for preset-only properties', () => {
    const prop: FcssPropertyDefinition = {
      property: 'preset-prop',
      category: 'test',
      specification: 'test',
      status: 'preset-only',
      values: [{ classValue: 'v', cssValue: 'cssv' }],
      supportsResponsive: false,
      supportedPseudoClasses: [],
      supportedAriaStates: [],
    };
    const result = generate([prop]);
    expect(result.rules.length).toBeGreaterThan(0);
  });
});

describe('generate() — duplicate detection', () => {
  it('throws on duplicate selector', () => {
    const prop: FcssPropertyDefinition = {
      property: 'dup-prop',
      category: 'test',
      specification: 'test',
      status: 'supported',
      values: [
        { classValue: 'dup', cssValue: 'val1' },
        { classValue: 'dup', cssValue: 'val2' },
      ],
      supportsResponsive: false,
      supportedPseudoClasses: [],
      supportedAriaStates: [],
    };
    expect(() => generate([prop])).toThrow(/Duplicate selector/);
  });
});

describe('generate() — no duplicate selectors in full spec', () => {
  it('full FCSS_PROPERTIES produces no duplicate selectors', () => {
    expect(() => generate()).not.toThrow();
  });
});

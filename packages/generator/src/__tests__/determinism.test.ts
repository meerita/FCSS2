// @file packages/generator/src/__tests__/determinism.test.ts
// @description Byte-determinism test — generate() must produce identical output on repeated calls.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { generate } from '../generate.js';
import { FCSS_PROPERTIES } from '@fcss/spec';

describe('generate() is deterministic', () => {
  it('produces byte-identical output on two successive calls', () => {
    const first = generate(FCSS_PROPERTIES);
    const second = generate(FCSS_PROPERTIES);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });

  it('produces the same number of rules on repeated calls', () => {
    const first = generate(FCSS_PROPERTIES);
    const second = generate(FCSS_PROPERTIES);
    expect(first.rules.length).toBe(second.rules.length);
  });

  it('produces the same manifest entries on repeated calls', () => {
    const first = generate(FCSS_PROPERTIES);
    const second = generate(FCSS_PROPERTIES);
    expect(first.manifest.length).toBe(second.manifest.length);
    for (let i = 0; i < first.manifest.length; i++) {
      expect(JSON.stringify(first.manifest[i])).toBe(JSON.stringify(second.manifest[i]));
    }
  });

  it('produces selectors in identical order on repeated calls', () => {
    const first = generate(FCSS_PROPERTIES);
    const second = generate(FCSS_PROPERTIES);
    const firstSelectors = first.rules.map((r) => r.selector);
    const secondSelectors = second.rules.map((r) => r.selector);
    expect(firstSelectors).toEqual(secondSelectors);
  });
});

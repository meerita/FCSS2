// @file packages/generator/src/__tests__/compact-manifest.test.ts
// @description Verifies the compact manifest expands to exactly the generated manifest.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { expandManifest, parseManifest } from '@functionalcss/spec';
import { generate } from '../generate.js';
import { buildBundles } from '../bundles.js';

describe('compact manifest', () => {
  const result = generate();

  it('expands to the full generated manifest, in order', () => {
    expect(expandManifest(result.compactManifest)).toEqual(result.manifest);
  });

  it('survives a JSON round trip', () => {
    const json: unknown = JSON.parse(buildBundles(result)['manifest.json']);
    expect(parseManifest(json)).toEqual(result.manifest);
  });

  it('is at least 100x smaller than the expanded manifest', () => {
    const compact = JSON.stringify(result.compactManifest).length;
    const expanded = JSON.stringify(result.manifest).length;
    expect(compact * 100).toBeLessThan(expanded);
  });

  it('passes flat entry arrays through unchanged', () => {
    const flat = [{ className: 'a', selector: '.a' }];
    expect(parseManifest(flat)).toBe(flat);
  });

  it('rejects other shapes', () => {
    expect(() => parseManifest({})).toThrow();
  });
});

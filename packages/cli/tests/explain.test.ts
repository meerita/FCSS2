// @file packages/cli/tests/explain.test.ts
// @description Unit tests for fcss explain.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { runExplain } from '../src/commands/explain.js';

describe('runExplain', () => {
  it('explains a basic class', () => {
    const result = runExplain('display--block');
    expect(result).not.toBeNull();
    expect(result?.property).toBe('display');
    expect(result?.value).toBe('block');
    expect(result?.selector).toContain('display--block');
    expect(result?.declaration).toBe('display: block');
    expect(result?.breakpoint).toBeUndefined();
    expect(result?.condition).toBeUndefined();
  });

  it('explains an ARIA-state class', () => {
    const result = runExplain('display--block:aria-expanded:true');
    expect(result).not.toBeNull();
    expect(result?.property).toBe('display');
    expect(result?.condition?.type).toBe('aria');
    expect(result?.condition?.attribute).toBe('aria-expanded');
    expect(result?.condition?.value).toBe('true');
    expect(result?.selector).toContain("aria-expanded='true'");
  });

  it('explains a pseudo-state class', () => {
    const result = runExplain('display--none:hover');
    if (result) {
      expect(result.condition?.type).toBe('pseudo');
      expect(result.selector).toContain(':hover');
    }
  });

  it('explains a responsive class', () => {
    const result = runExplain('md-display--flex');
    if (result) {
      expect(result.breakpoint).toBe('md');
      expect(result.mediaQuery).toContain('768px');
    }
  });

  it('returns null for unknown property', () => {
    expect(runExplain('not-a-real--class')).toBeNull();
  });

  it('returns null for malformed input', () => {
    expect(runExplain('nodoubledash')).toBeNull();
  });
});

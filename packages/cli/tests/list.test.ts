// @file packages/cli/tests/list.test.ts
// @description Unit tests for fcss list.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { runList } from '../src/commands/list.js';

describe('runList', () => {
  it('returns a non-empty list of classes', () => {
    const entries = runList();
    expect(entries.length).toBeGreaterThan(100);
  });

  it('filters by property', () => {
    const entries = runList({ property: 'display' });
    expect(entries.every((e) => e.property === 'display')).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
  });

  it('filters by category', () => {
    const entries = runList({ category: 'Box Model' });
    expect(entries.every((e) => e.category === 'Box Model')).toBe(true);
  });

  it('each entry has className, property, value, category', () => {
    const [first] = runList({ property: 'display' });
    expect(first).toBeDefined();
    expect(first?.className).toBeTruthy();
    expect(first?.property).toBe('display');
    expect(first?.value).toBeTruthy();
    expect(first?.category).toBeTruthy();
  });
});

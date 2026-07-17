// @file packages/scanner/tests/safelist.test.ts
// @description Unit tests for the safelist module.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { applySafelist } from '../src/safelist.js';

const MANIFEST_CLASSES = new Set([
  'display--flex',
  'display--block',
  'display--none',
  'color--blue',
  'color--red',
  'padding--8',
  'padding--16',
]);

describe('applySafelist — exact', () => {
  it('adds exact classes to safelisted set', () => {
    const { safelistedClasses } = applySafelist(
      MANIFEST_CLASSES,
      { exact: ['display--flex', 'color--blue'] },
      MANIFEST_CLASSES,
    );
    expect(safelistedClasses.has('display--flex')).toBe(true);
    expect(safelistedClasses.has('color--blue')).toBe(true);
  });

  it('throws for exact class not in manifest', () => {
    expect(() =>
      applySafelist(MANIFEST_CLASSES, { exact: ['nonexistent--class'] }, MANIFEST_CLASSES),
    ).toThrow(/not in the manifest/);
  });
});

describe('applySafelist — patterns', () => {
  it('retains classes matching RegExp pattern', () => {
    const { safelistedClasses } = applySafelist(
      MANIFEST_CLASSES,
      { patterns: [/^display--/] },
      MANIFEST_CLASSES,
    );
    expect(safelistedClasses.has('display--flex')).toBe(true);
    expect(safelistedClasses.has('display--block')).toBe(true);
    expect(safelistedClasses.has('display--none')).toBe(true);
    expect(safelistedClasses.has('color--blue')).toBe(false);
  });

  it('retains classes matching string pattern (converted to RegExp)', () => {
    const { safelistedClasses } = applySafelist(
      MANIFEST_CLASSES,
      { patterns: ['^color--'] },
      MANIFEST_CLASSES,
    );
    expect(safelistedClasses.has('color--blue')).toBe(true);
    expect(safelistedClasses.has('color--red')).toBe(true);
  });
});

describe('applySafelist — no options', () => {
  it('returns empty set when no safelist provided', () => {
    const { safelistedClasses } = applySafelist(MANIFEST_CLASSES, undefined, MANIFEST_CLASSES);
    expect(safelistedClasses.size).toBe(0);
  });
});

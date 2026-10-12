// @file packages/generator/src/__tests__/declaration.test.ts
// @description Unit tests for buildDeclaration with all numeric behaviors.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { buildDeclaration } from '../declaration.js';

describe('buildDeclaration — no numericBehavior', () => {
  it('formats a keyword value', () => {
    expect(buildDeclaration('display', 'flex')).toBe('display: flex');
  });

  it('formats a pre-computed CSS value', () => {
    expect(buildDeclaration('margin-left', '16px')).toBe('margin-left: 16px');
  });

  it('formats a color value', () => {
    expect(buildDeclaration('color', 'var(--fcss-color-primary)')).toBe(
      'color: var(--fcss-color-primary)',
    );
  });
});

describe('buildDeclaration — length', () => {
  it('appends px to positive integer', () => {
    expect(buildDeclaration('margin-left', '16', 'length')).toBe('margin-left: 16px');
  });

  it('returns 0 without unit for zero', () => {
    expect(buildDeclaration('margin-top', '0', 'length')).toBe('margin-top: 0');
  });

  it('appends px to negative integer', () => {
    expect(buildDeclaration('margin-left', '-8', 'length')).toBe('margin-left: -8px');
  });

  it('appends px to decimal', () => {
    expect(buildDeclaration('font-size', '1.5', 'length')).toBe('font-size: 1.5px');
  });

  it('preserves percentage as-is', () => {
    expect(buildDeclaration('width', '100%', 'length')).toBe('width: 100%');
  });

  it('passes through non-numeric keyword', () => {
    expect(buildDeclaration('margin-left', 'auto', 'length')).toBe('margin-left: auto');
  });
});

describe('buildDeclaration — length-percentage', () => {
  it('appends px to integer', () => {
    expect(buildDeclaration('width', '32', 'length-percentage')).toBe('width: 32px');
  });

  it('returns 0 for zero', () => {
    expect(buildDeclaration('padding', '0', 'length-percentage')).toBe('padding: 0');
  });

  it('appends px to negative', () => {
    expect(buildDeclaration('margin-left', '-8', 'length-percentage')).toBe('margin-left: -8px');
  });

  it('preserves percentage', () => {
    expect(buildDeclaration('width', '100%', 'length-percentage')).toBe('width: 100%');
  });

  it('preserves 50% percentage', () => {
    expect(buildDeclaration('width', '50%', 'length-percentage')).toBe('width: 50%');
  });
});

describe('buildDeclaration — integer', () => {
  it('emits unitless integer (font-weight)', () => {
    expect(buildDeclaration('font-weight', '700', 'integer')).toBe('font-weight: 700');
  });

  it('emits unitless negative integer (z-index)', () => {
    expect(buildDeclaration('z-index', '-1', 'integer')).toBe('z-index: -1');
  });

  it('emits unitless zero', () => {
    expect(buildDeclaration('z-index', '0', 'integer')).toBe('z-index: 0');
  });
});

describe('buildDeclaration — positive-integer', () => {
  it('emits unitless positive integer (flex-grow)', () => {
    expect(buildDeclaration('flex-grow', '1', 'positive-integer')).toBe('flex-grow: 1');
  });

  it('emits unitless 3', () => {
    expect(buildDeclaration('order', '3', 'positive-integer')).toBe('order: 3');
  });
});

describe('buildDeclaration — number', () => {
  it('emits unitless decimal (opacity)', () => {
    expect(buildDeclaration('opacity', '0.5', 'number')).toBe('opacity: 0.5');
  });

  it('emits unitless 0', () => {
    expect(buildDeclaration('opacity', '0', 'number')).toBe('opacity: 0');
  });

  it('emits unitless 1', () => {
    expect(buildDeclaration('opacity', '1', 'number')).toBe('opacity: 1');
  });
});

describe('buildDeclaration — percentage', () => {
  it('passes through percentage value as-is', () => {
    expect(buildDeclaration('width', '50%', 'percentage')).toBe('width: 50%');
  });
});

describe('buildDeclaration — no !important', () => {
  it('does not emit !important', () => {
    const result = buildDeclaration('display', 'flex');
    expect(result).not.toContain('!important');
  });
});

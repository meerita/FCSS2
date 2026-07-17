// @file packages/cli/tests/config.test.ts
// @description Unit tests for FcssConfig validation and defineConfig.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { validateConfig, ConfigValidationError } from '../src/config/validate.js';
import { defineConfig } from '../src/config/define-config.js';

describe('validateConfig', () => {
  it('accepts an empty config object', () => {
    expect(validateConfig({})).toEqual([]);
  });

  it('rejects a non-object config', () => {
    const errors = validateConfig(null);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.field).toBe('config');
  });

  it('rejects a color that is not a hex string', () => {
    const errors = validateConfig({ colors: { brand: 'blue' } });
    expect(errors.some((e) => e.field === 'colors.brand')).toBe(true);
  });

  it('accepts valid hex colors', () => {
    const errors = validateConfig({
      colors: { primary: '#7557ff', accent: '#abc', alpha: '#7557ff88' },
    });
    expect(errors).toEqual([]);
  });

  it('rejects an invalid breakpoint minWidth', () => {
    const errors = validateConfig({ breakpoints: { custom: { minWidth: -1 } } });
    expect(errors.some((e) => e.field.includes('minWidth'))).toBe(true);
  });

  it('accepts a valid breakpoint', () => {
    const errors = validateConfig({ breakpoints: { tablet: { minWidth: 800 } } });
    expect(errors).toEqual([]);
  });

  it('rejects a dataState with non-data-* attribute', () => {
    const errors = validateConfig({
      dataStates: [{ attribute: 'state', value: 'active', properties: ['color'] }],
    });
    expect(errors.some((e) => e.field.includes('attribute'))).toBe(true);
  });

  it('accepts a valid dataState', () => {
    const errors = validateConfig({
      dataStates: [{ attribute: 'data-state', value: 'active', properties: ['color'] }],
    });
    expect(errors).toEqual([]);
  });

  it('rejects empty properties array in dataState', () => {
    const errors = validateConfig({
      dataStates: [{ attribute: 'data-state', value: 'active', properties: [] }],
    });
    expect(errors.some((e) => e.field.includes('properties'))).toBe(true);
  });

  it('rejects invalid content (non-array)', () => {
    const errors = validateConfig({ content: 'src/**' });
    expect(errors.some((e) => e.field === 'content')).toBe(true);
  });

  it('accepts valid content patterns', () => {
    const errors = validateConfig({ content: ['./src/**/*.tsx', '!node_modules/**'] });
    expect(errors).toEqual([]);
  });

  it('rejects safelist item that is neither string nor pattern', () => {
    const errors = validateConfig({ safelist: [42] });
    expect(errors.some((e) => e.field.startsWith('safelist'))).toBe(true);
  });

  it('accepts safelist with string and RegExp pattern', () => {
    const errors = validateConfig({ safelist: ['display--flex', { pattern: /color--.*/ }] });
    expect(errors).toEqual([]);
  });
});

describe('defineConfig', () => {
  it('returns config with default content when none provided', () => {
    const result = defineConfig({});
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content!.length).toBeGreaterThan(0);
  });

  it('preserves provided content patterns', () => {
    const result = defineConfig({ content: ['./src/**/*.tsx'] });
    expect(result.content).toEqual(['./src/**/*.tsx']);
  });

  it('throws ConfigValidationError on invalid config', () => {
    expect(() => defineConfig({ colors: { brand: 'not-a-hex' } })).toThrow(ConfigValidationError);
  });

  it('includes precise error message for invalid color', () => {
    try {
      defineConfig({ colors: { brand: 'not-a-hex' } });
      expect.fail('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ConfigValidationError);
      expect((err as ConfigValidationError).message).toContain('colors.brand');
      expect((err as ConfigValidationError).message).toContain('#');
    }
  });

  it('merges custom breakpoints', () => {
    const result = defineConfig({ breakpoints: { tablet: { minWidth: 800 } } });
    expect(result.breakpoints?.['tablet']?.minWidth).toBe(800);
  });
});

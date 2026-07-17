// @file packages/language-service/tests/parser.test.ts
// @description Unit tests for the FCSS class string parser.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { parseClass } from '../src/parser';

describe('parseClass', () => {
  describe('base class (no breakpoint, no condition)', () => {
    it('parses a simple property--value class', () => {
      const t = parseClass('display--flex');
      expect(t.property).toBe('display');
      expect(t.classValue).toBe('flex');
      expect(t.breakpoint).toBeUndefined();
      expect(t.conditionType).toBeUndefined();
      expect(t.isValid).toBe(true);
      expect(t.errors).toHaveLength(0);
    });

    it('parses a class with a numeric value', () => {
      const t = parseClass('margin--16');
      expect(t.property).toBe('margin');
      expect(t.classValue).toBe('16');
      expect(t.isValid).toBe(true);
    });

    it('parses a class with a decimal value', () => {
      const t = parseClass('opacity--0.5');
      expect(t.property).toBe('opacity');
      expect(t.classValue).toBe('0.5');
      expect(t.isValid).toBe(true);
    });

    it('parses a class with a percentage value', () => {
      const t = parseClass('width--100%');
      expect(t.property).toBe('width');
      expect(t.classValue).toBe('100%');
      expect(t.isValid).toBe(true);
    });

    it('parses a class with a negative value', () => {
      const t = parseClass('margin-left---8');
      expect(t.property).toBe('margin-left');
      expect(t.classValue).toBe('-8');
      expect(t.isValid).toBe(true);
    });

    it('parses a multi-word property', () => {
      const t = parseClass('flex-direction--column');
      expect(t.property).toBe('flex-direction');
      expect(t.classValue).toBe('column');
      expect(t.isValid).toBe(true);
    });
  });

  describe('responsive (breakpoint prefix)', () => {
    it('parses sm breakpoint', () => {
      const t = parseClass('sm-display--flex');
      expect(t.breakpoint).toBe('sm');
      expect(t.property).toBe('display');
      expect(t.classValue).toBe('flex');
      expect(t.isValid).toBe(true);
    });

    it('parses md breakpoint', () => {
      const t = parseClass('md-display--block');
      expect(t.breakpoint).toBe('md');
      expect(t.isValid).toBe(true);
    });

    it('parses lg breakpoint', () => {
      const t = parseClass('lg-margin--8');
      expect(t.breakpoint).toBe('lg');
      expect(t.isValid).toBe(true);
    });

    it('parses xl breakpoint', () => {
      const t = parseClass('xl-padding--16');
      expect(t.breakpoint).toBe('xl');
      expect(t.isValid).toBe(true);
    });

    it('parses xxl breakpoint', () => {
      const t = parseClass('xxl-font-size--2rem');
      expect(t.breakpoint).toBe('xxl');
      expect(t.property).toBe('font-size');
      expect(t.classValue).toBe('2rem');
      expect(t.isValid).toBe(true);
    });
  });

  describe('pseudo-class condition', () => {
    it('parses :hover condition', () => {
      const t = parseClass('display--flex:hover');
      expect(t.property).toBe('display');
      expect(t.classValue).toBe('flex');
      expect(t.conditionType).toBe('pseudo');
      expect(t.conditionValue).toBe('hover');
      expect(t.conditionAttr).toBeUndefined();
      expect(t.isValid).toBe(true);
    });

    it('parses :focus condition', () => {
      const t = parseClass('color--red:focus');
      expect(t.conditionType).toBe('pseudo');
      expect(t.conditionValue).toBe('focus');
      expect(t.isValid).toBe(true);
    });

    it('parses :active condition', () => {
      const t = parseClass('background-color--blue:active');
      expect(t.conditionType).toBe('pseudo');
      expect(t.conditionValue).toBe('active');
      expect(t.isValid).toBe(true);
    });

    it('parses breakpoint + pseudo', () => {
      const t = parseClass('md-display--block:hover');
      expect(t.breakpoint).toBe('md');
      expect(t.conditionType).toBe('pseudo');
      expect(t.conditionValue).toBe('hover');
      expect(t.isValid).toBe(true);
    });
  });

  describe('ARIA condition', () => {
    it('parses aria-expanded:true', () => {
      const t = parseClass('display--none:aria-expanded:true');
      expect(t.property).toBe('display');
      expect(t.classValue).toBe('none');
      expect(t.conditionType).toBe('aria');
      expect(t.conditionAttr).toBe('aria-expanded');
      expect(t.conditionValue).toBe('true');
      expect(t.isValid).toBe(true);
    });

    it('parses aria-expanded:false', () => {
      const t = parseClass('display--block:aria-expanded:false');
      expect(t.conditionAttr).toBe('aria-expanded');
      expect(t.conditionValue).toBe('false');
      expect(t.isValid).toBe(true);
    });

    it('parses aria-checked:mixed', () => {
      const t = parseClass('opacity--0.5:aria-checked:mixed');
      expect(t.conditionAttr).toBe('aria-checked');
      expect(t.conditionValue).toBe('mixed');
      expect(t.isValid).toBe(true);
    });

    it('parses breakpoint + ARIA', () => {
      const t = parseClass('sm-display--flex:aria-hidden:false');
      expect(t.breakpoint).toBe('sm');
      expect(t.conditionType).toBe('aria');
      expect(t.conditionAttr).toBe('aria-hidden');
      expect(t.conditionValue).toBe('false');
      expect(t.isValid).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('returns invalid for missing separator', () => {
      const t = parseClass('display-flex');
      expect(t.isValid).toBe(false);
      expect(t.errors.some((e) => e.code === 'MISSING_SEPARATOR')).toBe(true);
    });

    it('returns invalid for separator at start', () => {
      const t = parseClass('--flex');
      expect(t.isValid).toBe(false);
    });

    it('returns invalid for INVALID_CONDITION_CHAIN (two pseudo)', () => {
      const t = parseClass('color--red:hover:focus');
      expect(t.isValid).toBe(false);
      expect(t.errors.some((e) => e.code === 'INVALID_CONDITION_CHAIN')).toBe(true);
    });

    it('returns invalid for INVALID_CONDITION_CHAIN (pseudo + ARIA chained)', () => {
      const t = parseClass('color--red:hover:aria-expanded:true');
      expect(t.isValid).toBe(false);
    });

    it('returns raw in token', () => {
      const t = parseClass('display--flex');
      expect(t.raw).toBe('display--flex');
    });

    it('returns invalid for ARIA missing value', () => {
      const t = parseClass('display--flex:aria-expanded');
      expect(t.isValid).toBe(false);
      expect(t.errors.some((e) => e.code === 'INVALID_ARIA_CONDITION')).toBe(true);
    });
  });
});

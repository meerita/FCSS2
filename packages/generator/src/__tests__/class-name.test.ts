// @file packages/generator/src/__tests__/class-name.test.ts
// @description Unit tests for buildClassName family functions.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import {
  buildBaseClassName,
  buildResponsiveClassName,
  buildPseudoClassName,
  buildAriaClassName,
  buildResponsivePseudoClassName,
  buildResponsiveAriaClassName,
} from '../class-name.js';

describe('buildBaseClassName', () => {
  it('joins property and value with double dash', () => {
    expect(buildBaseClassName('display', 'flex')).toBe('display--flex');
  });

  it('handles keyword values', () => {
    expect(buildBaseClassName('overflow', 'hidden')).toBe('overflow--hidden');
  });

  it('handles numeric values', () => {
    expect(buildBaseClassName('margin-top', '16')).toBe('margin-top--16');
  });

  it('handles percentage values', () => {
    expect(buildBaseClassName('width', '100%')).toBe('width--100%');
  });

  it('handles negative values', () => {
    expect(buildBaseClassName('margin-left', '-8')).toBe('margin-left---8');
  });

  it('handles decimal values', () => {
    expect(buildBaseClassName('opacity', '0.5')).toBe('opacity--0.5');
  });
});

describe('buildResponsiveClassName', () => {
  it('prefixes with breakpoint and dash', () => {
    expect(buildResponsiveClassName('sm', 'display', 'flex')).toBe('sm-display--flex');
  });

  it('handles md breakpoint', () => {
    expect(buildResponsiveClassName('md', 'display', 'none')).toBe('md-display--none');
  });

  it('handles lg breakpoint', () => {
    expect(buildResponsiveClassName('lg', 'flex-direction', 'column')).toBe(
      'lg-flex-direction--column',
    );
  });

  it('handles xl breakpoint', () => {
    expect(buildResponsiveClassName('xl', 'width', '100%')).toBe('xl-width--100%');
  });

  it('handles xxl breakpoint', () => {
    expect(buildResponsiveClassName('xxl', 'margin-top', '0')).toBe('xxl-margin-top--0');
  });
});

describe('buildPseudoClassName', () => {
  it('appends pseudo-class with colon', () => {
    expect(buildPseudoClassName('color', 'primary', 'hover')).toBe('color--primary:hover');
  });

  it('handles focus pseudo', () => {
    expect(buildPseudoClassName('background-color', 'blue', 'focus')).toBe(
      'background-color--blue:focus',
    );
  });

  it('handles checked pseudo', () => {
    expect(buildPseudoClassName('display', 'block', 'checked')).toBe('display--block:checked');
  });

  it('handles hyphenated pseudo', () => {
    expect(buildPseudoClassName('display', 'flex', 'first-child')).toBe(
      'display--flex:first-child',
    );
  });
});

describe('buildAriaClassName', () => {
  it('appends aria attribute and value with colons', () => {
    expect(buildAriaClassName('display', 'block', 'aria-expanded', 'true')).toBe(
      'display--block:aria-expanded:true',
    );
  });

  it('handles aria-disabled false', () => {
    expect(buildAriaClassName('opacity', '0.5', 'aria-disabled', 'false')).toBe(
      'opacity--0.5:aria-disabled:false',
    );
  });

  it('handles aria-selected', () => {
    expect(buildAriaClassName('background-color', 'primary', 'aria-selected', 'true')).toBe(
      'background-color--primary:aria-selected:true',
    );
  });
});

describe('buildResponsivePseudoClassName', () => {
  it('combines breakpoint, property, value, and pseudo', () => {
    expect(buildResponsivePseudoClassName('md', 'color', 'primary', 'hover')).toBe(
      'md-color--primary:hover',
    );
  });

  it('handles lg and focus', () => {
    expect(buildResponsivePseudoClassName('lg', 'background-color', 'blue', 'focus')).toBe(
      'lg-background-color--blue:focus',
    );
  });
});

describe('buildResponsiveAriaClassName', () => {
  it('combines breakpoint, property, value, aria-attr, and aria-value', () => {
    expect(buildResponsiveAriaClassName('sm', 'display', 'block', 'aria-expanded', 'true')).toBe(
      'sm-display--block:aria-expanded:true',
    );
  });

  it('handles md breakpoint with aria-hidden', () => {
    expect(buildResponsiveAriaClassName('md', 'visibility', 'hidden', 'aria-hidden', 'true')).toBe(
      'md-visibility--hidden:aria-hidden:true',
    );
  });
});

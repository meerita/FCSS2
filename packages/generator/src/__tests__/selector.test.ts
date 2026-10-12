// @file packages/generator/src/__tests__/selector.test.ts
// @description Unit tests for buildSelector.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { buildSelector } from '../selector.js';

describe('buildSelector', () => {
  it('builds a base selector with leading dot', () => {
    expect(buildSelector('display--flex')).toBe('.display--flex');
  });

  it('builds a base selector for responsive class', () => {
    expect(buildSelector('md-display--flex')).toBe('.md-display--flex');
  });

  it('builds a pseudo-class selector', () => {
    expect(buildSelector('color--primary:hover', 'hover')).toBe('.color--primary\\:hover:hover');
  });

  it('builds a focus pseudo-class selector', () => {
    expect(buildSelector('display--block:focus', 'focus')).toBe('.display--block\\:focus:focus');
  });

  it('builds an ARIA attribute selector', () => {
    expect(
      buildSelector('display--block:aria-expanded:true', undefined, 'aria-expanded', 'true'),
    ).toBe(".display--block\\:aria-expanded\\:true[aria-expanded='true']");
  });

  it('builds an ARIA false selector', () => {
    expect(
      buildSelector('display--none:aria-expanded:false', undefined, 'aria-expanded', 'false'),
    ).toBe(".display--none\\:aria-expanded\\:false[aria-expanded='false']");
  });

  it('ARIA takes priority over pseudo when both provided', () => {
    const sel = buildSelector('foo--bar:aria-expanded:true', 'hover', 'aria-expanded', 'true');
    expect(sel).toBe(".foo--bar\\:aria-expanded\\:true[aria-expanded='true']");
  });

  it('escapes decimal in class name', () => {
    expect(buildSelector('opacity--0.5')).toBe('.opacity--0\\.5');
  });

  it('escapes percentage in class name', () => {
    expect(buildSelector('width--100%')).toBe('.width--100\\%');
  });

  it('builds responsive pseudo selector', () => {
    expect(buildSelector('md-color--primary:hover', 'hover')).toBe(
      '.md-color--primary\\:hover:hover',
    );
  });

  it('builds responsive ARIA selector', () => {
    expect(
      buildSelector('md-display--block:aria-expanded:true', undefined, 'aria-expanded', 'true'),
    ).toBe(".md-display--block\\:aria-expanded\\:true[aria-expanded='true']");
  });
});

// @file packages/scanner/tests/html.test.ts
// @description Unit tests for the HTML extractor.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { extractFromHtml } from '../src/extractors/html.js';

describe('extractFromHtml', () => {
  it('extracts classes from double-quoted attribute', () => {
    const { classes } = extractFromHtml('<div class="display--flex color--blue"></div>');
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('color--blue')).toBe(true);
  });

  it('extracts classes from single-quoted attribute', () => {
    const { classes } = extractFromHtml("<div class='padding--16 margin--8'></div>");
    expect(classes.has('padding--16')).toBe(true);
    expect(classes.has('margin--8')).toBe(true);
  });

  it('handles multi-line class attribute', () => {
    const html = `<div
      class="display--flex
             flex-direction--column
             align-items--center"
    ></div>`;
    const { classes } = extractFromHtml(html);
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('flex-direction--column')).toBe(true);
    expect(classes.has('align-items--center')).toBe(true);
  });

  it('handles multiple elements', () => {
    const html = '<div class="a--b"><span class="c--d"></span></div>';
    const { classes } = extractFromHtml(html);
    expect(classes.has('a--b')).toBe(true);
    expect(classes.has('c--d')).toBe(true);
  });

  it('handles escaped values in class names (opacity--0.5)', () => {
    const { classes } = extractFromHtml('<div class="opacity--0.5"></div>');
    expect(classes.has('opacity--0.5')).toBe(true);
  });

  it('handles multiple whitespace between class names', () => {
    const { classes } = extractFromHtml('<div class="a--b   c--d"></div>');
    expect(classes.has('a--b')).toBe(true);
    expect(classes.has('c--d')).toBe(true);
  });

  it('emits no warnings for static HTML', () => {
    const { warnings } = extractFromHtml('<div class="display--flex"></div>');
    expect(warnings).toHaveLength(0);
  });

  it('handles empty class attribute', () => {
    const { classes } = extractFromHtml('<div class=""></div>');
    expect(classes.size).toBe(0);
  });

  it('handles class attribute with only whitespace', () => {
    const { classes } = extractFromHtml('<div class="   "></div>');
    expect(classes.size).toBe(0);
  });
});

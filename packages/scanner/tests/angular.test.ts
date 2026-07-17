// @file packages/scanner/tests/angular.test.ts
// @description Unit tests for the Angular extractor.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { extractFromAngular } from '../src/extractors/angular.js';

describe('extractFromAngular — class attribute', () => {
  it('extracts from class="..."', () => {
    const { classes } = extractFromAngular('<div class="display--flex"></div>');
    expect(classes.has('display--flex')).toBe(true);
  });
});

describe('extractFromAngular — [class.x] binding', () => {
  it('extracts class name from [class.display--block]', () => {
    const { classes } = extractFromAngular('<div [class.display--block]="isVisible"></div>');
    expect(classes.has('display--block')).toBe(true);
  });

  it('extracts class name from [class.opacity--0.5]', () => {
    const { classes } = extractFromAngular('<div [class.opacity--0.5]="dim"></div>');
    expect(classes.has('opacity--0.5')).toBe(true);
  });
});

describe('extractFromAngular — [ngClass] binding', () => {
  it('extracts keys from ngClass object literal', () => {
    const { classes } = extractFromAngular(
      `<div [ngClass]="{'display--block': show, 'color--blue': active}"></div>`,
    );
    expect(classes.has('display--block')).toBe(true);
    expect(classes.has('color--blue')).toBe(true);
  });

  it('extracts items from ngClass array literal', () => {
    const { classes } = extractFromAngular(
      `<div [ngClass]="['display--flex', 'padding--8']"></div>`,
    );
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('padding--8')).toBe(true);
  });
});

describe('extractFromAngular — no warnings', () => {
  it('emits no warnings (Angular extractor does not detect dynamic fragments)', () => {
    const { warnings } = extractFromAngular('<div class="display--flex"></div>');
    expect(warnings).toHaveLength(0);
  });
});

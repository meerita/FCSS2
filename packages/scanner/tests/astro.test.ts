// @file packages/scanner/tests/astro.test.ts
// @description Unit tests for the Astro (.astro) extractor.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { extractFromAstro } from '../src/extractors/astro.js';

describe('extractFromAstro — static class attribute', () => {
  it('extracts from class="..." on a single element', () => {
    const { classes } = extractFromAstro('<div class="display--flex gap--16" />', 'Comp.astro');
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('gap--16')).toBe(true);
  });

  it('extracts from a multi-line class="..." attribute', () => {
    const source = '<div\n  class="display--flex\n    gap--16"\n/>';
    const { classes } = extractFromAstro(source, 'Comp.astro');
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('gap--16')).toBe(true);
  });

  it("extracts from class='...' (single quotes)", () => {
    const { classes } = extractFromAstro("<div class='padding--16' />", 'Comp.astro');
    expect(classes.has('padding--16')).toBe(true);
  });
});

describe('extractFromAstro — class:list static forms', () => {
  it('extracts a static array with a static-boolean-guarded string, no warning', () => {
    const source = "<div class:list={['display--flex', isOpen && 'display--block']} />";
    const { classes, warnings } = extractFromAstro(source, 'Comp.astro');
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('display--block')).toBe(true);
    expect(warnings).toHaveLength(0);
  });

  it('extracts a static object literal form', () => {
    const source = "<div class:list={{ 'display--block': isOpen }} />";
    const { classes, warnings } = extractFromAstro(source, 'Comp.astro');
    expect(classes.has('display--block')).toBe(true);
    expect(warnings).toHaveLength(0);
  });
});

describe('extractFromAstro — class:list dynamic detection', () => {
  it('emits a dynamic-fragment warning for a template-literal entry and extracts nothing malformed', () => {
    const source = '<div class:list={[`color--${color}`]} />';
    const { classes, warnings } = extractFromAstro(source, 'Comp.astro');
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]?.file).toBe('Comp.astro');
    expect(typeof warnings[0]?.line).toBe('number');
    expect(classes.has('color--')).toBe(false);
    for (const cls of classes) {
      expect(cls.includes('${')).toBe(false);
    }
  });

  it('reports the correct line number for a dynamic class:list entry', () => {
    const source = 'const x = 1;\n<div class:list={[`color--${c}`]} />';
    const { warnings } = extractFromAstro(source, 'Comp.astro');
    expect(warnings[0]?.line).toBe(2);
  });

  it('warns on a bare identifier entry that is not statically resolvable', () => {
    const source = '<div class:list={[dynamicClasses]} />';
    const { classes, warnings } = extractFromAstro(source, 'Comp.astro');
    expect(warnings.length).toBeGreaterThan(0);
    expect(classes.size).toBe(0);
  });
});

describe('extractFromAstro — frontmatter is not scanned', () => {
  it('does not false-positive on a frontmatter string that coincidentally contains "class="', () => {
    const source = [
      '---',
      "const label = 'set class= active for styling';",
      'const count: number = 3;',
      '---',
      '<div class="display--flex" />',
    ].join('\n');
    const { classes } = extractFromAstro(source, 'Comp.astro');
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('active')).toBe(false);
    expect(classes.has('set')).toBe(false);
  });
});

describe('extractFromAstro — embedded framework components', () => {
  it('does not extract from className on an embedded JSX component', () => {
    const source =
      '<ReactCard client:load className="not-fcss-owned" />\n<div class="display--flex" />';
    const { classes } = extractFromAstro(source, 'Comp.astro');
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('not-fcss-owned')).toBe(false);
  });
});

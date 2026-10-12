// @file packages/scanner/tests/jsx.test.ts
// @description Unit tests for the JSX/TSX extractor.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { extractFromJsx } from '../src/extractors/jsx.js';

describe('extractFromJsx — static string patterns', () => {
  it('extracts from className="..."', () => {
    const { classes } = extractFromJsx('<div className="display--flex color--blue" />', 'Comp.tsx');
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('color--blue')).toBe(true);
  });

  it("extracts from className='...'", () => {
    const { classes } = extractFromJsx("<div className='padding--16' />", 'Comp.tsx');
    expect(classes.has('padding--16')).toBe(true);
  });

  it("extracts from className={'...'}", () => {
    const { classes } = extractFromJsx("<div className={'display--block'} />", 'Comp.tsx');
    expect(classes.has('display--block')).toBe(true);
  });

  it('extracts from className={"..."}', () => {
    const { classes } = extractFromJsx('<div className={"margin--8"} />', 'Comp.tsx');
    expect(classes.has('margin--8')).toBe(true);
  });
});

describe('extractFromJsx — template literals', () => {
  it('extracts from static template literal', () => {
    const { classes, warnings } = extractFromJsx(
      '<div className={`display--flex padding--8`} />',
      'Comp.tsx',
    );
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('padding--8')).toBe(true);
    expect(warnings).toHaveLength(0);
  });

  it('emits warning for dynamic template literal and extracts static parts', () => {
    const source = '<div className={`color--${color} display--flex`} />';
    const { classes, warnings } = extractFromJsx(source, 'Comp.tsx');
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]?.file).toBe('Comp.tsx');
    expect(typeof warnings[0]?.line).toBe('number');
    expect(classes.has('display--flex')).toBe(true);
  });

  it('reports correct line number for dynamic fragment warning', () => {
    const source = 'const x = 1;\n<div className={`color--${c}`} />';
    const { warnings } = extractFromJsx(source, 'Comp.tsx');
    expect(warnings[0]?.line).toBe(2);
  });
});

describe('extractFromJsx — ternary', () => {
  it('extracts both branches of ternary expression', () => {
    const { classes } = extractFromJsx(
      "<div className={isActive ? 'display--flex' : 'display--none'} />",
      'Comp.tsx',
    );
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('display--none')).toBe(true);
  });
});

describe('extractFromJsx — clsx/cn patterns', () => {
  it('extracts from clsx() string args', () => {
    const { classes } = extractFromJsx(
      "const cls = clsx('display--flex', 'padding--8');",
      'Comp.tsx',
    );
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('padding--8')).toBe(true);
  });

  it('extracts from cn() object literal keys', () => {
    const { classes } = extractFromJsx(
      "const cls = cn({'display--block': isVisible, 'color--blue': true});",
      'Comp.tsx',
    );
    expect(classes.has('display--block')).toBe(true);
    expect(classes.has('color--blue')).toBe(true);
  });

  it('extracts from classnames() call', () => {
    const { classes } = extractFromJsx(
      "const cls = classnames('margin--16', 'padding--8');",
      'Comp.tsx',
    );
    expect(classes.has('margin--16')).toBe(true);
    expect(classes.has('padding--8')).toBe(true);
  });

  it('emits warning for dynamic template in clsx', () => {
    const { warnings } = extractFromJsx(
      "const cls = clsx(`color--${v}`, 'display--flex');",
      'Comp.tsx',
    );
    expect(warnings.length).toBeGreaterThan(0);
  });
});

describe('extractFromJsx — no false positives', () => {
  it('emits no warnings for fully static source', () => {
    const source = `
      function Comp() {
        return <div className="display--flex padding--8" />;
      }
    `;
    const { warnings } = extractFromJsx(source, 'Comp.tsx');
    expect(warnings).toHaveLength(0);
  });
});

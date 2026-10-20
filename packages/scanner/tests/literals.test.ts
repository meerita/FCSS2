// @file packages/scanner/tests/literals.test.ts
// @description Tests that the JS/TS extractor reads classes from every string literal, not only className and cn().
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtemp, writeFile, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { extractFromJsx } from '../src/extractors/jsx.js';
import { collectStringLiterals } from '../src/extractors/string-literals.js';
import { scan } from '../src/index.js';

function extract(source: string, file = 'Comp.tsx'): Set<string> {
  return extractFromJsx(source, file).classes;
}

describe('extractFromJsx — string literals outside className', () => {
  it('reads a typed map', () => {
    const classes = extract(
      "const PADDING_CLASSES = { 16: 'padding--16', 24: 'padding--24' } as const;",
    );
    expect(classes.has('padding--16')).toBe(true);
    expect(classes.has('padding--24')).toBe(true);
  });

  it('reads an exported const string', () => {
    const classes = extract('export const BASE = "display--inline-flex align-items--center";');
    expect(classes.has('display--inline-flex')).toBe(true);
    expect(classes.has('align-items--center')).toBe(true);
  });

  it('reads two strings joined with +', () => {
    const classes = extract(
      "export const BUTTON_BASE_CLASSES =\n  'display--inline-flex align-items--center ' + 'gap--8 border-radius--4';",
    );
    for (const cls of [
      'display--inline-flex',
      'align-items--center',
      'gap--8',
      'border-radius--4',
    ]) {
      expect(classes.has(cls), cls).toBe(true);
    }
  });

  it('reads the static parts of a template literal with an expression', () => {
    const classes = extract('const cls = `display--flex ${gap} padding--8`;');
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('padding--8')).toBe(true);
  });

  it('reads a string nested inside a template expression', () => {
    const classes = extract("const cls = `display--flex ${open ? 'color--red' : 'color--blue'}`;");
    expect(classes.has('display--flex')).toBe(true);
    expect(classes.has('color--red')).toBe(true);
    expect(classes.has('color--blue')).toBe(true);
  });

  it('reads a string in an object value', () => {
    const classes = extract("const variants = { primary: { root: 'background-color--blue' } };");
    expect(classes.has('background-color--blue')).toBe(true);
  });

  it('reads a string passed to a function other than cn', () => {
    const classes = extract(
      "<div className={joinClassNames(PADDING_CLASSES[padding], 'margin--8', className)} />",
    );
    expect(classes.has('margin--8')).toBe(true);
  });

  it('reads a class with a breakpoint prefix and a state suffix', () => {
    const classes = extract(
      "const RESPONSIVE = ['md-display--none', 'md-color--red:hover', 'display--block:aria-expanded:true'];",
    );
    expect(classes.has('md-display--none')).toBe(true);
    expect(classes.has('md-color--red:hover')).toBe(true);
    expect(classes.has('display--block:aria-expanded:true')).toBe(true);
  });

  it('reads the full example from a component library', () => {
    const source = [
      "const PADDING_CLASSES = { 16: 'padding--16', 24: 'padding--24' } as const;",
      'export const BUTTON_BASE_CLASSES =',
      "  'display--inline-flex align-items--center ' + 'gap--8 border-radius--4';",
      'export function Box({ padding, className }: Props) {',
      '  return <div className={joinClassNames(PADDING_CLASSES[padding], className)} />;',
      '}',
    ].join('\n');
    const classes = extract(source);
    for (const cls of [
      'padding--16',
      'padding--24',
      'display--inline-flex',
      'align-items--center',
      'gap--8',
      'border-radius--4',
    ]) {
      expect(classes.has(cls), cls).toBe(true);
    }
  });

  it('reads string literals in every JS and TS extension', () => {
    for (const file of ['a.js', 'a.jsx', 'a.ts', 'a.tsx', 'a.mjs', 'a.cjs']) {
      expect(extract("const A = { x: 'padding--16' };", file).has('padding--16'), file).toBe(true);
    }
  });
});

describe('extractFromJsx — literal boundaries', () => {
  it('does not split or merge literals at an escaped quote', () => {
    const literals = collectStringLiterals(
      "const a = 'it\\'s padding--8'; const b = \"say \\\"hi\\\" margin--4\"; const c = 'gap--8';",
    );
    expect(literals).toEqual(["it's padding--8", 'say "hi" margin--4', 'gap--8']);
  });

  it('keeps classes on both sides of an escaped quote', () => {
    const classes = extract("const a = 'padding--8 \\'quoted\\' margin--4'; const b = 'gap--8';");
    expect(classes.has('padding--8')).toBe(true);
    expect(classes.has('margin--4')).toBe(true);
    expect(classes.has('gap--8')).toBe(true);
  });

  it('splits on an escaped newline or tab inside a string', () => {
    const classes = extract("const a = 'padding--8\\nmargin--4\\tgap--8';");
    expect(classes.has('padding--8')).toBe(true);
    expect(classes.has('margin--4')).toBe(true);
    expect(classes.has('gap--8')).toBe(true);
  });

  it('does not let a quote in a line comment open a literal', () => {
    const literals = collectStringLiterals("// don't do this\nconst a = 'padding--8';");
    expect(literals).toEqual(['padding--8']);
  });

  it('does not let a quote in a block comment open a literal', () => {
    const literals = collectStringLiterals("/* it's \"fine\" */ const a = 'padding--8';");
    expect(literals).toEqual(['padding--8']);
  });

  it('does not let a quote in a regex literal open a literal', () => {
    const literals = collectStringLiterals("const re = /['\"]/g; const a = 'padding--8';");
    expect(literals).toEqual(['padding--8']);
  });

  it('tells a division from a regex', () => {
    const literals = collectStringLiterals("const x = a / b; const y = 'padding--8' / 2;");
    expect(literals).toEqual(['padding--8']);
  });

  it('does not let a quote inside another string open a literal', () => {
    const literals = collectStringLiterals(`const a = "it's"; const b = '"'; const c = 'gap--8';`);
    expect(literals).toEqual(["it's", '"', 'gap--8']);
  });

  it('does not let an apostrophe in JSX text open a literal', () => {
    const source = [
      'export function Note() {',
      "  return <p className=\"color--red\">Don't forget it's {COLORS['blue']}</p>;",
      '}',
      "const COLORS = { blue: 'color--blue' };",
    ].join('\n');
    const classes = extract(source);
    expect(classes.has('color--red')).toBe(true);
    expect(classes.has('color--blue')).toBe(true);
  });

  it('does not treat a JSX closing tag or a URL in text as a regex or comment', () => {
    const source = [
      '<p>See https://example.com</p>',
      '<a href="/docs">Docs</a><span className={MAP[\'x\']} />',
      "const MAP = { x: 'padding--8' };",
    ].join('\n');
    const literals = collectStringLiterals(source);
    expect(literals).toContain('/docs');
    expect(literals).toContain('padding--8');
  });

  it('reads a multi-line JSX attribute string', () => {
    const classes = extract('<div\n  title="padding--8\n  margin--4"\n/>');
    expect(classes.has('padding--8')).toBe(true);
    expect(classes.has('margin--4')).toBe(true);
  });

  it('does not report a class that appears only in a comment', () => {
    const classes = extract("// padding--8\n/* 'margin--4' */\nconst a = 'gap--8';");
    expect(classes.has('padding--8')).toBe(false);
    expect(classes.has('margin--4')).toBe(false);
    expect(classes.has('gap--8')).toBe(true);
  });
});

describe('scan — literal candidates filter through the manifest', () => {
  let dir: string;
  const manifest = [
    'padding--16',
    'padding--24',
    'gap--8',
    'border-radius--4',
    'md-display--none',
    'color--red:hover',
    'display--inline-table',
  ].map((className) => ({ className, selector: `.${className}` }));

  beforeAll(async () => {
    dir = await realpath(await mkdtemp(join(tmpdir(), 'fcss-literals-')));
    await writeFile(
      join(dir, 'Box.tsx'),
      [
        "const PADDING_CLASSES = { 16: 'padding--16', 24: 'padding--24' } as const;",
        "const GREETING = 'hello world';",
        "const RESPONSIVE = `md-display--none ${x} color--red:hover` + ' gap--8 border-radius--4';",
        'export const Box = ({ padding }: { padding: 16 | 24 }) => (',
        '  <div className={joinClassNames(PADDING_CLASSES[padding], RESPONSIVE)}>{GREETING}</div>',
        ');',
      ].join('\n'),
    );
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('keeps the FCSS classes and drops every other word', async () => {
    const { usedClasses } = await scan({ content: ['*.tsx'], manifest, cwd: dir });
    expect([...usedClasses].sort()).toEqual(
      [
        'border-radius--4',
        'color--red:hover',
        'gap--8',
        'md-display--none',
        'padding--16',
        'padding--24',
      ].sort(),
    );
    expect(usedClasses.has('hello')).toBe(false);
    expect(usedClasses.has('world')).toBe(false);
    expect(usedClasses.has('display--inline-table')).toBe(false);
  });
});

// @file packages/generator/src/__tests__/escape.test.ts
// @description Exhaustive unit tests for escapeClassName.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { escapeClassName } from '../escape.js';

describe('escapeClassName', () => {
  it('leaves plain alphanumeric class names unchanged', () => {
    expect(escapeClassName('display--flex')).toBe('display--flex');
  });

  it('leaves dashes unchanged', () => {
    expect(escapeClassName('margin-left---8')).toBe('margin-left---8');
  });

  it('leaves underscores unchanged', () => {
    expect(escapeClassName('my_class')).toBe('my_class');
  });

  it('returns empty string for empty input', () => {
    expect(escapeClassName('')).toBe('');
  });

  // Individual metacharacter tests
  it('escapes colon (:)', () => {
    expect(escapeClassName('a:b')).toBe('a\\:b');
  });

  it('escapes dot (.)', () => {
    expect(escapeClassName('a.b')).toBe('a\\.b');
  });

  it('escapes percent (%)', () => {
    expect(escapeClassName('a%b')).toBe('a\\%b');
  });

  it('escapes open paren (()', () => {
    expect(escapeClassName('a(b')).toBe('a\\(b');
  });

  it('escapes close paren ())', () => {
    expect(escapeClassName('a)b')).toBe('a\\)b');
  });

  it('escapes forward slash (/)', () => {
    expect(escapeClassName('a/b')).toBe('a\\/b');
  });

  it('escapes open bracket ([)', () => {
    expect(escapeClassName('a[b')).toBe('a\\[b');
  });

  it('escapes close bracket (])', () => {
    expect(escapeClassName('a]b')).toBe('a\\]b');
  });

  it('escapes open brace ({)', () => {
    expect(escapeClassName('a{b')).toBe('a\\{b');
  });

  it('escapes close brace (})', () => {
    expect(escapeClassName('a}b')).toBe('a\\}b');
  });

  it('escapes plus (+)', () => {
    expect(escapeClassName('a+b')).toBe('a\\+b');
  });

  it('escapes tilde (~)', () => {
    expect(escapeClassName('a~b')).toBe('a\\~b');
  });

  it('escapes greater-than (>)', () => {
    expect(escapeClassName('a>b')).toBe('a\\>b');
  });

  it('escapes caret (^)', () => {
    expect(escapeClassName('a^b')).toBe('a\\^b');
  });

  it('escapes dollar ($)', () => {
    expect(escapeClassName('a$b')).toBe('a\\$b');
  });

  it('escapes asterisk (*)', () => {
    expect(escapeClassName('a*b')).toBe('a\\*b');
  });

  it('escapes pipe (|)', () => {
    expect(escapeClassName('a|b')).toBe('a\\|b');
  });

  it('escapes equals (=)', () => {
    expect(escapeClassName('a=b')).toBe('a\\=b');
  });

  it('escapes hash (#)', () => {
    expect(escapeClassName('a#b')).toBe('a\\#b');
  });

  it('escapes at-sign (@)', () => {
    expect(escapeClassName('a@b')).toBe('a\\@b');
  });

  it('escapes exclamation (!)', () => {
    expect(escapeClassName('a!b')).toBe('a\\!b');
  });

  it('escapes comma (,)', () => {
    expect(escapeClassName('a,b')).toBe('a\\,b');
  });

  // Combination tests
  it('escapes decimal point in opacity class', () => {
    expect(escapeClassName('opacity--0.5')).toBe('opacity--0\\.5');
  });

  it('escapes percentage in width class', () => {
    expect(escapeClassName('width--100%')).toBe('width--100\\%');
  });

  it('escapes colon in pseudo-class suffix', () => {
    expect(escapeClassName('display--block:hover')).toBe('display--block\\:hover');
  });

  it('escapes multiple colons in ARIA suffix', () => {
    expect(escapeClassName('display--block:aria-expanded:true')).toBe(
      'display--block\\:aria-expanded\\:true',
    );
  });

  it('escapes colon in responsive pseudo class', () => {
    expect(escapeClassName('md-color--primary:hover')).toBe('md-color--primary\\:hover');
  });

  it('escapes all metacharacters in a complex string', () => {
    expect(escapeClassName('a:b.c%d')).toBe('a\\:b\\.c\\%d');
  });
});

// @file packages/lsp-server/tests/class-extraction.test.ts
// @description Unit tests for range-aware FCSS class occurrence extraction.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import {
  extractClassOccurrences,
  offsetToPosition,
  occurrenceToRange,
} from '../src/class-extraction';

describe('extractClassOccurrences', () => {
  describe('class attribute (HTML)', () => {
    it('extracts a single class', () => {
      const text = '<p class="foo">';
      const result = extractClassOccurrences(text);
      expect(result).toHaveLength(1);
      expect(result[0]?.value).toBe('foo');
    });

    it('extracts multiple classes', () => {
      const text = '<div class="foo bar baz">';
      const result = extractClassOccurrences(text);
      expect(result.map((o) => o.value)).toEqual(['foo', 'bar', 'baz']);
    });

    it('handles leading and trailing whitespace in attribute value', () => {
      const text = '<div class="  foo  bar  ">';
      const result = extractClassOccurrences(text);
      expect(result.map((o) => o.value)).toEqual(['foo', 'bar']);
    });

    it('returns empty array for empty class attribute', () => {
      const text = '<div class="">';
      expect(extractClassOccurrences(text)).toHaveLength(0);
    });

    it('returns empty array when no class attribute present', () => {
      const text = '<div id="main">';
      expect(extractClassOccurrences(text)).toHaveLength(0);
    });

    it('uses single quotes', () => {
      const text = "<div class='foo bar'>";
      const result = extractClassOccurrences(text);
      expect(result.map((o) => o.value)).toEqual(['foo', 'bar']);
    });
  });

  describe('className attribute (JSX/TSX)', () => {
    it('extracts classes from className', () => {
      const text = '<div className="foo bar">';
      const result = extractClassOccurrences(text);
      expect(result.map((o) => o.value)).toEqual(['foo', 'bar']);
    });
  });

  describe('multiple attributes in document', () => {
    it('extracts classes from all matching attributes', () => {
      const text = '<div class="a b"><p className="c d"></p></div>';
      const result = extractClassOccurrences(text);
      expect(result.map((o) => o.value)).toEqual(['a', 'b', 'c', 'd']);
    });

    it('handles duplicate class values', () => {
      const text = '<div class="foo foo bar">';
      const result = extractClassOccurrences(text);
      expect(result.map((o) => o.value)).toEqual(['foo', 'foo', 'bar']);
    });
  });

  describe('offset correctness', () => {
    it('reports correct start offset for single class', () => {
      // '<p class="foo">'  — 'f' of 'foo' is at index 10
      // Positions: <(0)p(1) (2)c(3)l(4)a(5)s(6)s(7)=(8)"(9)f(10)
      const text = '<p class="foo">';
      const result = extractClassOccurrences(text);
      expect(result[0]?.start).toBe(10);
      expect(result[0]?.end).toBe(13);
    });

    it('reports correct offsets for multiple classes', () => {
      // '<div class="foo bar">' — foo starts at 12, bar starts at 16
      const text = '<div class="foo bar">';
      const result = extractClassOccurrences(text);
      expect(result[0]?.start).toBe(12);
      expect(result[0]?.end).toBe(15);
      expect(result[1]?.start).toBe(16);
      expect(result[1]?.end).toBe(19);
    });

    it('reports correct offsets across multiple attribute occurrences', () => {
      const text = '<a class="x"><b class="y">';
      const result = extractClassOccurrences(text);
      // 'x' is at: <a class=" = 10 chars => index 10
      expect(result[0]?.value).toBe('x');
      expect(text.slice(result[0]?.start, result[0]?.end)).toBe('x');
      // 'y' in the second attribute
      expect(result[1]?.value).toBe('y');
      expect(text.slice(result[1]?.start, result[1]?.end)).toBe('y');
    });

    it('slice of original text matches the class value for each occurrence', () => {
      const text = '<div class="bg-red text-sm hover:text-lg">';
      const result = extractClassOccurrences(text);
      for (const occ of result) {
        expect(text.slice(occ.start, occ.end)).toBe(occ.value);
      }
    });
  });
});

describe('offsetToPosition', () => {
  it('returns line 0, character N for single-line text', () => {
    const text = 'hello world';
    expect(offsetToPosition(text, 6)).toEqual({ line: 0, character: 6 });
  });

  it('returns line 0, character 0 for offset 0', () => {
    expect(offsetToPosition('abc', 0)).toEqual({ line: 0, character: 0 });
  });

  it('returns correct line and character for multi-line text', () => {
    const text = 'line0\nline1\nline2';
    // 'l' of 'line1' is at offset 6
    expect(offsetToPosition(text, 6)).toEqual({ line: 1, character: 0 });
    // 'e' of 'line2' is at offset 16
    expect(offsetToPosition(text, 16)).toEqual({ line: 2, character: 4 });
  });
});

describe('occurrenceToRange', () => {
  it('maps a single-line occurrence to an LSP range', () => {
    const text = '<p class="foo">';
    const occurrences = extractClassOccurrences(text);
    const occ = occurrences[0];
    expect(occ).toBeDefined();
    const range = occurrenceToRange(text, occ!);
    expect(range.start).toEqual({ line: 0, character: 10 });
    expect(range.end).toEqual({ line: 0, character: 13 });
  });

  it('maps a multi-line occurrence to an LSP range', () => {
    const text = '<div\n  class="foo">';
    // 'f' of 'foo' is after '<div\n  class="' = 14 chars => offset 14, line 1, char 9
    const occurrences = extractClassOccurrences(text);
    const occ = occurrences[0];
    expect(occ).toBeDefined();
    const range = occurrenceToRange(text, occ!);
    expect(range.start).toEqual({ line: 1, character: 9 });
    expect(range.end).toEqual({ line: 1, character: 12 });
  });
});

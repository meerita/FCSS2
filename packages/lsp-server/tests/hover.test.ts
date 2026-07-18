// @file packages/lsp-server/tests/hover.test.ts
// @description Tests for the LSP hover handler: hit, null, and markdown content.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { MarkupKind } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { createManifestIndex } from '@fcss/language-service';
import type { ManifestEntry } from '@fcss/language-service';
import { handleHover } from '../src/handlers/hover';

// Property names match the FCSS convention: className = `{property}--{value}`.
const FIXTURE_ENTRIES: ManifestEntry[] = [
  {
    className: 'bg--red',
    selector: '.bg--red',
    property: 'bg',
    value: 'red',
    category: 'color',
    source: 'fcss',
  },
  {
    className: 'sm-txt--sm',
    selector: '.sm-txt--sm',
    property: 'txt',
    value: 'sm',
    category: 'typography',
    source: 'fcss',
    breakpoint: 'sm',
  },
  {
    className: 'old--cls',
    selector: '.old--cls',
    property: 'clr',
    value: 'gray',
    category: 'color',
    source: 'fcss',
    deprecated: true,
    canonical: 'new--cls',
  },
];

const index = createManifestIndex(FIXTURE_ENTRIES);

function makeDoc(text: string): TextDocument {
  return TextDocument.create('file:///test.html', 'html', 1, text);
}

function makeParams(doc: TextDocument, offset: number) {
  return {
    textDocument: { uri: doc.uri },
    position: doc.positionAt(offset),
  };
}

describe('handleHover', () => {
  describe('null-safety', () => {
    it('returns null when index is null', () => {
      const doc = makeDoc('<div class="bg--red">');
      const result = handleHover(makeParams(doc, 13), doc, null);
      expect(result).toBeNull();
    });

    it('returns null when cursor is on whitespace (no word)', () => {
      // '<div class="bg--red  old--cls">' — the space at offset 20
      const doc = makeDoc('<div class="bg--red  old--cls">');
      const result = handleHover(makeParams(doc, 20), doc, index);
      expect(result).toBeNull();
    });

    it('returns null when word is not in index', () => {
      const doc = makeDoc('<div class="unknown--cls">');
      const result = handleHover(makeParams(doc, 14), doc, index);
      expect(result).toBeNull();
    });
  });

  describe('hit cases', () => {
    it('returns a Hover with markdown contents for a known class', () => {
      // '<div class="bg--red">' — 'bg--red' starts at offset 12
      const doc = makeDoc('<div class="bg--red">');
      const result = handleHover(makeParams(doc, 14), doc, index);
      expect(result).not.toBeNull();
      const contents = result!.contents as { kind: string; value: string };
      expect(contents.kind).toBe(MarkupKind.Markdown);
      expect(typeof contents.value).toBe('string');
      expect(contents.value).toContain('bg');
    });

    it('includes CSS snippet in hover for a known class', () => {
      const doc = makeDoc('<div class="bg--red">');
      const result = handleHover(makeParams(doc, 13), doc, index);
      expect(result).not.toBeNull();
      const value = (result!.contents as { value: string }).value;
      expect(value).toContain('```css');
    });

    it('includes deprecation notice for deprecated class', () => {
      // '<div class="old--cls">' — 'old--cls' starts at offset 12
      const doc = makeDoc('<div class="old--cls">');
      const result = handleHover(makeParams(doc, 14), doc, index);
      expect(result).not.toBeNull();
      const value = (result!.contents as { value: string }).value;
      expect(value).toContain('Deprecated');
      expect(value).toContain('new--cls');
    });

    it('includes breakpoint info for a breakpoint-scoped class', () => {
      // '<div class="sm-txt--sm">'
      const doc = makeDoc('<div class="sm-txt--sm">');
      const result = handleHover(makeParams(doc, 15), doc, index);
      expect(result).not.toBeNull();
      const value = (result!.contents as { value: string }).value;
      expect(value).toContain('sm');
    });
  });
});

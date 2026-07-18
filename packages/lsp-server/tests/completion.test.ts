// @file packages/lsp-server/tests/completion.test.ts
// @description Tests for the LSP completion handler: kind mapping, markdown docs, in-attribute guard.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { CompletionItemKind as LspCompletionItemKind, MarkupKind } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { createManifestIndex } from '@fcss/language-service';
import type { ManifestEntry } from '@fcss/language-service';
import { handleCompletion } from '../src/handlers/completion';

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
    className: 'bg--blue',
    selector: '.bg--blue',
    property: 'bg',
    value: 'blue',
    category: 'color',
    source: 'fcss',
  },
  {
    className: 'bg--red:hover',
    selector: '.bg--red\\:hover:hover',
    property: 'bg',
    value: 'red',
    category: 'color',
    source: 'fcss',
    condition: { type: 'pseudo', value: 'hover' },
  },
  {
    className: 'sm-bg--red',
    selector: '.sm-bg--red',
    property: 'bg',
    value: 'red',
    category: 'color',
    source: 'fcss',
    breakpoint: 'sm',
  },
];

const index = createManifestIndex(FIXTURE_ENTRIES);

function makeDoc(text: string, languageId = 'html'): TextDocument {
  return TextDocument.create('file:///test.html', languageId, 1, text);
}

function makeParams(doc: TextDocument, offset: number) {
  return {
    textDocument: { uri: doc.uri },
    position: doc.positionAt(offset),
  };
}

describe('handleCompletion', () => {
  describe('null-safety', () => {
    it('returns null when index is null', () => {
      const doc = makeDoc('<div class="bg">');
      const result = handleCompletion(makeParams(doc, 13), doc, null);
      expect(result).toBeNull();
    });

    it('returns null when cursor is outside a class attribute', () => {
      const doc = makeDoc('<div id="main">');
      const result = handleCompletion(makeParams(doc, 10), doc, index);
      expect(result).toBeNull();
    });

    it('returns null when cursor is in element text, not a class attribute', () => {
      const doc = makeDoc('<p>hello</p>');
      const result = handleCompletion(makeParams(doc, 5), doc, index);
      expect(result).toBeNull();
    });

    it('returns null when cursor is outside the attribute (after closing quote)', () => {
      // '<div class="bg">' — '>' is at offset 15, after closing '"' at 14
      const doc = makeDoc('<div class="bg">');
      const result = handleCompletion(makeParams(doc, 15), doc, index);
      expect(result).toBeNull();
    });
  });

  describe('in-attribute guard', () => {
    it('produces completions when cursor is inside class=""', () => {
      // '<div class="bg">'
      // offsets: 0=< 1=d 2=i 3=v 4=  5=c 6=l 7=a 8=s 9=s 10== 11=" 12=b 13=g 14=" 15=>
      // cursor at 13 (on 'g') — inside the attribute value
      const doc = makeDoc('<div class="bg">');
      const result = handleCompletion(makeParams(doc, 13), doc, index);
      expect(result).not.toBeNull();
      expect(result!.items.length).toBeGreaterThan(0);
    });

    it('produces completions when cursor is inside className=""', () => {
      // '<div className="bg--">'
      // offsets: 0=< 1=d ... 15=" 16=b 17=g 18=- 19=- 20=" 21=>
      const doc = makeDoc('<div className="bg--">', 'typescriptreact');
      const result = handleCompletion(makeParams(doc, 18), doc, index);
      expect(result).not.toBeNull();
      expect(result!.items.length).toBeGreaterThan(0);
    });
  });

  describe('kind mapping', () => {
    it('breakpoint completions have LSP Module kind', () => {
      // Typing 'sm' inside class attr — the breakpoint 'sm-' prefix is Module
      const doc = makeDoc('<div class="sm">');
      // offsets: 0=< 1=d 2=i 3=v 4=  5=c 6=l 7=a 8=s 9=s 10== 11=" 12=s 13=m 14=" 15=>
      // cursor at 13 (on 'm') — partial is 'sm'
      const result = handleCompletion(makeParams(doc, 13), doc, index);
      expect(result).not.toBeNull();
      const moduleItems = result!.items.filter((i) => i.kind === LspCompletionItemKind.Module);
      expect(moduleItems.length).toBeGreaterThan(0);
    });

    it('property completions have LSP Property kind', () => {
      // Empty partial inside class attr → all properties as Property kind
      const doc = makeDoc('<div class="">');
      // offsets: 0=< 1=d 2=i 3=v 4=  5=c 6=l 7=a 8=s 9=s 10== 11=" 12=" 13=>
      // cursor at 12 (between the quotes, empty partial)
      const result = handleCompletion(makeParams(doc, 12), doc, index);
      expect(result).not.toBeNull();
      const propItems = result!.items.filter((i) => i.kind === LspCompletionItemKind.Property);
      expect(propItems.length).toBeGreaterThan(0);
    });

    it('value completions have LSP Value kind', () => {
      // 'bg--' partial → value completions ('bg--red', 'bg--blue')
      // '<div class="bg--">' offsets: 11=" 12=b 13=g 14=- 15=- 16=" 17=>
      // cursor at 16 (the closing quote, partial = text.slice(12,16) = 'bg--')
      const doc = makeDoc('<div class="bg--">');
      const result = handleCompletion(makeParams(doc, 16), doc, index);
      expect(result).not.toBeNull();
      const valItems = result!.items.filter((i) => i.kind === LspCompletionItemKind.Value);
      expect(valItems.length).toBeGreaterThan(0);
    });

    it('pseudo condition completions have LSP Enum kind', () => {
      // 'bg--red:' partial → pseudo/aria completions
      // '<div class="bg--red:">' — cursor after ':'
      const text = '<div class="bg--red:">';
      const doc = makeDoc(text);
      // offset of ':' = 19, cursor after ':' = 20
      const result = handleCompletion(makeParams(doc, 20), doc, index);
      expect(result).not.toBeNull();
      const enumItems = result!.items.filter((i) => i.kind === LspCompletionItemKind.Enum);
      expect(enumItems.length).toBeGreaterThan(0);
    });
  });

  describe('documentation', () => {
    it('carries documentation as MarkupContent markdown', () => {
      const doc = makeDoc('<div class="bg--">');
      const result = handleCompletion(makeParams(doc, 15), doc, index);
      expect(result).not.toBeNull();
      for (const item of result!.items) {
        expect(item.documentation).toBeDefined();
        expect((item.documentation as { kind: string }).kind).toBe(MarkupKind.Markdown);
      }
    });

    it('carries detail from the library item', () => {
      const doc = makeDoc('<div class="bg--">');
      const result = handleCompletion(makeParams(doc, 15), doc, index);
      expect(result).not.toBeNull();
      for (const item of result!.items) {
        expect(typeof item.detail).toBe('string');
      }
    });

    it('carries insertText matching the label for value completions', () => {
      const doc = makeDoc('<div class="bg--">');
      const result = handleCompletion(makeParams(doc, 15), doc, index);
      expect(result).not.toBeNull();
      for (const item of result!.items) {
        expect(item.insertText).toBe(item.label);
      }
    });
  });

  describe('isIncomplete flag', () => {
    it('always returns isIncomplete: false', () => {
      const doc = makeDoc('<div class="">');
      const result = handleCompletion(makeParams(doc, 12), doc, index);
      expect(result?.isIncomplete).toBe(false);
    });
  });
});

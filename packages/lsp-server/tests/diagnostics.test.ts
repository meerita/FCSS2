// @file packages/lsp-server/tests/diagnostics.test.ts
// @description Tests for computeDiagnostics: all 7 FCSS codes, correct ranges, source diag, severity, clear-on-close.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { DiagnosticSeverity as LspDiagnosticSeverity } from 'vscode-languageserver';
import { createManifestIndex } from '@fcss/language-service';
import type { ManifestEntry } from '@fcss/language-service';
import { computeDiagnostics } from '../src/handlers/diagnostics';
import { extractClassOccurrences, occurrenceToRange } from '../src/class-extraction';

// Property names match the FCSS convention: className = `{property}--{value}`.
// 'bg--nope' triggers unknown-value (property 'bg' is known, but 'bg--nope' is not).
// 'xyz--red' triggers unknown-property ('xyz' is not in the manifest).
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
    className: 'txt--sm',
    selector: '.txt--sm',
    property: 'txt',
    value: 'sm',
    category: 'typography',
    source: 'fcss',
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

function occurrenceRange(text: string, cls: string) {
  const occs = extractClassOccurrences(text);
  const occ = occs.find((o) => o.value === cls);
  if (!occ) throw new Error(`Class "${cls}" not found in text`);
  return occurrenceToRange(text, occ);
}

describe('computeDiagnostics', () => {
  it('returns empty arrays when index is null', () => {
    const { lspDiagnostics, stored } = computeDiagnostics('<div class="bg--red">', 'html', null);
    expect(lspDiagnostics).toHaveLength(0);
    expect(stored).toHaveLength(0);
  });

  describe('fcss/unknown-property', () => {
    it('emits error for a class with unknown property', () => {
      // 'xyz--red': parseClass extracts property 'xyz', which is not in the index
      const text = '<div class="xyz--red">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/unknown-property');
      expect(diag).toBeDefined();
      expect(diag!.severity).toBe(LspDiagnosticSeverity.Error);
      expect(diag!.source).toBe('FCSS');
    });

    it('places the diagnostic at the correct occurrence range', () => {
      const text = '<div class="xyz--red">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/unknown-property');
      const expected = occurrenceRange(text, 'xyz--red');
      expect(diag!.range).toEqual(expected);
    });
  });

  describe('fcss/unknown-value', () => {
    it('emits error for a class with known property but unknown value', () => {
      // 'bg--nope': property 'bg' is in the index, but 'bg--nope' is not a manifest entry
      const text = '<div class="bg--nope">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/unknown-value');
      expect(diag).toBeDefined();
      expect(diag!.severity).toBe(LspDiagnosticSeverity.Error);
    });

    it('places unknown-value at the correct range', () => {
      const text = '<div class="bg--nope">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/unknown-value');
      const expected = occurrenceRange(text, 'bg--nope');
      expect(diag!.range).toEqual(expected);
    });
  });

  describe('fcss/conflict', () => {
    it('emits error when two classes set the same property', () => {
      const text = '<div class="bg--red bg--blue">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/conflict');
      expect(diag).toBeDefined();
      expect(diag!.severity).toBe(LspDiagnosticSeverity.Error);
      expect(diag!.source).toBe('FCSS');
    });

    it('places conflict at the first class occurrence', () => {
      const text = '<div class="bg--red bg--blue">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/conflict');
      expect(diag).toBeDefined();
      const expected = occurrenceRange(text, 'bg--red');
      expect(diag!.range).toEqual(expected);
    });
  });

  describe('fcss/duplicate', () => {
    it('emits warning when the same class appears more than once', () => {
      const text = '<div class="bg--red bg--red">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const dupes = lspDiagnostics.filter((d) => d.code === 'fcss/duplicate');
      expect(dupes.length).toBeGreaterThan(0);
      expect(dupes[0]!.severity).toBe(LspDiagnosticSeverity.Warning);
    });

    it('emits one diagnostic per occurrence of the duplicate', () => {
      const text = '<div class="bg--red bg--red">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const dupes = lspDiagnostics.filter((d) => d.code === 'fcss/duplicate');
      expect(dupes).toHaveLength(2);
    });

    it('places each duplicate diagnostic at its own occurrence range', () => {
      const text = '<div class="bg--red bg--red">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const dupes = lspDiagnostics.filter((d) => d.code === 'fcss/duplicate');
      const occs = extractClassOccurrences(text)
        .filter((o) => o.value === 'bg--red')
        .map((o) => occurrenceToRange(text, o));
      expect(dupes[0]!.range).toEqual(occs[0]);
      expect(dupes[1]!.range).toEqual(occs[1]);
    });
  });

  describe('fcss/invalid-condition-chain', () => {
    it('emits error for a class with multiple conditions', () => {
      // Two pseudo conditions chained: bg--red:hover:focus
      const text = '<div class="bg--red:hover:focus">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/invalid-condition-chain');
      expect(diag).toBeDefined();
      expect(diag!.severity).toBe(LspDiagnosticSeverity.Error);
    });

    it('places invalid-condition-chain at the correct range', () => {
      const text = '<div class="bg--red:hover:focus">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/invalid-condition-chain');
      const expected = occurrenceRange(text, 'bg--red:hover:focus');
      expect(diag!.range).toEqual(expected);
    });
  });

  describe('fcss/deprecated-class', () => {
    it('emits warning for a deprecated class', () => {
      const text = '<div class="old--cls">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/deprecated-class');
      expect(diag).toBeDefined();
      expect(diag!.severity).toBe(LspDiagnosticSeverity.Warning);
    });

    it('places deprecated-class at the correct range', () => {
      const text = '<div class="old--cls">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/deprecated-class');
      const expected = occurrenceRange(text, 'old--cls');
      expect(diag!.range).toEqual(expected);
    });

    it('appends suggestion to message when a canonical replacement exists', () => {
      const text = '<div class="old--cls">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/deprecated-class');
      expect(diag!.message).toContain('new--cls');
    });
  });

  describe('fcss/dynamic-purge-risk (source diagnostic)', () => {
    it('does not emit source diagnostics for html', () => {
      const text = '<div class="bg--red">';
      const { lspDiagnostics } = computeDiagnostics(text, 'html', index);
      const diags = lspDiagnostics.filter((d) => d.code === 'fcss/dynamic-purge-risk');
      expect(diags).toHaveLength(0);
    });

    it('emits source diagnostic for a tsx document with a dynamic template literal', () => {
      const text = 'const cls = `bg--${size}`;';
      const { lspDiagnostics } = computeDiagnostics(text, 'typescriptreact', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/dynamic-purge-risk');
      expect(diag).toBeDefined();
      expect(diag!.severity).toBe(LspDiagnosticSeverity.Warning);
      expect(diag!.source).toBe('FCSS');
    });

    it('emits source diagnostic for typescript documents', () => {
      const text = 'const x = `txt--${size}`;';
      const { lspDiagnostics } = computeDiagnostics(text, 'typescript', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/dynamic-purge-risk');
      expect(diag).toBeDefined();
    });

    it('does not emit source diagnostic for javascript when dynamic literal has no FCSS pattern', () => {
      const text = 'const x = `hello ${name}`;';
      const { lspDiagnostics } = computeDiagnostics(text, 'javascript', index);
      const diags = lspDiagnostics.filter((d) => d.code === 'fcss/dynamic-purge-risk');
      expect(diags).toHaveLength(0);
    });

    it('places dynamic-purge-risk at the template literal range', () => {
      const text = 'const cls = `bg--${size}`;';
      // the template literal '`bg--${size}`' starts at offset 12
      const { lspDiagnostics } = computeDiagnostics(text, 'typescriptreact', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/dynamic-purge-risk');
      expect(diag).toBeDefined();
      expect(diag!.range.start.character).toBe(12);
    });
  });

  describe('stored diagnostics for code actions', () => {
    it('stored count matches lspDiagnostics count', () => {
      const text = '<div class="bg--red old--cls">';
      const { lspDiagnostics, stored } = computeDiagnostics(text, 'html', index);
      expect(stored).toHaveLength(lspDiagnostics.length);
    });

    it('stored entries carry the original DiagnosticItem', () => {
      const text = '<div class="old--cls">';
      const { stored } = computeDiagnostics(text, 'html', index);
      const entry = stored.find((s) => s.item.code === 'fcss/deprecated-class');
      expect(entry).toBeDefined();
      expect(entry!.item.className).toBe('old--cls');
    });

    it('stored range matches the lspDiagnostic range', () => {
      const text = '<div class="old--cls">';
      const { lspDiagnostics, stored } = computeDiagnostics(text, 'html', index);
      const lspDiag = lspDiagnostics.find((d) => d.code === 'fcss/deprecated-class');
      const storedEntry = stored.find((s) => s.item.code === 'fcss/deprecated-class');
      expect(storedEntry!.range).toEqual(lspDiag!.range);
    });
  });

  describe('severity mapping', () => {
    it('error severity maps to LSP Error (1)', () => {
      const { lspDiagnostics } = computeDiagnostics('<div class="xyz--red">', 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/unknown-property');
      expect(diag!.severity).toBe(1);
    });

    it('warning severity maps to LSP Warning (2)', () => {
      const { lspDiagnostics } = computeDiagnostics('<div class="old--cls">', 'html', index);
      const diag = lspDiagnostics.find((d) => d.code === 'fcss/deprecated-class');
      expect(diag!.severity).toBe(2);
    });
  });
});

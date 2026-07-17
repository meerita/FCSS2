// @file packages/language-service/tests/diagnostics.test.ts
// @description Unit tests for all 7 FCSS diagnostic types.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { getDiagnostics, getSourceDiagnostics } from '../src/diagnostics';
import { createManifestIndex } from '../src/manifest';
import type { ManifestEntry } from '../src/manifest';

const FIXTURE: ManifestEntry[] = [
  {
    className: 'display--flex',
    selector: '.display--flex',
    property: 'display',
    value: 'flex',
    category: 'display',
    source: 'CSS',
  },
  {
    className: 'display--block',
    selector: '.display--block',
    property: 'display',
    value: 'block',
    category: 'display',
    source: 'CSS',
  },
  {
    className: 'display--none',
    selector: '.display--none',
    property: 'display',
    value: 'none',
    category: 'display',
    source: 'CSS',
  },
  {
    className: 'display--flex:hover',
    selector: '.display--flex\\:hover:hover',
    property: 'display',
    value: 'flex',
    category: 'display',
    source: 'CSS',
    condition: { type: 'pseudo', value: 'hover' },
  },
  {
    className: 'display--none:aria-expanded:true',
    selector: ".[aria-expanded='true']",
    property: 'display',
    value: 'none',
    category: 'display',
    source: 'CSS',
    condition: { type: 'aria', attribute: 'aria-expanded', value: 'true' },
  },
  {
    className: 'margin--8',
    selector: '.margin--8',
    property: 'margin',
    value: '8px',
    category: 'box-model',
    source: 'CSS',
  },
  {
    className: 'margin-left--8',
    selector: '.margin-left--8',
    property: 'margin-left',
    value: '8px',
    category: 'box-model',
    source: 'CSS',
  },
  {
    className: 'old-display--value',
    selector: '.old',
    property: 'old-display',
    value: 'value',
    category: 'display',
    source: 'legacy',
    deprecated: true,
    canonical: 'display--flex',
  },
];

const index = createManifestIndex(FIXTURE);

describe('getDiagnostics', () => {
  describe('DUPLICATE', () => {
    it('flags duplicate class names', () => {
      const diags = getDiagnostics(['display--flex', 'display--flex'], index);
      expect(diags.some((d) => d.code === 'fcss/duplicate')).toBe(true);
    });

    it('reports the duplicated class name', () => {
      const diags = getDiagnostics(['display--flex', 'display--flex'], index);
      const dup = diags.find((d) => d.code === 'fcss/duplicate');
      expect(dup?.className).toBe('display--flex');
    });

    it('does not flag unique classes', () => {
      const diags = getDiagnostics(['display--flex', 'display--block'], index);
      expect(diags.some((d) => d.code === 'fcss/duplicate')).toBe(false);
    });
  });

  describe('UNKNOWN_PROPERTY', () => {
    it('flags a class with an unknown property', () => {
      const diags = getDiagnostics(['foobar--flex'], index);
      expect(diags.some((d) => d.code === 'fcss/unknown-property')).toBe(true);
    });

    it('provides a suggestion for close property names', () => {
      const diags = getDiagnostics(['display--flex', 'displa--flex'], index);
      const diag = diags.find((d) => d.code === 'fcss/unknown-property');
      expect(diag?.suggestion).toBeDefined();
    });
  });

  describe('UNKNOWN_VALUE', () => {
    it('flags a class with known property but unknown value', () => {
      const diags = getDiagnostics(['display--grid'], index);
      expect(diags.some((d) => d.code === 'fcss/unknown-value')).toBe(true);
    });

    it('reports the unknown class in the message', () => {
      const diags = getDiagnostics(['display--grid'], index);
      const diag = diags.find((d) => d.code === 'fcss/unknown-value');
      expect(diag?.message).toContain('display--grid');
    });
  });

  describe('CONFLICT', () => {
    it('flags conflicting classes (same property, different values)', () => {
      const diags = getDiagnostics(['display--flex', 'display--block'], index);
      expect(diags.some((d) => d.code === 'fcss/conflict')).toBe(true);
    });

    it('does not flag same-value classes', () => {
      const diags = getDiagnostics(['display--flex', 'display--flex:hover'], index);
      expect(diags.some((d) => d.code === 'fcss/conflict')).toBe(false);
    });

    it('error severity for conflicts', () => {
      const diags = getDiagnostics(['display--flex', 'display--block'], index);
      const conflict = diags.find((d) => d.code === 'fcss/conflict');
      expect(conflict?.severity).toBe('error');
    });
  });

  describe('INVALID_CONDITION_CHAIN', () => {
    it('flags classes with multiple conditions', () => {
      const diags = getDiagnostics(['color--red:hover:focus'], index);
      expect(diags.some((d) => d.code === 'fcss/invalid-condition-chain')).toBe(true);
    });

    it('error severity for invalid chains', () => {
      const diags = getDiagnostics(['color--red:hover:focus'], index);
      const diag = diags.find((d) => d.code === 'fcss/invalid-condition-chain');
      expect(diag?.severity).toBe('error');
    });
  });

  describe('DEPRECATED_CLASS', () => {
    it('flags deprecated classes', () => {
      const diags = getDiagnostics(['old-display--value'], index);
      expect(diags.some((d) => d.code === 'fcss/deprecated-class')).toBe(true);
    });

    it('warning severity for deprecated classes', () => {
      const diags = getDiagnostics(['old-display--value'], index);
      const diag = diags.find((d) => d.code === 'fcss/deprecated-class');
      expect(diag?.severity).toBe('warning');
    });

    it('includes canonical replacement in suggestion', () => {
      const diags = getDiagnostics(['old-display--value'], index);
      const diag = diags.find((d) => d.code === 'fcss/deprecated-class');
      expect(diag?.suggestion).toContain('display--flex');
    });
  });

  describe('valid classes', () => {
    it('returns no diagnostics for valid unique classes', () => {
      const diags = getDiagnostics(['display--flex'], index);
      expect(diags).toHaveLength(0);
    });

    it('returns no diagnostics for empty class list', () => {
      const diags = getDiagnostics([], index);
      expect(diags).toHaveLength(0);
    });
  });
});

describe('getSourceDiagnostics', () => {
  describe('DYNAMIC_PURGE_RISK', () => {
    it('flags template literals with dynamic FCSS class fragments', () => {
      const source = 'const cls = `display--${isVisible ? "flex" : "none"}`;';
      const diags = getSourceDiagnostics(source);
      expect(diags.some((d) => d.code === 'fcss/dynamic-purge-risk')).toBe(true);
    });

    it('flags template literals with pseudo-state fragments', () => {
      const source = 'const cls = `display--flex:${state}`;';
      const diags = getSourceDiagnostics(source);
      expect(diags.some((d) => d.code === 'fcss/dynamic-purge-risk')).toBe(true);
    });

    it('warning severity for dynamic purge risk', () => {
      const source = 'const cls = `display--${val}`;';
      const diags = getSourceDiagnostics(source);
      const diag = diags.find((d) => d.code === 'fcss/dynamic-purge-risk');
      expect(diag?.severity).toBe('warning');
    });

    it('returns no diagnostics for static source', () => {
      const source = 'const cls = "display--flex";';
      const diags = getSourceDiagnostics(source);
      expect(diags).toHaveLength(0);
    });
  });
});

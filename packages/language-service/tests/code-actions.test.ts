// @file packages/language-service/tests/code-actions.test.ts
// @description Unit tests for the 5 code action types.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { getCodeActions } from '../src/code-actions';
import { createManifestIndex } from '../src/manifest';
import type { ManifestEntry } from '../src/manifest';
import type { DiagnosticItem } from '../src/diagnostics';

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

function makeDiag(partial: Partial<DiagnosticItem>): DiagnosticItem {
  return {
    className: 'display--flex',
    code: 'fcss/unknown-property',
    severity: 'error',
    message: 'test',
    ...partial,
  };
}

describe('getCodeActions', () => {
  describe('action 1: replace with canonical (deprecated class)', () => {
    it('provides a quickfix edit for deprecated class with canonical', () => {
      const actions = getCodeActions(
        makeDiag({
          className: 'old-display--value',
          code: 'fcss/deprecated-class',
          severity: 'warning',
        }),
        index,
      );
      const replace = actions.find((a) => a.edit);
      expect(replace).toBeDefined();
      expect(replace?.kind).toBe('quickfix');
      expect(replace?.edit?.replacement).toBe('display--flex');
      expect(replace?.edit?.className).toBe('old-display--value');
    });

    it('does not provide edit when no canonical exists', () => {
      const entryWithoutCanonical: ManifestEntry = {
        className: 'no-canon--val',
        selector: '.no-canon--val',
        property: 'no-canon',
        value: 'val',
        category: 'display',
        source: 'CSS',
        deprecated: true,
      };
      const idx = createManifestIndex([...FIXTURE, entryWithoutCanonical]);
      const actions = getCodeActions(
        makeDiag({
          className: 'no-canon--val',
          code: 'fcss/deprecated-class',
          severity: 'warning',
        }),
        idx,
      );
      expect(actions.some((a) => a.edit)).toBe(false);
    });
  });

  describe('action 2: add to safelist', () => {
    it('provides add-to-safelist action for unknown property', () => {
      const actions = getCodeActions(
        makeDiag({ className: 'unknown--class', code: 'fcss/unknown-property' }),
        index,
      );
      const safelist = actions.find((a) => a.command?.id === 'fcss.addToSafelist');
      expect(safelist).toBeDefined();
      expect(safelist?.kind).toBe('quickfix');
      expect(safelist?.command?.args).toContain('unknown--class');
    });

    it('provides add-to-safelist action for unknown value', () => {
      const actions = getCodeActions(
        makeDiag({ className: 'display--invalid', code: 'fcss/unknown-value' }),
        index,
      );
      expect(actions.some((a) => a.command?.id === 'fcss.addToSafelist')).toBe(true);
    });
  });

  describe('action 3: convert dynamic to static map', () => {
    it('provides convert-to-static-map action for dynamic purge risk', () => {
      const actions = getCodeActions(
        makeDiag({
          className: '`display--${val}`',
          code: 'fcss/dynamic-purge-risk',
          severity: 'warning',
        }),
        index,
      );
      const convert = actions.find((a) => a.command?.id === 'fcss.convertToStaticMap');
      expect(convert).toBeDefined();
      expect(convert?.kind).toBe('refactor.rewrite');
    });
  });

  describe('action 4: open documentation', () => {
    it('always includes open-docs action', () => {
      const actions = getCodeActions(makeDiag({ code: 'fcss/unknown-property' }), index);
      expect(actions.some((a) => a.command?.id === 'fcss.openDocs')).toBe(true);
    });

    it('includes open-docs for deprecated class too', () => {
      const actions = getCodeActions(
        makeDiag({
          className: 'old-display--value',
          code: 'fcss/deprecated-class',
          severity: 'warning',
        }),
        index,
      );
      expect(actions.some((a) => a.command?.id === 'fcss.openDocs')).toBe(true);
    });
  });

  describe('action 5: create c- rule skeleton', () => {
    it('provides create-c-rule action for unknown property', () => {
      const actions = getCodeActions(makeDiag({ code: 'fcss/unknown-property' }), index);
      const cRule = actions.find((a) => a.command?.id === 'fcss.createCRule');
      expect(cRule).toBeDefined();
      expect(cRule?.kind).toBe('refactor');
    });

    it('provides create-c-rule action for unknown value', () => {
      const actions = getCodeActions(makeDiag({ code: 'fcss/unknown-value' }), index);
      expect(actions.some((a) => a.command?.id === 'fcss.createCRule')).toBe(true);
    });

    it('skeleton snippet contains c- comment', () => {
      const actions = getCodeActions(
        makeDiag({ className: 'my--class', code: 'fcss/unknown-property' }),
        index,
      );
      const cRule = actions.find((a) => a.command?.id === 'fcss.createCRule');
      const skeleton = cRule?.command?.args?.[1] as string | undefined;
      expect(skeleton).toContain('c-');
    });
  });
});

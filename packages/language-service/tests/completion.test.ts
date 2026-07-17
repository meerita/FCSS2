// @file packages/language-service/tests/completion.test.ts
// @description Unit tests for the completion engine.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { getCompletions, CompletionItemKind } from '../src/completion';
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
    className: 'display--flex:focus',
    selector: '.display--flex\\:focus:focus',
    property: 'display',
    value: 'flex',
    category: 'display',
    source: 'CSS',
    condition: { type: 'pseudo', value: 'focus' },
  },
  {
    className: 'display--none:aria-expanded:true',
    selector: ".display--none\\:aria-expanded\\:true[aria-expanded='true']",
    property: 'display',
    value: 'none',
    category: 'display',
    source: 'CSS',
    condition: { type: 'aria', attribute: 'aria-expanded', value: 'true' },
  },
  {
    className: 'display--none:aria-expanded:false',
    selector: ".display--none\\:aria-expanded\\:false[aria-expanded='false']",
    property: 'display',
    value: 'none',
    category: 'display',
    source: 'CSS',
    condition: { type: 'aria', attribute: 'aria-expanded', value: 'false' },
  },
  {
    className: 'md-display--flex',
    selector: '.md-display--flex',
    property: 'display',
    value: 'flex',
    category: 'display',
    source: 'CSS',
    breakpoint: 'md',
  },
  {
    className: 'md-display--flex:hover',
    selector: '.md-display--flex\\:hover:hover',
    property: 'display',
    value: 'flex',
    category: 'display',
    source: 'CSS',
    breakpoint: 'md',
    condition: { type: 'pseudo', value: 'hover' },
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
    className: 'color--red',
    selector: '.color--red',
    property: 'color',
    value: 'red',
    category: 'color',
    source: 'CSS',
  },
];

const index = createManifestIndex(FIXTURE);

describe('getCompletions', () => {
  describe('empty input', () => {
    it('returns breakpoint prefixes and all properties', () => {
      const items = getCompletions('', index);
      const labels = items.map((i) => i.label);
      expect(labels).toContain('md-');
      expect(labels.some((l) => l.startsWith('display'))).toBe(true);
      expect(labels.some((l) => l.startsWith('margin'))).toBe(true);
    });

    it('includes breakpoint items with Module kind', () => {
      const items = getCompletions('', index);
      const bp = items.find((i) => i.label === 'md-');
      expect(bp?.kind).toBe(CompletionItemKind.Module);
    });
  });

  describe('property prefix (before --)', () => {
    it('returns matching properties for partial input', () => {
      const items = getCompletions('dis', index);
      expect(items.some((i) => i.label.startsWith('display'))).toBe(true);
    });

    it('returns property items with Property kind', () => {
      const items = getCompletions('dis', index);
      const prop = items.find((i) => i.label.startsWith('display'));
      expect(prop?.kind).toBe(CompletionItemKind.Property);
    });

    it('includes -- in insertText', () => {
      const items = getCompletions('dis', index);
      const prop = items.find((i) => i.label.includes('display'));
      expect(prop?.insertText).toContain('--');
    });

    it('returns all properties for empty property part', () => {
      const items = getCompletions('', index);
      const props = items.filter((i) => i.kind === CompletionItemKind.Property);
      expect(props.length).toBeGreaterThan(0);
    });
  });

  describe('breakpoint + property prefix', () => {
    it('returns properties with bp prefix for bp-', () => {
      const items = getCompletions('md-', index);
      expect(items.some((i) => i.label.startsWith('md-display'))).toBe(true);
    });

    it('returns properties matching partial after bp', () => {
      const items = getCompletions('md-dis', index);
      expect(items.some((i) => i.label.startsWith('md-display'))).toBe(true);
    });

    it('insertText includes bp prefix', () => {
      const items = getCompletions('md-', index);
      const prop = items.find((i) => i.label.startsWith('md-display'));
      expect(prop?.insertText).toMatch(/^md-display--/);
    });
  });

  describe('value completions (after --)', () => {
    it('returns all values for a property', () => {
      const items = getCompletions('display--', index);
      const labels = items.map((i) => i.label);
      expect(labels).toContain('display--flex');
      expect(labels).toContain('display--block');
      expect(labels).toContain('display--none');
    });

    it('filters values by partial input', () => {
      const items = getCompletions('display--fl', index);
      expect(items.some((i) => i.label === 'display--flex')).toBe(true);
      expect(items.some((i) => i.label === 'display--block')).toBe(false);
    });

    it('includes CSS documentation', () => {
      const items = getCompletions('display--', index);
      const flex = items.find((i) => i.label === 'display--flex');
      expect(flex?.documentation).toContain('display');
      expect(flex?.documentation).toContain('flex');
    });

    it('returns value items with Value kind', () => {
      const items = getCompletions('display--', index);
      const flex = items.find((i) => i.label === 'display--flex');
      expect(flex?.kind).toBe(CompletionItemKind.Value);
    });

    it('returns values for responsive class', () => {
      const items = getCompletions('md-display--', index);
      expect(items.some((i) => i.label === 'md-display--flex')).toBe(true);
    });
  });

  describe('condition completions (after :)', () => {
    it('returns pseudo-class completions after :', () => {
      const items = getCompletions('display--flex:', index);
      const labels = items.map((i) => i.label);
      expect(labels).toContain('display--flex:hover');
      expect(labels).toContain('display--flex:focus');
    });

    it('includes aria- prefix suggestion', () => {
      const items = getCompletions('display--flex:', index);
      expect(items.some((i) => i.label.includes('aria-'))).toBe(true);
    });

    it('filters pseudo by partial', () => {
      const items = getCompletions('display--flex:hov', index);
      expect(items.some((i) => i.label === 'display--flex:hover')).toBe(true);
      expect(items.some((i) => i.label === 'display--flex:focus')).toBe(false);
    });
  });

  describe('ARIA attribute completions', () => {
    it('returns ARIA attributes after :aria-', () => {
      const items = getCompletions('display--none:aria-', index);
      expect(items.some((i) => i.label.includes('aria-expanded'))).toBe(true);
    });

    it('filters ARIA attributes by partial', () => {
      const items = getCompletions('display--none:aria-exp', index);
      expect(items.some((i) => i.label.includes('aria-expanded'))).toBe(true);
    });

    it('returns ARIA value completions after aria-attr:', () => {
      const items = getCompletions('display--none:aria-expanded:', index);
      const labels = items.map((i) => i.label);
      expect(labels).toContain('display--none:aria-expanded:true');
      expect(labels).toContain('display--none:aria-expanded:false');
    });

    it('filters ARIA values by partial', () => {
      const items = getCompletions('display--none:aria-expanded:tr', index);
      expect(items.some((i) => i.label === 'display--none:aria-expanded:true')).toBe(true);
      expect(items.some((i) => i.label === 'display--none:aria-expanded:false')).toBe(false);
    });
  });
});

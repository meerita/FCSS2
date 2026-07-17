// @file packages/language-service/tests/manifest.test.ts
// @description Unit tests for the manifest loader and indexer.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { createManifestIndex } from '../src/manifest';
import type { ManifestEntry } from '../src/manifest';

const FIXTURE: ManifestEntry[] = [
  {
    className: 'display--flex',
    selector: '.display--flex',
    property: 'display',
    value: 'flex',
    category: 'display',
    source: 'CSS Display Level 3',
  },
  {
    className: 'display--block',
    selector: '.display--block',
    property: 'display',
    value: 'block',
    category: 'display',
    source: 'CSS Display Level 3',
  },
  {
    className: 'display--none',
    selector: '.display--none',
    property: 'display',
    value: 'none',
    category: 'display',
    source: 'CSS Display Level 3',
  },
  {
    className: 'display--flex:hover',
    selector: '.display--flex\\:hover:hover',
    property: 'display',
    value: 'flex',
    category: 'display',
    source: 'CSS Display Level 3',
    condition: { type: 'pseudo', value: 'hover' },
  },
  {
    className: 'display--none:aria-expanded:true',
    selector: ".display--none\\:aria-expanded\\:true[aria-expanded='true']",
    property: 'display',
    value: 'none',
    category: 'display',
    source: 'CSS Display Level 3',
    condition: { type: 'aria', attribute: 'aria-expanded', value: 'true' },
  },
  {
    className: 'display--none:aria-expanded:false',
    selector: ".display--none\\:aria-expanded\\:false[aria-expanded='false']",
    property: 'display',
    value: 'none',
    category: 'display',
    source: 'CSS Display Level 3',
    condition: { type: 'aria', attribute: 'aria-expanded', value: 'false' },
  },
  {
    className: 'md-display--flex',
    selector: '.md-display--flex',
    property: 'display',
    value: 'flex',
    category: 'display',
    source: 'CSS Display Level 3',
    breakpoint: 'md',
  },
  {
    className: 'margin--8',
    selector: '.margin--8',
    property: 'margin',
    value: '8px',
    category: 'box-model',
    source: 'CSS Box Model Level 3',
  },
  {
    className: 'margin-left--8',
    selector: '.margin-left--8',
    property: 'margin-left',
    value: '8px',
    category: 'box-model',
    source: 'CSS Box Model Level 3',
  },
  {
    className: 'old-class--value',
    selector: '.old-class--value',
    property: 'old-class',
    value: 'value',
    category: 'display',
    source: 'legacy',
    deprecated: true,
    canonical: 'display--flex',
  },
];

describe('createManifestIndex', () => {
  const index = createManifestIndex(FIXTURE);

  it('builds byClassName map with O(1) lookup', () => {
    expect(index.byClassName.get('display--flex')).toBeDefined();
    expect(index.byClassName.get('display--flex')?.value).toBe('flex');
    expect(index.byClassName.get('nonexistent')).toBeUndefined();
  });

  it('builds byProperty map', () => {
    const displayEntries = index.byProperty.get('display');
    expect(displayEntries).toBeDefined();
    expect(displayEntries!.length).toBeGreaterThan(2);
  });

  it('builds byCategory map', () => {
    const displayCat = index.byCategory.get('display');
    expect(displayCat).toBeDefined();
    expect(displayCat!.length).toBeGreaterThan(0);
  });

  it('collects unique properties sorted', () => {
    expect(index.properties).toContain('display');
    expect(index.properties).toContain('margin');
    expect(index.properties).toEqual([...index.properties].sort());
  });

  it('collects pseudo conditions', () => {
    expect(index.pseudoConditions).toContain('hover');
  });

  it('collects ARIA attributes', () => {
    expect(index.ariaAttributes).toContain('aria-expanded');
  });

  it('maps ARIA attribute values', () => {
    const vals = index.ariaAttributeValues.get('aria-expanded');
    expect(vals).toContain('true');
    expect(vals).toContain('false');
  });

  it('collects breakpoints in order', () => {
    expect(index.breakpoints).toContain('md');
    expect(index.breakpoints[0]).toBe('md');
  });

  it('builds valuesByProperty', () => {
    const displayVals = index.valuesByProperty.get('display');
    expect(displayVals).toContain('flex');
    expect(displayVals).toContain('block');
    expect(displayVals).toContain('none');
  });

  it('handles empty entries array', () => {
    const empty = createManifestIndex([]);
    expect(empty.entries).toHaveLength(0);
    expect(empty.properties).toHaveLength(0);
    expect(empty.byClassName.size).toBe(0);
  });

  it('includes deprecated entries in index', () => {
    const entry = index.byClassName.get('old-class--value');
    expect(entry?.deprecated).toBe(true);
    expect(entry?.canonical).toBe('display--flex');
  });
});

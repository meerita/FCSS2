// @file packages/language-service/tests/hover.test.ts
// @description Unit tests for the hover provider.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { getHover } from '../src/hover';
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
    className: 'md-display--flex',
    selector: '.md-display--flex',
    property: 'display',
    value: 'flex',
    category: 'display',
    source: 'CSS Display Level 3',
    breakpoint: 'md',
  },
  {
    className: 'old-class--x',
    selector: '.old-class--x',
    property: 'old-class',
    value: 'x',
    category: 'display',
    source: 'legacy',
    deprecated: true,
    canonical: 'display--flex',
  },
];

const index = createManifestIndex(FIXTURE);

describe('getHover', () => {
  it('returns null for unknown class', () => {
    expect(getHover('nonexistent--class', index)).toBeNull();
  });

  it('returns CSS snippet for base class', () => {
    const result = getHover('display--flex', index);
    expect(result).not.toBeNull();
    expect(result!.contents).toContain('display: flex');
  });

  it('includes property and value', () => {
    const result = getHover('display--flex', index);
    expect(result!.contents).toContain('display');
    expect(result!.contents).toContain('flex');
  });

  it('includes category', () => {
    const result = getHover('display--flex', index);
    expect(result!.contents).toContain('display');
  });

  it('includes source', () => {
    const result = getHover('display--flex', index);
    expect(result!.contents).toContain('CSS Display Level 3');
  });

  it('shows pseudo condition info', () => {
    const result = getHover('display--flex:hover', index);
    expect(result!.contents).toContain('hover');
  });

  it('shows ARIA condition info', () => {
    const result = getHover('display--none:aria-expanded:true', index);
    expect(result!.contents).toContain('aria-expanded');
    expect(result!.contents).toContain('true');
  });

  it('shows breakpoint info with pixel width', () => {
    const result = getHover('md-display--flex', index);
    expect(result!.contents).toContain('md');
    expect(result!.contents).toContain('768');
  });

  it('includes media query in CSS for breakpoint class', () => {
    const result = getHover('md-display--flex', index);
    expect(result!.contents).toContain('@media');
    expect(result!.contents).toContain('min-width');
  });

  it('shows deprecation warning for deprecated class', () => {
    const result = getHover('old-class--x', index);
    expect(result!.contents).toContain('Deprecated');
    expect(result!.contents).toContain('display--flex');
  });
});

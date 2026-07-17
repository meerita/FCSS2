// @file packages/vscode/tests/extension.test.ts
// @description Unit tests for extension helper functions that do not require the VS Code API.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import {
  createManifestIndex,
  getCompletions,
  getHover,
  getDiagnostics,
  parseClass,
} from '@fcss/language-service';
import type { ManifestEntry } from '@fcss/language-service';

// These tests validate that the language service integrates correctly when
// consumed from a CommonJS context (as in the extension runtime).

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
];

const index = createManifestIndex(FIXTURE);

describe('language-service CJS integration (from extension context)', () => {
  it('parseClass is importable and functional', () => {
    const token = parseClass('display--flex');
    expect(token.property).toBe('display');
    expect(token.classValue).toBe('flex');
    expect(token.isValid).toBe(true);
  });

  it('createManifestIndex produces a functional index', () => {
    expect(index.byClassName.get('display--flex')).toBeDefined();
    expect(index.properties).toContain('display');
  });

  it('getCompletions returns items from manifest', () => {
    const items = getCompletions('display--', index);
    expect(items.some((i) => i.label === 'display--flex')).toBe(true);
    expect(items.some((i) => i.label === 'display--block')).toBe(true);
  });

  it('getCompletions returns breakpoints and properties for empty input', () => {
    const items = getCompletions('', index);
    expect(items.length).toBeGreaterThan(0);
  });

  it('getHover returns content for known class', () => {
    const result = getHover('display--flex', index);
    expect(result).not.toBeNull();
    expect(result!.contents).toContain('display: flex');
  });

  it('getHover returns null for unknown class', () => {
    expect(getHover('nonexistent--class', index)).toBeNull();
  });

  it('getDiagnostics detects conflict', () => {
    const diags = getDiagnostics(['display--flex', 'display--block'], index);
    expect(diags.some((d) => d.code === 'fcss/conflict')).toBe(true);
  });

  it('getDiagnostics returns empty for valid single class', () => {
    const diags = getDiagnostics(['display--flex'], index);
    expect(diags).toHaveLength(0);
  });

  it('getCompletions returns pseudo completions after :', () => {
    const items = getCompletions('display--flex:', index);
    expect(items.some((i) => i.label === 'display--flex:hover')).toBe(true);
  });

  it('getCompletions returns ARIA completions after :aria-', () => {
    const items = getCompletions('display--none:aria-', index);
    expect(items.some((i) => i.label.includes('aria-expanded'))).toBe(true);
  });
});

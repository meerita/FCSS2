// @file packages/language-service/tests/conflict.test.ts
// @description Unit tests for the conflict detection model.
// @layer tests
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { describe, it, expect } from 'vitest';
import { detectConflicts } from '../src/conflict';
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
    className: 'display--block:hover',
    selector: '.display--block\\:hover:hover',
    property: 'display',
    value: 'block',
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
    className: 'display--flex:aria-expanded:true',
    selector: ".[aria-expanded='true']",
    property: 'display',
    value: 'flex',
    category: 'display',
    source: 'CSS',
    condition: { type: 'aria', attribute: 'aria-expanded', value: 'true' },
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
    className: 'md-display--block',
    selector: '.md-display--block',
    property: 'display',
    value: 'block',
    category: 'display',
    source: 'CSS',
    breakpoint: 'md',
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
    className: 'margin--16',
    selector: '.margin--16',
    property: 'margin',
    value: '16px',
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
    className: 'margin-top--4',
    selector: '.margin-top--4',
    property: 'margin-top',
    value: '4px',
    category: 'box-model',
    source: 'CSS',
  },
];

const index = createManifestIndex(FIXTURE);

describe('detectConflicts', () => {
  describe('triple conflict (same property, same breakpoint, same condition)', () => {
    it('detects conflict between two base classes with same property', () => {
      const results = detectConflicts(['display--flex', 'display--block'], index);
      expect(results.some((r) => r.type === 'conflict')).toBe(true);
    });

    it('reports conflicting class names', () => {
      const results = detectConflicts(['display--flex', 'display--block'], index);
      const conflict = results.find((r) => r.type === 'conflict');
      expect([conflict?.classA, conflict?.classB]).toContain('display--flex');
      expect([conflict?.classA, conflict?.classB]).toContain('display--block');
    });

    it('reports the conflicting property', () => {
      const results = detectConflicts(['display--flex', 'display--block'], index);
      const conflict = results.find((r) => r.type === 'conflict');
      expect(conflict?.property).toBe('display');
    });

    it('detects conflict between pseudo-state classes', () => {
      const results = detectConflicts(['display--flex:hover', 'display--block:hover'], index);
      expect(results.some((r) => r.type === 'conflict')).toBe(true);
    });

    it('does NOT flag same property with different conditions as conflict', () => {
      const results = detectConflicts(['display--flex', 'display--block:hover'], index);
      expect(results.some((r) => r.type === 'conflict')).toBe(false);
    });

    it('detects conflict between ARIA-state classes', () => {
      const results = detectConflicts(
        ['display--none:aria-expanded:true', 'display--flex:aria-expanded:true'],
        index,
      );
      expect(results.some((r) => r.type === 'conflict')).toBe(true);
    });

    it('detects conflict between responsive classes', () => {
      const results = detectConflicts(['md-display--flex', 'md-display--block'], index);
      expect(results.some((r) => r.type === 'conflict')).toBe(true);
    });

    it('does NOT flag same property at different breakpoints', () => {
      const results = detectConflicts(['display--flex', 'md-display--block'], index);
      expect(results.some((r) => r.type === 'conflict')).toBe(false);
    });

    it('returns empty for non-conflicting classes', () => {
      const results = detectConflicts(['display--flex', 'margin--8'], index);
      expect(results).toHaveLength(0);
    });

    it('returns empty for empty class list', () => {
      expect(detectConflicts([], index)).toHaveLength(0);
    });

    it('returns empty for single class', () => {
      expect(detectConflicts(['display--flex'], index)).toHaveLength(0);
    });
  });

  describe('shorthand overlap', () => {
    it('detects shorthand + longhand overlap', () => {
      const results = detectConflicts(['margin--16', 'margin-left--8'], index);
      expect(results.some((r) => r.type === 'shorthand-overlap')).toBe(true);
    });

    it('reports the shorthand property name', () => {
      const results = detectConflicts(['margin--16', 'margin-left--8'], index);
      const overlap = results.find((r) => r.type === 'shorthand-overlap');
      expect(overlap?.property).toBe('margin');
    });

    it('does not duplicate overlap pairs', () => {
      const results = detectConflicts(['margin--16', 'margin-left--8', 'margin-top--4'], index);
      const overlaps = results.filter((r) => r.type === 'shorthand-overlap');
      const pairCount = overlaps.length;
      expect(pairCount).toBe(2);
    });

    it('does not flag shorthand + non-related longhand', () => {
      const results = detectConflicts(['margin--16', 'display--flex'], index);
      expect(results.some((r) => r.type === 'shorthand-overlap')).toBe(false);
    });
  });
});

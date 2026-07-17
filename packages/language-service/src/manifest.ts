// @file packages/language-service/src/manifest.ts
// @description Loads and indexes the FCSS manifest for O(1) lookup and watch-reload.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { readFileSync, watch as fsWatch } from 'node:fs';
import type { FSWatcher } from 'node:fs';

export interface ManifestCondition {
  type: 'pseudo' | 'aria';
  value?: string;
  attribute?: string;
}

export interface ManifestEntry {
  className: string;
  selector: string;
  property: string;
  value: string;
  category: string;
  source: string;
  condition?: ManifestCondition;
  breakpoint?: string;
  deprecated?: boolean;
  canonical?: string;
}

export interface ManifestIndex {
  entries: ManifestEntry[];
  byClassName: Map<string, ManifestEntry>;
  byProperty: Map<string, ManifestEntry[]>;
  byCategory: Map<string, ManifestEntry[]>;
  properties: string[];
  categories: string[];
  pseudoConditions: string[];
  ariaAttributes: string[];
  ariaAttributeValues: Map<string, string[]>;
  breakpoints: string[];
  valuesByProperty: Map<string, string[]>;
}

export function createManifestIndex(entries: ManifestEntry[]): ManifestIndex {
  const byClassName = new Map<string, ManifestEntry>();
  const byProperty = new Map<string, ManifestEntry[]>();
  const byCategory = new Map<string, ManifestEntry[]>();
  const propertySet = new Set<string>();
  const categorySet = new Set<string>();
  const pseudoSet = new Set<string>();
  const ariaAttrSet = new Set<string>();
  const breakpointSet = new Set<string>();
  const valuesByPropertyRaw = new Map<string, Set<string>>();
  const ariaAttrValuesRaw = new Map<string, Set<string>>();

  for (const entry of entries) {
    byClassName.set(entry.className, entry);

    let propList = byProperty.get(entry.property);
    if (!propList) {
      propList = [];
      byProperty.set(entry.property, propList);
    }
    propList.push(entry);

    let catList = byCategory.get(entry.category);
    if (!catList) {
      catList = [];
      byCategory.set(entry.category, catList);
    }
    catList.push(entry);

    propertySet.add(entry.property);
    categorySet.add(entry.category);

    let vals = valuesByPropertyRaw.get(entry.property);
    if (!vals) {
      vals = new Set();
      valuesByPropertyRaw.set(entry.property, vals);
    }
    vals.add(entry.value);

    if (entry.breakpoint) breakpointSet.add(entry.breakpoint);

    if (entry.condition) {
      if (entry.condition.type === 'pseudo' && entry.condition.value) {
        pseudoSet.add(entry.condition.value);
      } else if (entry.condition.type === 'aria' && entry.condition.attribute) {
        ariaAttrSet.add(entry.condition.attribute);
        const attr = entry.condition.attribute;
        let attrVals = ariaAttrValuesRaw.get(attr);
        if (!attrVals) {
          attrVals = new Set();
          ariaAttrValuesRaw.set(attr, attrVals);
        }
        if (entry.condition.value) attrVals.add(entry.condition.value);
      }
    }
  }

  const valuesByProperty = new Map<string, string[]>();
  for (const [prop, vals] of valuesByPropertyRaw) {
    valuesByProperty.set(prop, [...vals].sort());
  }

  const ariaAttributeValues = new Map<string, string[]>();
  for (const [attr, vals] of ariaAttrValuesRaw) {
    ariaAttributeValues.set(attr, [...vals].sort());
  }

  return {
    entries,
    byClassName,
    byProperty,
    byCategory,
    properties: [...propertySet].sort(),
    categories: [...categorySet].sort(),
    pseudoConditions: [...pseudoSet].sort(),
    ariaAttributes: [...ariaAttrSet].sort(),
    ariaAttributeValues,
    breakpoints: ['sm', 'md', 'lg', 'xl', 'xxl'].filter((bp) => breakpointSet.has(bp)),
    valuesByProperty,
  };
}

export function loadManifestFromPath(manifestPath: string): ManifestEntry[] {
  const raw = readFileSync(manifestPath, 'utf8');
  return JSON.parse(raw) as ManifestEntry[];
}

export function watchManifest(
  manifestPath: string,
  onChange: (entries: ManifestEntry[]) => void,
): () => void {
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  let watcher: FSWatcher | undefined;

  try {
    watcher = fsWatch(manifestPath, () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        try {
          const entries = loadManifestFromPath(manifestPath);
          onChange(entries);
        } catch {
          // Ignore transient read errors during reload
        }
      }, 100);
    });
  } catch {
    // Watch failed (file not accessible); return no-op disposer
    return () => {};
  }

  return () => {
    clearTimeout(debounceTimer);
    watcher?.close();
  };
}

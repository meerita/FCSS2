// @file packages/language-service/src/conflict.ts
// @description Conflict detection — triple matching and shorthand overlap.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { ManifestEntry, ManifestIndex } from './manifest';

export interface ConflictResult {
  type: 'conflict' | 'shorthand-overlap';
  classA: string;
  classB: string;
  property: string;
  breakpoint?: string;
  condition?: string;
}

const SHORTHAND_GROUPS: Record<string, string[]> = {
  margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
  padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  'border-color': [
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
  ],
  'border-style': [
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
  ],
  'border-width': [
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
  ],
  'border-radius': [
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-left-radius',
    'border-bottom-right-radius',
  ],
  animation: [
    'animation-delay',
    'animation-direction',
    'animation-duration',
    'animation-fill-mode',
    'animation-iteration-count',
    'animation-play-state',
    'animation-timing-function',
  ],
  transition: [
    'transition-delay',
    'transition-duration',
    'transition-property',
    'transition-timing-function',
  ],
  font: ['font-family', 'font-size', 'font-style', 'font-variant', 'font-weight', 'font-stretch'],
};

function conditionKey(entry: ManifestEntry): string {
  if (!entry.condition) return '';
  if (entry.condition.type === 'pseudo') return `pseudo:${entry.condition.value ?? ''}`;
  return `aria:${entry.condition.attribute ?? ''}:${entry.condition.value ?? ''}`;
}

function tripleKey(entry: ManifestEntry): string {
  return `${entry.property}|${entry.breakpoint ?? ''}|${conditionKey(entry)}`;
}

export function detectConflicts(classNames: string[], index: ManifestIndex): ConflictResult[] {
  const results: ConflictResult[] = [];
  const tripleMap = new Map<string, { className: string; entry: ManifestEntry }>();
  const seenOverlapPairs = new Set<string>();

  const resolved: Array<{ className: string; entry: ManifestEntry }> = [];
  for (const cls of classNames) {
    const entry = index.byClassName.get(cls);
    if (entry) resolved.push({ className: cls, entry });
  }

  for (const { className, entry } of resolved) {
    const key = tripleKey(entry);
    const existing = tripleMap.get(key);

    if (existing) {
      if (existing.entry.value !== entry.value) {
        results.push({
          type: 'conflict',
          classA: existing.className,
          classB: className,
          property: entry.property,
          ...(entry.breakpoint !== undefined ? { breakpoint: entry.breakpoint } : {}),
          ...(conditionKey(entry) ? { condition: conditionKey(entry) } : {}),
        });
      }
    } else {
      tripleMap.set(key, { className, entry });
    }

    for (const [shorthand, longhands] of Object.entries(SHORTHAND_GROUPS)) {
      if (entry.property !== shorthand) continue;

      for (const { className: cls2, entry: entry2 } of resolved) {
        if (cls2 === className) continue;
        if (!longhands.includes(entry2.property)) continue;
        if ((entry.breakpoint ?? '') !== (entry2.breakpoint ?? '')) continue;
        if (conditionKey(entry) !== conditionKey(entry2)) continue;

        const pairKey = [className, cls2].sort().join('|');
        if (seenOverlapPairs.has(pairKey)) continue;
        seenOverlapPairs.add(pairKey);

        results.push({
          type: 'shorthand-overlap',
          classA: className,
          classB: cls2,
          property: shorthand,
          ...(entry.breakpoint !== undefined ? { breakpoint: entry.breakpoint } : {}),
        });
      }
    }
  }

  return results;
}

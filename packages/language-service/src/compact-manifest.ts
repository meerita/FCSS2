// @file packages/language-service/src/compact-manifest.ts
// @description CommonJS copy of the compact manifest expander from @functionalcss/spec.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

// This package compiles to CommonJS because VS Code launches the language server on
// Electron's Node, which cannot require() the ESM-only @functionalcss/spec. Keep this file in
// sync with packages/spec/src/manifest.ts — tests/compact-manifest.test.ts asserts both
// expanders produce identical output for the shipped catalog.

import type { ManifestCondition, ManifestEntry } from './manifest';

const COMPACT_MANIFEST_FORMAT = 'fcss-manifest-compact';

type CompactManifestValue = [string, string] | [string, string, 1];

interface CompactManifestProperty {
  property: string;
  category: string;
  source: string;
  pseudo: string[];
  aria: string[];
  responsive: boolean;
  values: CompactManifestValue[];
}

interface CompactManifest {
  format: typeof COMPACT_MANIFEST_FORMAT;
  version: 1;
  breakpoints: string[];
  ariaValues: Record<string, string[]>;
  properties: CompactManifestProperty[];
}

const META = /[:%.()/[\]{}+~>^$*|=#{@!,]/g;

function selectorFor(className: string, pseudo?: string, ariaAttr?: string, ariaValue?: string) {
  const escaped = className.replace(META, '\\$&');
  if (ariaAttr !== undefined && ariaValue !== undefined) {
    return `.${escaped}[${ariaAttr}='${ariaValue}']`;
  }
  if (pseudo !== undefined) return `.${escaped}:${pseudo}`;
  return `.${escaped}`;
}

function isCompactManifest(value: unknown): value is CompactManifest {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { format?: unknown }).format === COMPACT_MANIFEST_FORMAT
  );
}

function expandManifest(compact: CompactManifest): ManifestEntry[] {
  const entries: ManifestEntry[] = [];

  for (const prop of compact.properties) {
    const make = (
      className: string,
      selector: string,
      cssValue: string,
      deprecated: boolean,
      condition?: ManifestCondition,
      breakpoint?: string,
    ): ManifestEntry => ({
      className,
      selector,
      property: prop.property,
      value: cssValue,
      category: prop.category,
      source: prop.source,
      ...(condition !== undefined ? { condition } : {}),
      ...(breakpoint !== undefined ? { breakpoint } : {}),
      ...(deprecated ? { deprecated: true } : {}),
    });

    for (const [classValue, cssValue, deprecatedFlag] of prop.values) {
      const deprecated = deprecatedFlag === 1;
      const prefixes: Array<[string, string | undefined]> = [['', undefined]];
      if (prop.responsive) {
        for (const bp of compact.breakpoints) prefixes.push([`${bp}-`, bp]);
      }

      for (const [prefix, bp] of prefixes) {
        const base = `${prefix}${prop.property}--${classValue}`;
        entries.push(make(base, selectorFor(base), cssValue, deprecated, undefined, bp));

        for (const pseudo of prop.pseudo) {
          const cls = `${base}:${pseudo}`;
          entries.push(
            make(
              cls,
              selectorFor(cls, pseudo),
              cssValue,
              deprecated,
              { type: 'pseudo', value: pseudo },
              bp,
            ),
          );
        }

        for (const attr of prop.aria) {
          for (const ariaValue of compact.ariaValues[attr] ?? []) {
            const cls = `${base}:${attr}:${ariaValue}`;
            entries.push(
              make(
                cls,
                selectorFor(cls, undefined, attr, ariaValue),
                cssValue,
                deprecated,
                { type: 'aria', attribute: attr, value: ariaValue },
                bp,
              ),
            );
          }
        }
      }
    }
  }

  return entries;
}

/** Accepts the compact format (`@functionalcss/core`) or a flat entry array (`fcss build`). */
export function parseManifest(json: unknown): ManifestEntry[] {
  if (isCompactManifest(json)) return expandManifest(json);
  if (Array.isArray(json)) return json as ManifestEntry[];
  throw new Error('FCSS manifest must be a compact manifest object or an array of entries.');
}

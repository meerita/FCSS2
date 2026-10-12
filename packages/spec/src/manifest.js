// @file packages/spec/src/manifest.ts
// @description Manifest types, class-name/selector builders, and the compact manifest format with its expander.
// @layer domain
// @created Diego Lafuente <diego.lafuente@cognativinc.com>
// ── Class names and selectors ──
const META = /[:%.()/[\]{}+~>^$*|=#{@!,]/g;
export function escapeClassName(className) {
  return className.replace(META, '\\$&');
}
export function buildBaseClassName(property, classValue) {
  return `${property}--${classValue}`;
}
export function buildResponsiveClassName(breakpoint, property, classValue) {
  return `${breakpoint}-${property}--${classValue}`;
}
export function buildPseudoClassName(property, classValue, pseudo) {
  return `${property}--${classValue}:${pseudo}`;
}
export function buildAriaClassName(property, classValue, ariaAttr, ariaValue) {
  return `${property}--${classValue}:${ariaAttr}:${ariaValue}`;
}
export function buildResponsivePseudoClassName(breakpoint, property, classValue, pseudo) {
  return `${breakpoint}-${property}--${classValue}:${pseudo}`;
}
export function buildResponsiveAriaClassName(
  breakpoint,
  property,
  classValue,
  ariaAttr,
  ariaValue,
) {
  return `${breakpoint}-${property}--${classValue}:${ariaAttr}:${ariaValue}`;
}
export function buildSelector(className, pseudo, ariaAttr, ariaValue) {
  const escaped = escapeClassName(className);
  if (ariaAttr !== undefined && ariaValue !== undefined) {
    return `.${escaped}[${ariaAttr}='${ariaValue}']`;
  }
  if (pseudo !== undefined) {
    return `.${escaped}:${pseudo}`;
  }
  return `.${escaped}`;
}
// ── Compact manifest ──
//
// The expanded manifest lists every base × state × breakpoint combination (~326k entries,
// >100 MB of JSON). The compact form stores each property once with its values and the
// state/breakpoint axes it supports; expandManifest() rebuilds the identical entry list.
export const COMPACT_MANIFEST_FORMAT = 'fcss-manifest-compact';
export function isCompactManifest(value) {
  return typeof value === 'object' && value !== null && value.format === COMPACT_MANIFEST_FORMAT;
}
function entry(className, selector, prop, cssValue, deprecated, condition, breakpoint) {
  return {
    className,
    selector,
    property: prop.property,
    value: cssValue,
    category: prop.category,
    source: prop.source,
    ...(condition !== undefined ? { condition } : {}),
    ...(breakpoint !== undefined ? { breakpoint } : {}),
    ...(deprecated ? { deprecated: true } : {}),
  };
}
/** Expands a compact manifest into the full entry list, in generation order. */
export function expandManifest(compact) {
  const entries = [];
  for (const prop of compact.properties) {
    const p = prop.property;
    for (const [classValue, cssValue, deprecatedFlag] of prop.values) {
      const deprecated = deprecatedFlag === 1;
      const baseClass = buildBaseClassName(p, classValue);
      entries.push(entry(baseClass, buildSelector(baseClass), prop, cssValue, deprecated));
      for (const pseudo of prop.pseudo) {
        const cls = buildPseudoClassName(p, classValue, pseudo);
        entries.push(
          entry(cls, buildSelector(cls, pseudo), prop, cssValue, deprecated, {
            type: 'pseudo',
            value: pseudo,
          }),
        );
      }
      for (const attr of prop.aria) {
        for (const ariaValue of compact.ariaValues[attr] ?? []) {
          const cls = buildAriaClassName(p, classValue, attr, ariaValue);
          entries.push(
            entry(cls, buildSelector(cls, undefined, attr, ariaValue), prop, cssValue, deprecated, {
              type: 'aria',
              attribute: attr,
              value: ariaValue,
            }),
          );
        }
      }
      if (!prop.responsive) continue;
      for (const bp of compact.breakpoints) {
        const rCls = buildResponsiveClassName(bp, p, classValue);
        entries.push(entry(rCls, buildSelector(rCls), prop, cssValue, deprecated, undefined, bp));
        for (const pseudo of prop.pseudo) {
          const cls = buildResponsivePseudoClassName(bp, p, classValue, pseudo);
          entries.push(
            entry(
              cls,
              buildSelector(cls, pseudo),
              prop,
              cssValue,
              deprecated,
              { type: 'pseudo', value: pseudo },
              bp,
            ),
          );
        }
        for (const attr of prop.aria) {
          for (const ariaValue of compact.ariaValues[attr] ?? []) {
            const cls = buildResponsiveAriaClassName(bp, p, classValue, attr, ariaValue);
            entries.push(
              entry(
                cls,
                buildSelector(cls, undefined, attr, ariaValue),
                prop,
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
/**
 * Normalizes parsed manifest JSON to an entry list. Accepts the compact format
 * (`@functionalcss/core/manifest.json`) and the flat entry array (`fcss build` output).
 */
export function parseManifest(json) {
  if (isCompactManifest(json)) return expandManifest(json);
  if (Array.isArray(json)) return json;
  throw new Error('FCSS manifest must be a compact manifest object or an array of entries.');
}
//# sourceMappingURL=manifest.js.map

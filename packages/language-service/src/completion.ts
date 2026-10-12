// @file packages/language-service/src/completion.ts
// @description Manifest-driven completion engine for FCSS class names.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { ManifestEntry, ManifestIndex } from './manifest';

export const CompletionItemKind = {
  Module: 6,
  Property: 9,
  Value: 12,
  Enum: 13,
} as const;

export type CompletionItemKindValue = (typeof CompletionItemKind)[keyof typeof CompletionItemKind];

export interface CompletionItem {
  label: string;
  insertText: string;
  documentation: string;
  detail: string;
  kind: CompletionItemKindValue;
  sortText?: string;
}

const BREAKPOINTS = ['sm', 'md', 'lg', 'xl', 'xxl'] as const;

const BREAKPOINT_WIDTHS: Record<string, number> = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

function formatCss(entry: ManifestEntry): string {
  const decl = `${entry.property}: ${entry.value};`;
  if (entry.breakpoint) {
    const w = BREAKPOINT_WIDTHS[entry.breakpoint] ?? 0;
    return `\`\`\`css\n@media (min-width: ${w}px) {\n  ${decl}\n}\n\`\`\``;
  }
  if (entry.condition) {
    if (entry.condition.type === 'pseudo') {
      return `\`\`\`css\n:${entry.condition.value} {\n  ${decl}\n}\n\`\`\``;
    }
    return `\`\`\`css\n[${entry.condition.attribute}='${entry.condition.value}'] {\n  ${decl}\n}\n\`\`\``;
  }
  return `\`\`\`css\n${decl}\n\`\`\``;
}

function parseHead(head: string): { bp: string | undefined; property: string } {
  const m = /^(sm|md|lg|xl|xxl)-(.*)$/.exec(head);
  if (m) return { bp: m[1], property: m[2] ?? '' };
  return { bp: undefined, property: head };
}

function propertyCompletions(
  bpPrefix: string,
  partialProp: string,
  index: ManifestIndex,
): CompletionItem[] {
  const filtered = partialProp
    ? index.properties.filter((p) => p.startsWith(partialProp))
    : index.properties;

  return filtered.map((prop) => {
    const label = `${bpPrefix}${prop}--`;
    const sampleEntry = index.byProperty.get(prop)?.[0];
    const cat = sampleEntry?.category ?? prop;
    return {
      label,
      insertText: label,
      documentation: `**Property:** \`${prop}\`\n**Category:** ${cat}`,
      detail: cat,
      kind: CompletionItemKind.Property,
      sortText: `b_${prop}`,
    };
  });
}

function breakpointCompletions(index: ManifestIndex): CompletionItem[] {
  return index.breakpoints.map((bp) => {
    const w = BREAKPOINT_WIDTHS[bp] ?? 0;
    return {
      label: `${bp}-`,
      insertText: `${bp}-`,
      documentation: `**Breakpoint prefix:** \`${bp}\`\n\`@media (min-width: ${w}px)\``,
      detail: `min-width: ${w}px`,
      kind: CompletionItemKind.Module,
      sortText: `a_${bp}`,
    };
  });
}

function valueCompletions(
  bp: string | undefined,
  property: string,
  partialValue: string,
  index: ManifestIndex,
): CompletionItem[] {
  const bpPrefix = bp ? `${bp}-` : '';
  const allValues = index.valuesByProperty.get(property) ?? [];
  const filtered = partialValue ? allValues.filter((v) => v.startsWith(partialValue)) : allValues;

  return filtered.map((val) => {
    const className = `${bpPrefix}${property}--${val}`;
    const candidates = index.byProperty.get(property);
    const entry = candidates?.find((e) => e.value === val && !e.condition && e.breakpoint === bp);
    const doc = entry ? formatCss(entry) : `\`\`\`css\n${property}: ${val};\n\`\`\``;
    const cat = entry?.category ?? property;
    return {
      label: className,
      insertText: className,
      documentation: doc,
      detail: cat,
      kind: CompletionItemKind.Value,
      sortText: `c_${val}`,
    };
  });
}

function pseudoAndAriaCompletions(
  baseClass: string,
  partialCondition: string,
  index: ManifestIndex,
): CompletionItem[] {
  const items: CompletionItem[] = [];

  const { bp, property } = parseHead(baseClass.split('--')[0] ?? '');
  const val = baseClass.split('--')[1] ?? '';
  const bpPrefix = bp ? `${bp}-` : '';

  const pseudos = partialCondition
    ? index.pseudoConditions.filter((p) => p.startsWith(partialCondition))
    : index.pseudoConditions;

  for (const pseudo of pseudos) {
    const className = `${bpPrefix}${property}--${val}:${pseudo}`;
    const candidates = index.byProperty.get(property);
    const entry = candidates?.find(
      (e) =>
        e.value === val &&
        e.condition?.type === 'pseudo' &&
        e.condition.value === pseudo &&
        e.breakpoint === bp,
    );
    const doc = entry
      ? formatCss(entry)
      : `\`\`\`css\n:${pseudo} {\n  ${property}: ${val};\n}\n\`\`\``;
    items.push({
      label: className,
      insertText: className,
      documentation: doc,
      detail: `${entry?.category ?? property} (:${pseudo})`,
      kind: CompletionItemKind.Enum,
      sortText: `d_${pseudo}`,
    });
  }

  if (!partialCondition || 'aria-'.startsWith(partialCondition)) {
    items.push({
      label: `${baseClass}:aria-`,
      insertText: `${baseClass}:aria-`,
      documentation: 'ARIA state condition — continue typing an ARIA attribute name.',
      detail: 'ARIA condition',
      kind: CompletionItemKind.Module,
      sortText: `d_z_aria`,
    });
  }

  return items;
}

function ariaAttributeCompletions(
  baseClass: string,
  partialAttr: string,
  index: ManifestIndex,
): CompletionItem[] {
  const filtered = partialAttr
    ? index.ariaAttributes.filter((a) => a.slice(5).startsWith(partialAttr))
    : index.ariaAttributes;

  return filtered.map((attr) => {
    const vals = index.ariaAttributeValues.get(attr) ?? [];
    const firstVal = vals[0] ?? 'true';
    const label = `${baseClass}:${attr}:${firstVal}`;
    return {
      label,
      insertText: label,
      documentation: `**ARIA attribute:** \`${attr}\`\n\nAvailable values: ${vals.map((v) => `\`${v}\``).join(', ')}`,
      detail: `ARIA: ${attr}`,
      kind: CompletionItemKind.Enum,
      sortText: `e_${attr}`,
    };
  });
}

function ariaValueCompletions(
  baseClass: string,
  ariaAttr: string,
  partialVal: string,
  index: ManifestIndex,
): CompletionItem[] {
  const vals = index.ariaAttributeValues.get(ariaAttr) ?? ['true', 'false'];
  const filtered = partialVal ? vals.filter((v) => v.startsWith(partialVal)) : vals;

  const { bp, property } = parseHead(baseClass.split('--')[0] ?? '');
  const val = (baseClass.split('--')[1] ?? '').split(':')[0] ?? '';

  return filtered.map((ariaVal) => {
    const className = `${bp ? `${bp}-` : ''}${property}--${val}:${ariaAttr}:${ariaVal}`;
    const candidates = index.byProperty.get(property);
    const entry = candidates?.find(
      (e) =>
        e.value === val &&
        e.condition?.type === 'aria' &&
        e.condition.attribute === ariaAttr &&
        e.condition.value === ariaVal &&
        e.breakpoint === bp,
    );
    const doc = entry
      ? formatCss(entry)
      : `\`\`\`css\n[${ariaAttr}='${ariaVal}'] {\n  ${property}: ${val};\n}\n\`\`\``;
    return {
      label: className,
      insertText: className,
      documentation: doc,
      detail: `ARIA: ${ariaAttr}="${ariaVal}"`,
      kind: CompletionItemKind.Value,
      sortText: `f_${ariaVal}`,
    };
  });
}

export function getCompletions(partial: string, index: ManifestIndex): CompletionItem[] {
  if (!partial) {
    return [...breakpointCompletions(index), ...propertyCompletions('', '', index)];
  }

  const ddIdx = partial.indexOf('--');

  if (ddIdx === -1) {
    const m = /^(sm|md|lg|xl|xxl)-(.*)$/.exec(partial);
    if (m) {
      const bp = m[1]!;
      const partialProp = m[2] ?? '';
      return propertyCompletions(`${bp}-`, partialProp, index);
    }
    const isStartingBp = BREAKPOINTS.some((bp) => bp.startsWith(partial));
    const propItems = propertyCompletions('', partial, index);
    if (isStartingBp) {
      return [...breakpointCompletions(index), ...propItems];
    }
    return propItems;
  }

  const head = partial.slice(0, ddIdx);
  const tail = partial.slice(ddIdx + 2);
  const { bp, property } = parseHead(head);
  const colonIdx = tail.indexOf(':');

  if (colonIdx === -1) {
    return valueCompletions(bp, property, tail, index);
  }

  const value = tail.slice(0, colonIdx);
  const conditionPartial = tail.slice(colonIdx + 1);
  const baseClass = `${bp ? `${bp}-` : ''}${property}--${value}`;

  if (conditionPartial.startsWith('aria-')) {
    const secondColon = conditionPartial.indexOf(':', 5);
    if (secondColon === -1) {
      const partialAttrName = conditionPartial.slice(5);
      return ariaAttributeCompletions(baseClass, partialAttrName, index);
    }
    const ariaAttr = conditionPartial.slice(0, secondColon);
    const ariaValPartial = conditionPartial.slice(secondColon + 1);
    return ariaValueCompletions(baseClass, ariaAttr, ariaValPartial, index);
  }

  return pseudoAndAriaCompletions(baseClass, conditionPartial, index);
}

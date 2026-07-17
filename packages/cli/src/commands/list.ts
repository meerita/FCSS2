// @file packages/cli/src/commands/list.ts
// @description fcss list — lists available FCSS utility classes with optional filters.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { FCSS_PROPERTIES } from '@fcss/spec';
import { buildBaseClassName } from '@fcss/generator';

export interface ListOptions {
  property?: string;
  category?: string;
  state?: string;
  breakpoint?: string;
}

export interface ListEntry {
  className: string;
  property: string;
  value: string;
  category: string;
}

export function runList(options: ListOptions = {}): ListEntry[] {
  const entries: ListEntry[] = [];

  for (const prop of FCSS_PROPERTIES) {
    if (options.property && prop.property !== options.property) continue;
    if (options.category && prop.category !== options.category) continue;

    for (const val of prop.values) {
      if (val.deprecated) continue;
      const className = buildBaseClassName(prop.property, val.classValue);
      entries.push({
        className,
        property: prop.property,
        value: val.cssValue,
        category: prop.category,
      });
    }
  }

  return entries;
}

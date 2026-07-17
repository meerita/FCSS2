// @file packages/cli/src/commands/explain.ts
// @description fcss explain — shows full details for any valid FCSS class name.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { FCSS_PROPERTIES, FCSS_BREAKPOINTS } from '@fcss/spec';
import { buildSelector } from '@fcss/generator';

export interface ExplainResult {
  className: string;
  breakpoint?: string;
  property: string;
  value: string;
  condition?: { type: 'pseudo' | 'aria'; attribute?: string; value?: string };
  selector: string;
  declaration: string;
  mediaQuery?: string;
  category: string;
}

interface ParsedClass {
  breakpoint?: string;
  property: string;
  classValue: string;
  pseudo?: string;
  ariaAttr?: string;
  ariaValue?: string;
}

const BREAKPOINT_NAMES = new Set(FCSS_BREAKPOINTS.map((b) => b.name));
const BREAKPOINT_MAP = new Map(FCSS_BREAKPOINTS.map((b) => [b.name, b.minWidth]));

function parseClassName(className: string): ParsedClass | null {
  // Format: [breakpoint-]property--value[:pseudo | :ariaAttr:ariaValue]
  const parts = className.split(':');
  const base = parts[0];
  const condition1 = parts[1];
  const condition2 = parts[2];

  if (!base) return null;

  const dashDashIdx = base.indexOf('--');
  if (dashDashIdx === -1) return null;

  const prefix = base.slice(0, dashDashIdx);
  const classValue = base.slice(dashDashIdx + 2);

  const bpMatch = Array.from(BREAKPOINT_NAMES).find((bp) => prefix.startsWith(bp + '-'));
  const property = bpMatch ? prefix.slice(bpMatch.length + 1) : prefix;

  if (!property || !classValue) return null;

  const result: ParsedClass = { property, classValue };
  if (bpMatch) result.breakpoint = bpMatch;

  if (condition2 !== undefined) {
    if (condition1 !== undefined) result.ariaAttr = condition1;
    result.ariaValue = condition2;
  } else if (condition1 !== undefined) {
    result.pseudo = condition1;
  }

  return result;
}

export function runExplain(className: string): ExplainResult | null {
  const parsed = parseClassName(className);
  if (!parsed) return null;

  const propDef = FCSS_PROPERTIES.find((p) => p.property === parsed.property);
  if (!propDef) return null;

  const valDef = propDef.values.find((v) => v.classValue === parsed.classValue);
  if (!valDef) return null;

  const selector = buildSelector(className, parsed.pseudo, parsed.ariaAttr, parsed.ariaValue);
  const declaration = `${parsed.property}: ${valDef.cssValue}`;

  const result: ExplainResult = {
    className,
    property: parsed.property,
    value: valDef.cssValue,
    selector,
    declaration,
    category: propDef.category,
  };

  if (parsed.breakpoint) {
    result.breakpoint = parsed.breakpoint;
    const minWidth = BREAKPOINT_MAP.get(parsed.breakpoint);
    if (minWidth !== undefined) {
      result.mediaQuery = `@media (min-width: ${minWidth}px)`;
    }
  }

  if (parsed.ariaAttr && parsed.ariaValue) {
    result.condition = { type: 'aria', attribute: parsed.ariaAttr, value: parsed.ariaValue };
  } else if (parsed.pseudo) {
    result.condition = { type: 'pseudo', value: parsed.pseudo };
  }

  return result;
}

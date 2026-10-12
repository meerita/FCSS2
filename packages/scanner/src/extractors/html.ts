// @file packages/scanner/src/extractors/html.ts
// @description Extracts FCSS class names from HTML and HTM template files.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { splitClassString } from '../normalize.js';
import type { ExtractionResult } from './types.js';

// Matches class="..." or class='...' (handles multi-line attributes via [\s\S])
const CLASS_ATTR_RE = /class\s*=\s*(?:"([^"]*?)"|'([^']*?)')/gs;

export function extractFromHtml(source: string): ExtractionResult {
  const classes = new Set<string>();
  let match: RegExpExecArray | null;

  CLASS_ATTR_RE.lastIndex = 0;
  while ((match = CLASS_ATTR_RE.exec(source)) !== null) {
    const value = match[1] ?? match[2] ?? '';
    for (const cls of splitClassString(value)) {
      classes.add(cls);
    }
  }

  return { classes, warnings: [] };
}

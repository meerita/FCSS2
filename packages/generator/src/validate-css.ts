// @file packages/generator/src/validate-css.ts
// @description PostCSS-based CSS validation for generated FCSS output.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import postcss from 'postcss';

const FORBIDDEN_PATTERNS = [':has(', ':is(', ':where(', '@layer', '@container', 'oklch(', 'color-mix('];

export function validateCss(css: string, label = 'CSS'): void {
  // Check for forbidden modern patterns before parsing
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (css.includes(pattern)) {
      throw new Error(`[${label}] Forbidden CSS pattern detected: "${pattern}"`);
    }
  }

  let root: postcss.Root;
  try {
    root = postcss.parse(css);
  } catch (err) {
    throw new Error(`[${label}] CSS parse error: ${String(err)}`);
  }

  const seenSelectors = new Set<string>();

  root.walkRules((rule) => {
    const selector = rule.selector;

    // Duplicate selector check
    if (seenSelectors.has(selector)) {
      throw new Error(`[${label}] Duplicate selector: "${selector}"`);
    }
    seenSelectors.add(selector);

    // One declaration per rule
    const declarations = rule.nodes.filter((n): n is postcss.Declaration => n.type === 'decl');
    if (declarations.length !== 1) {
      throw new Error(
        `[${label}] Rule "${selector}" must have exactly 1 declaration, found ${declarations.length}`,
      );
    }

    // No !important
    for (const decl of declarations) {
      if (decl.important) {
        throw new Error(`[${label}] !important is forbidden in rule "${selector}"`);
      }
    }
  });
}

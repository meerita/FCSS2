// @file packages/scanner/src/safelist.ts
// @description Safelist support — exact class names and regex patterns retained regardless of usage.
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

export interface SafelistOptions {
  exact?: string[];
  patterns?: (string | RegExp)[];
}

export interface SafelistResult {
  safelistedClasses: Set<string>;
  warnings: string[];
}

const PATTERN_RETENTION_WARN_THRESHOLD = 50;

export function applySafelist(
  allFcssClasses: ReadonlySet<string>,
  options: SafelistOptions | undefined,
  knownClasses: ReadonlySet<string>,
): SafelistResult {
  const safelistedClasses = new Set<string>();
  const warnings: string[] = [];

  if (!options) return { safelistedClasses, warnings };

  for (const exact of options.exact ?? []) {
    if (!knownClasses.has(exact)) {
      throw new Error(
        `[@fcss/postcss] Exact safelist class "${exact}" is not in the manifest. ` +
          `Check the class name or remove it from the safelist.`,
      );
    }
    safelistedClasses.add(exact);
  }

  const patterns = (options.patterns ?? []).map((p) => (p instanceof RegExp ? p : new RegExp(p)));

  for (const pattern of patterns) {
    let count = 0;
    for (const cls of allFcssClasses) {
      if (pattern.test(cls)) {
        safelistedClasses.add(cls);
        count++;
      }
    }
    if (count > PATTERN_RETENTION_WARN_THRESHOLD) {
      warnings.push(
        `[@fcss/scanner] Safelist pattern /${pattern.source}/ retains ${count} utilities. ` +
          `Consider narrowing the pattern to avoid over-retention.`,
      );
    }
  }

  return { safelistedClasses, warnings };
}

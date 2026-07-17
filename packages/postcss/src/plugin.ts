// @file packages/postcss/src/plugin.ts
// @description PostCSS plugin that purges unused FCSS utilities via static analysis.
// @layer adapters
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import type { PluginCreator, Rule, Declaration, AtRule } from 'postcss';
import * as fs from 'node:fs';
import * as zlib from 'node:zlib';
import * as util from 'node:util';
import { scan } from '@fcss/scanner';
import type { ManifestEntry, SafelistOptions, ScanReport } from '@fcss/scanner';

const gzipAsync = util.promisify(zlib.gzip);

export interface FcssPostcssOptions {
  manifest: string;
  content: string[];
  cwd?: string;
  safelist?: SafelistOptions;
  report?: boolean | 'json';
  reportPath?: string;
}

export interface PurgeReport {
  totalSelectors: number;
  retainedSelectors: number;
  removedSelectors: number;
  sourceSizeBytes: number;
  finalSizeBytes: number;
  gzipBytes: number;
  scanReport: ScanReport;
}

function loadManifest(manifestPath: string): ManifestEntry[] {
  let raw: string;
  try {
    raw = fs.readFileSync(manifestPath, 'utf8');
  } catch (err) {
    throw new Error(
      `[@fcss/postcss] Cannot load manifest from "${manifestPath}": ${String(err)}. ` +
        `Run the @fcss/core build step first.`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`[@fcss/postcss] Invalid JSON in manifest "${manifestPath}": ${String(err)}.`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`[@fcss/postcss] Manifest "${manifestPath}" must be a JSON array.`);
  }

  return parsed as ManifestEntry[];
}

// Minifiers often strip quotes from attribute selectors: [attr='val'] → [attr=val].
// Store both forms so the lookup succeeds on minified CSS.
function normalizeAttrSelector(selector: string): string {
  return selector.replace(/\[([^\]=\s]+)='([^'\]]+)'\]/g, '[$1=$2]');
}

function buildSelectorMap(manifest: ManifestEntry[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const e of manifest) {
    map.set(e.selector, e.className);
    const normalized = normalizeAttrSelector(e.selector);
    if (normalized !== e.selector) {
      map.set(normalized, e.className);
    }
  }
  return map;
}

function collectAnimationNames(decl: Declaration): string[] {
  if (decl.prop !== 'animation' && decl.prop !== 'animation-name') return [];
  return decl.value
    .split(',')
    .map((s) => s.trim().split(/\s+/)[0] ?? '')
    .filter(Boolean);
}

function collectVarReferences(decl: Declaration): string[] {
  const refs: string[] = [];
  const varRe = /var\(\s*(--[^,)]+)/g;
  let m: RegExpExecArray | null;
  while ((m = varRe.exec(decl.value)) !== null) {
    refs.push((m[1] ?? '').trim());
  }
  return refs;
}

const fcssPostcss: PluginCreator<FcssPostcssOptions> = (options?: FcssPostcssOptions) => {
  if (!options) {
    throw new Error('[@fcss/postcss] Options are required.');
  }

  const { manifest: manifestPath, content, cwd, safelist, report } = options;

  return {
    postcssPlugin: 'fcss-postcss',

    async OnceExit(root) {
      if (!content || content.length === 0) {
        throw root.error(
          '[@fcss/postcss] No content paths configured. ' +
            'Provide the "content" option with glob patterns pointing to your source files.',
        );
      }

      const manifest = loadManifest(manifestPath);
      const selectorMap = buildSelectorMap(manifest);

      const scanOptions = {
        content,
        manifest,
        ...(cwd !== undefined ? { cwd } : {}),
        ...(safelist !== undefined ? { safelist } : {}),
      };
      const scanResult = await scan(scanOptions);
      const { usedClasses, report: scanReport } = scanResult;

      const sourceCss = root.toResult().css;
      const sourceSizeBytes = Buffer.byteLength(sourceCss, 'utf8');

      let totalSelectors = 0;
      let retainedSelectors = 0;
      let removedSelectors = 0;

      const usedAnimations = new Set<string>();

      const rulesToRemove: Rule[] = [];

      root.walkRules((rule) => {
        // rule.selectors splits comma-separated selectors into individual entries.
        // This handles cssnano mergeRules output like ".a:hover,.b:hover{...}".
        const individualSelectors = rule.selectors;
        const fcssInRule = individualSelectors.filter((sel) => selectorMap.has(sel));

        if (fcssInRule.length === 0) {
          return; // No FCSS selectors — leave untouched (base CSS, :root, etc.)
        }

        const nonFcssInRule = individualSelectors.filter((sel) => !selectorMap.has(sel));
        const usedFcss: string[] = [];

        for (const sel of fcssInRule) {
          totalSelectors++;
          const className = selectorMap.get(sel)!;
          if (usedClasses.has(className)) {
            usedFcss.push(sel);
            retainedSelectors++;
          } else {
            removedSelectors++;
          }
        }

        const keepSelectors = [...usedFcss, ...nonFcssInRule];

        if (keepSelectors.length === 0) {
          rulesToRemove.push(rule);
        } else if (keepSelectors.length < individualSelectors.length) {
          rule.selectors = keepSelectors;
        }

        if (keepSelectors.length > 0) {
          rule.walkDecls((decl) => {
            for (const name of collectAnimationNames(decl)) usedAnimations.add(name);
            void collectVarReferences(decl);
          });
        }
      });

      for (const rule of rulesToRemove) {
        rule.remove();
      }

      const atRulesToRemove: AtRule[] = [];
      root.walkAtRules('media', (atRule) => {
        const hasContent =
          atRule.nodes?.some((n) => n.type === 'rule' || n.type === 'atrule') ?? false;
        if (!hasContent) {
          atRulesToRemove.push(atRule);
        }
      });
      for (const atRule of atRulesToRemove) {
        atRule.remove();
      }

      const keyframesToRemove: AtRule[] = [];
      root.walkAtRules('keyframes', (atRule) => {
        const name = atRule.params;
        if (name && name.startsWith('fcss-') && !usedAnimations.has(name)) {
          keyframesToRemove.push(atRule);
        }
      });
      for (const atRule of keyframesToRemove) {
        atRule.remove();
      }

      if (report) {
        const finalCss = root.toResult().css;
        const finalSizeBytes = Buffer.byteLength(finalCss, 'utf8');
        const gzipBuffer = await gzipAsync(Buffer.from(finalCss, 'utf8'));
        const gzipBytes = gzipBuffer.length;

        const purgeReport: PurgeReport = {
          totalSelectors,
          retainedSelectors,
          removedSelectors,
          sourceSizeBytes,
          finalSizeBytes,
          gzipBytes,
          scanReport,
        };

        if (report === 'json' && options.reportPath) {
          fs.writeFileSync(options.reportPath, JSON.stringify(purgeReport, null, 2) + '\n', 'utf8');
        } else {
          const reductionPct =
            sourceSizeBytes > 0
              ? (((sourceSizeBytes - finalSizeBytes) / sourceSizeBytes) * 100).toFixed(1)
              : '0';
          console.log(
            `[@fcss/postcss] Purge: ${retainedSelectors}/${totalSelectors} selectors retained ` +
              `(${removedSelectors} removed, ${reductionPct}% reduction, ` +
              `${(finalSizeBytes / 1024).toFixed(1)} KB → ${(gzipBytes / 1024).toFixed(1)} KB gz).`,
          );
        }
      }
    },
  };
};

fcssPostcss.postcss = true;

export default fcssPostcss;

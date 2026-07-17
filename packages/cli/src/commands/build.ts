// @file packages/cli/src/commands/build.ts
// @description fcss build — generates custom CSS from config (colors, data-states, breakpoints).
// @layer tools
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import * as fs from 'node:fs';
import * as path from 'node:path';
import { GENERATED_FILE_HEADER } from '@fcss/generator';
import type { FcssConfig, FcssDataState } from '../config/schema.js';

const OUTPUT_DIR = '.fcss';

function generateColorTokenCss(colors: Record<string, string>): string {
  const vars = Object.entries(colors)
    .map(([name, value]) => `  --fcss-color-${name}: ${value};`)
    .join('\n');
  return `:root {\n${vars}\n}\n`;
}

function generateCustomColorClasses(colors: Record<string, string>): string {
  const colorProperties = [
    'color',
    'background-color',
    'border-color',
    'outline-color',
    'text-decoration-color',
    'caret-color',
    'column-rule-color',
  ];
  const lines: string[] = [GENERATED_FILE_HEADER];
  for (const [name] of Object.entries(colors)) {
    for (const prop of colorProperties) {
      const className = `${prop}--${name}`;
      const escaped = className.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);
      lines.push(`.${escaped} { ${prop}: var(--fcss-color-${name}); }`);
    }
  }
  return lines.join('\n') + '\n';
}

function generateDataStateCss(states: FcssDataState[]): string {
  const lines: string[] = [GENERATED_FILE_HEADER];
  for (const state of states) {
    for (const prop of state.properties) {
      // Data-state utilities use attribute selectors; values come from custom CSS properties
      lines.push(
        `[${state.attribute}="${state.value}"] .${prop}--\\:${state.attribute}\\:${state.value} { ${prop}: inherit; }`,
      );
    }
  }
  return lines.join('\n') + '\n';
}

function generateCustomBreakpointCss(breakpoints: Record<string, { minWidth: number }>): string {
  // Custom breakpoints cannot use CSS custom properties — media query values must be static literals
  const lines: string[] = [GENERATED_FILE_HEADER];
  for (const [name, bp] of Object.entries(breakpoints)) {
    lines.push(`@media (min-width: ${bp.minWidth}px) {`);
    lines.push(`  /* ${name} breakpoint — add utility overrides here */`);
    lines.push(`}`);
  }
  return lines.join('\n') + '\n';
}

export async function runBuild(config: FcssConfig, cwd = process.cwd()): Promise<void> {
  const outDir = path.resolve(cwd, OUTPUT_DIR);
  fs.mkdirSync(outDir, { recursive: true });

  const parts: string[] = [];

  if (config.colors && Object.keys(config.colors).length > 0) {
    parts.push(generateColorTokenCss(config.colors));
    parts.push(generateCustomColorClasses(config.colors));
  }

  if (config.dataStates && config.dataStates.length > 0) {
    parts.push(generateDataStateCss(config.dataStates));
  }

  if (config.breakpoints && Object.keys(config.breakpoints).length > 0) {
    parts.push(generateCustomBreakpointCss(config.breakpoints));
  }

  const generatedCss = parts.join('\n');
  const cssPath = path.join(outDir, 'generated.css');
  fs.writeFileSync(cssPath, generatedCss, 'utf8');

  const manifestEntries: Array<{ className: string; selector: string; source: string }> = [];

  if (config.colors) {
    const colorProperties = [
      'color',
      'background-color',
      'border-color',
      'outline-color',
      'text-decoration-color',
      'caret-color',
      'column-rule-color',
    ];
    for (const [name] of Object.entries(config.colors)) {
      for (const prop of colorProperties) {
        const className = `${prop}--${name}`;
        const escaped = className.replace(/[^a-zA-Z0-9_-]/g, (c) => `\\${c}`);
        manifestEntries.push({ className, selector: `.${escaped}`, source: 'custom-colors' });
      }
    }
  }

  const manifestPath = path.join(outDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifestEntries, null, 2) + '\n', 'utf8');

  console.log(`[fcss] Build complete → ${cssPath}`);
  console.log(`[fcss] Manifest → ${manifestPath} (${manifestEntries.length} entries)`);
}

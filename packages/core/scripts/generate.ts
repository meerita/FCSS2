// @file packages/core/scripts/generate.ts
// @description Build script that generates all FCSS core distribution files from the spec.
// @layer scripts
// @created Diego Lafuente <diego.lafuente@cognativinc.com>

import { generate, buildBundles, buildStatistics, GENERATED_FILE_HEADER } from '@fcss/generator';
import { FCSS_COLOR_VALUES } from '@fcss/spec';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// dist/scripts/generate.js → go up one level to reach dist/
const distDir = path.resolve(__dirname, '..');

function writeDistFile(name: string, content: string): void {
  const filePath = path.join(distDir, name);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  const size = Buffer.byteLength(content, 'utf8');
  console.log(`  ${name} (${(size / 1024).toFixed(1)} KB)`);
}

const COLOR_HEX: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  blue: '#0d6efd',
  green: '#198754',
  yellow: '#ffc107',
  orange: '#fd7e14',
  red: '#dc3545',
  pink: '#d63384',
  purple: '#6f42c1',
  gray: '#6c757d',
  'light-gray': '#adb5bd',
  'lighter-gray': '#ced4da',
  'lightest-gray': '#f8f9fa',
  'dark-gray': '#495057',
  'darkest-gray': '#212529',
};

function buildRootCss(): string {
  const lines: string[] = [GENERATED_FILE_HEADER, ':root {'];

  for (const v of FCSS_COLOR_VALUES) {
    if (v.classValue === 'transparent' || v.classValue === 'currentColor') continue;
    const hex = COLOR_HEX[v.classValue] ?? '#000000';
    lines.push(`  --fcss-color-${v.classValue}: ${hex};`);
  }

  const withAliases = FCSS_COLOR_VALUES.filter(
    (v) => v.legacyAliases !== undefined && v.legacyAliases.length > 0,
  );

  if (withAliases.length > 0) {
    lines.push('');
    lines.push('  /* @deprecated — use --fcss-color-* custom properties instead */');
    for (const v of withAliases) {
      lines.push(`  --${v.classValue}: var(--fcss-color-${v.classValue});`);
    }
  }

  lines.push('}', '');
  return lines.join('\n');
}

const RESET_CSS = `${GENERATED_FILE_HEADER}
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }
body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
`;

async function main(): Promise<void> {
  console.log('Generating @fcss/core distribution…\n');
  fs.mkdirSync(distDir, { recursive: true });

  const result = generate();
  const bundles = buildBundles(result);
  const stats = await buildStatistics(result, bundles);

  const rootCss = buildRootCss();

  const statesCss = bundles['states/pseudo.css'] + bundles['states/aria.css'];
  const breakpointsCss = [
    bundles['responsive/sm.css'],
    bundles['responsive/md.css'],
    bundles['responsive/lg.css'],
    bundles['responsive/xl.css'],
    bundles['responsive/xxl.css'],
  ].join('');
  const fullCss = [RESET_CSS, rootCss, bundles['utilities.css'], statesCss, breakpointsCss].join(
    '',
  );

  const distFiles: Record<string, string> = {
    'reset.css': RESET_CSS,
    'root.css': rootCss,
    'utilities.css': bundles['utilities.css'],
    'states.css': statesCss,
    'states/pseudo.css': bundles['states/pseudo.css'],
    'states/aria.css': bundles['states/aria.css'],
    'breakpoints.css': breakpointsCss,
    'breakpoints/sm.css': bundles['responsive/sm.css'],
    'breakpoints/md.css': bundles['responsive/md.css'],
    'breakpoints/lg.css': bundles['responsive/lg.css'],
    'breakpoints/xl.css': bundles['responsive/xl.css'],
    'breakpoints/xxl.css': bundles['responsive/xxl.css'],
    'full.css': fullCss,
  };

  for (const [name, content] of Object.entries(distFiles)) {
    writeDistFile(name, content);
  }

  writeDistFile('manifest.json', JSON.stringify(result.manifest, null, 2) + '\n');
  writeDistFile('statistics.json', JSON.stringify(stats, null, 2) + '\n');

  console.log(`\nTotal utilities:   ${stats.utilities.toLocaleString()}`);
  console.log(`Base:              ${stats.baseUtilities.toLocaleString()}`);
  console.log(`Pseudo variants:   ${stats.pseudoUtilities.toLocaleString()}`);
  console.log(`ARIA variants:     ${stats.ariaUtilities.toLocaleString()}`);
  console.log(`Responsive:        ${stats.responsiveUtilities.toLocaleString()}`);
  console.log(`Raw CSS:           ${(stats.rawBytes / 1024).toFixed(1)} KB`);
  console.log(`Minified:          ${(stats.minifiedBytes / 1024).toFixed(1)} KB`);
  console.log(`Gzipped:           ${(stats.gzipBytes / 1024).toFixed(1)} KB`);
}

main().catch((err: unknown) => {
  console.error('Generate failed:', err);
  process.exit(1);
});

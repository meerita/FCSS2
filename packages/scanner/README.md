<!--
@file packages/scanner/README.md
@description @functionalcss/scanner package documentation — programmatic class usage scanning.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @functionalcss/scanner

Finds FCSS class usages in HTML, JSX/TSX, Angular templates and Astro files. Used by the
PostCSS, Vite, Next.js and Astro integrations; you only need it directly to build your own tooling.

## Installation

```bash
npm install -D @functionalcss/scanner
```

## Usage

```ts
import { readFileSync } from 'node:fs';
import { scan } from '@functionalcss/scanner';
import { parseManifest } from '@functionalcss/spec';

// core ships a compact manifest; parseManifest() expands it to one entry per class.
const manifest = parseManifest(
  JSON.parse(readFileSync('node_modules/@functionalcss/core/dist/manifest.json', 'utf8')),
);

const { usedClasses, report } = await scan({
  content: ['src/**/*.{html,tsx}'],
  manifest,
  safelist: { exact: ['display--none'] },
});
```

## License

MIT

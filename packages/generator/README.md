<!--
@file packages/generator/README.md
@description @functionalcss/generator package documentation — CSS generation API.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @functionalcss/generator

Builds the FCSS CSS bundles and manifest from `@functionalcss/spec`. This is what produces
`@functionalcss/core`; use it directly only to generate a custom build programmatically.

## Installation

```bash
npm install -D @functionalcss/generator
```

## Usage

```ts
import { generate, buildBundles } from '@functionalcss/generator';

const bundles = buildBundles(generate());
const css = bundles['full.css'];
```

See `src/index.ts` for the full list of exports.

## License

MIT

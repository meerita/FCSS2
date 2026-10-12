<!--
@file packages/postcss/README.md
@description @functionalcss/postcss package documentation — PostCSS purge plugin options.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @functionalcss/postcss

PostCSS plugin that removes unused FCSS utilities by statically scanning your source files.

## Installation

```bash
npm install -D @functionalcss/postcss
```

## Usage

```js
// postcss.config.mjs
import { createRequire } from 'node:module';
import fcss from '@functionalcss/postcss';

const require = createRequire(import.meta.url);

export default {
  plugins: [
    fcss({
      manifest: require.resolve('@functionalcss/core/manifest.json'),
      content: ['src/**/*.{html,ts,tsx}'],
    }),
  ],
};
```

## Options

| Option       | Type                                                    | Description                                 |
| ------------ | ------------------------------------------------------- | ------------------------------------------- |
| `manifest`   | `string` (required)                                     | Path to `@functionalcss/core/manifest.json` |
| `content`    | `string[]` (required)                                   | Globs of files to scan for class names      |
| `cwd`        | `string`                                                | Base directory for `content` globs          |
| `safelist`   | `{ exact?: string[]; patterns?: (string \| RegExp)[] }` | Classes always kept                         |
| `report`     | `boolean \| 'json'`                                     | Print a purge report                        |
| `reportPath` | `string`                                                | Where to write the JSON report              |

Using Vite, Next.js or Astro? Use `@functionalcss/vite`, `@functionalcss/next` or
`@functionalcss/astro` instead — they wire this up for you.

## License

MIT

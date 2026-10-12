# Installation

Every setup has the same two parts:

1. `@functionalcss/core`, the CSS. Import `full.css` and every class works.
2. A purge step for production. The full set is about 28 MB, and the purge keeps only the
   classes your source files use.

The framework packages below handle step 2 for you. Pick yours and skip the rest.

You need Node.js 20.19 or newer, or Bun. We test on Node.js 24 and Bun 1.4.

## Package managers

The examples show npm and bun. pnpm and yarn work the same way:

| Task               | npm                    | pnpm                | yarn                | bun                |
| ------------------ | ---------------------- | ------------------- | ------------------- | ------------------ |
| Add a dependency   | `npm install <pkg>`    | `pnpm add <pkg>`    | `yarn add <pkg>`    | `bun add <pkg>`    |
| Add a dev tool     | `npm install -D <pkg>` | `pnpm add -D <pkg>` | `yarn add -D <pkg>` | `bun add -d <pkg>` |
| Run the CLI        | `npx fcss <cmd>`       | `pnpm exec fcss`    | `yarn fcss`         | `bunx fcss <cmd>`  |
| Run a build script | `npm run build`        | `pnpm build`        | `yarn build`        | `bun run build`    |

## Vite

Works with any Vite app: React, Preact, Solid or plain TypeScript.

```bash
npm install @functionalcss/core && npm install -D @functionalcss/vite   # npm
bun add @functionalcss/core && bun add -d @functionalcss/vite           # bun
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fcss } from '@functionalcss/vite';

export default defineConfig({
  plugins: [react(), fcss()],
});
```

```tsx
// src/main.tsx
import '@functionalcss/core/full.css';
```

By default the plugin scans `src/**/*.{html,js,jsx,ts,tsx}`. If your markup lives elsewhere,
such as `index.html` at the project root, pass the globs:

```ts
fcss({ config: { content: ['index.html', 'src/**/*.{ts,tsx}'] } });
```

Supports Vite 5 to 8. More in the [React guide](./guides/react.md).

## Next.js

```bash
npm install @functionalcss/core @functionalcss/next   # npm
bun add @functionalcss/core @functionalcss/next       # bun
```

```ts
// next.config.ts
import { withFcss } from '@functionalcss/next';

export default withFcss({
  // your existing Next.js config
});
```

```tsx
// app/layout.tsx, or pages/_app.tsx with the Pages Router
import '@functionalcss/core/full.css';
```

On Next.js 16, change your build script:

```json
{
  "scripts": {
    "build": "next build --webpack"
  }
}
```

Next.js 16 builds with Turbopack by default, and the purge hooks into webpack. Without the flag
the build stops with an error telling you to add it, rather than quietly shipping 28 MB of CSS.
`next dev` needs no flag. Next.js 14 and 15 need no changes.

The plugin scans `app/`, `pages/`, `components/` and `src/` unless `fcss.config.ts` says
otherwise. See the [Next.js guide](./guides/nextjs.md).

## Astro

```bash
npm install @functionalcss/core @functionalcss/astro   # npm
bun add @functionalcss/core @functionalcss/astro       # bun
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import fcss from '@functionalcss/astro';

export default defineConfig({
  integrations: [fcss()],
});
```

```astro
---
// src/layouts/Layout.astro
import '@functionalcss/core/full.css';
---
```

The integration registers the Vite plugin inside Astro's build. It scans `class="..."` and
static `class:list` entries in `.astro` files, for both static and server output. See the
[Astro guide](./guides/astro.md).

## Angular

```bash
ng add @functionalcss/angular        # npm
bunx ng add @functionalcss/angular   # bun
```

The schematic installs the packages, adds the stylesheet to `angular.json` and changes your
`build` script so the purge runs first. After that:

```bash
ng serve         # development, every class available
npm run build    # production: purge, then ng build
bun run build    # same, with bun
```

Build through the script. Plain `ng build` skips the purge. Supports Angular 17 to 22; the
[Angular guide](./guides/angular.md) explains how it's wired.

## Other bundlers (PostCSS)

If your bundler runs PostCSS, use the plugin directly:

```bash
npm install @functionalcss/core && npm install -D @functionalcss/postcss   # npm
bun add @functionalcss/core && bun add -d @functionalcss/postcss           # bun
```

```js
// postcss.config.mjs
import { createRequire } from 'node:module';
import fcss from '@functionalcss/postcss';

const require = createRequire(import.meta.url);

export default {
  plugins: [
    // purges on every run, so keep the full set in development
    process.env.NODE_ENV === 'production' &&
      fcss({
        manifest: require.resolve('@functionalcss/core/manifest.json'),
        content: ['src/**/*.{html,js,jsx,ts,tsx}'],
      }),
  ].filter(Boolean),
};
```

Import `@functionalcss/core/full.css` from your entry point. Your bundler has to run PostCSS on
CSS that comes from `node_modules`. The Vite, Next.js and Astro integrations use this plugin
underneath; we haven't tested webpack, Parcel or Rsbuild on their own yet. Options are in the
[package README](../packages/postcss/README.md).

## Plain HTML

No bundler? Link the full stylesheet from a CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/@functionalcss/core/dist/full.css" />
```

Fine for a prototype. For anything real, generate a purged file. Install the packages:

```bash
npm install @functionalcss/core && npm install -D @functionalcss/postcss postcss   # npm
bun add @functionalcss/core && bun add -d @functionalcss/postcss postcss           # bun
```

Add this script next to your HTML:

```js
// purge.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import postcss from 'postcss';
import fcss from '@functionalcss/postcss';

const require = createRequire(import.meta.url);
const input = require.resolve('@functionalcss/core/full.css');

const result = await postcss([
  fcss({
    manifest: require.resolve('@functionalcss/core/manifest.json'),
    content: ['**/*.html', '!node_modules/**'],
  }),
]).process(readFileSync(input, 'utf8'), { from: input, to: 'fcss.css' });

writeFileSync('fcss.css', result.css);
```

Run it with `node purge.mjs` or `bun purge.mjs` whenever your HTML changes, and link the result:

```html
<link rel="stylesheet" href="fcss.css" />
```

## Importing parts instead of `full.css`

You can import the files separately, for example to skip breakpoints you don't use. Order
matters; [Responsive design](./responsive.md#order-matters) explains it.

```js
import '@functionalcss/core/reset.css';
import '@functionalcss/core/root.css';
import '@functionalcss/core/utilities.css';
import '@functionalcss/core/states/pseudo.css';
import '@functionalcss/core/states/aria.css';
import '@functionalcss/core/breakpoints/sm.css';
import '@functionalcss/core/breakpoints/md.css';
import '@functionalcss/core/breakpoints/lg.css';
import '@functionalcss/core/breakpoints/xl.css';
import '@functionalcss/core/breakpoints/xxl.css';
```

## CLI

```bash
npm install -D @functionalcss/cli   # npm
bun add -d @functionalcss/cli       # bun
```

Run commands with `npx fcss <cmd>` or `bunx fcss <cmd>`.

| Command                               | What it does                                                   |
| ------------------------------------- | -------------------------------------------------------------- |
| `fcss init [-f <framework>]`          | Creates `fcss.config.ts` and adds the CSS import               |
| `fcss explain <class>`                | Prints the CSS a class produces                                |
| `fcss list`                           | Lists classes; filter with `-p`, `-c`, `-s` or `-b`            |
| `fcss audit`                          | Reports unknown or invalid classes in your source              |
| `fcss doctor`                         | Checks that the packages and manifest are where they belong    |
| `fcss build`                          | Generates CSS for custom colors and data states in your config |
| `fcss purge -i <in.css> -o <out.css>` | Purges the CSS that `fcss build` generated                     |
| `fcss migrate`                        | Helps move off the legacy TFCSSF class names                   |

`fcss purge` reads the manifest that `fcss build` writes, which only knows your custom classes.
It won't shrink `@functionalcss/core`. For that, use a framework integration or the
[plain HTML](#plain-html) script.

### `fcss.config.ts`

The integrations and the CLI read this file when it exists:

```ts
import { defineConfig } from '@functionalcss/cli';

export default defineConfig({
  content: ['src/**/*.{html,ts,tsx,jsx}'],
  safelist: ['display--flex', 'display--none'],
});
```

`content` is where to look for class names. `safelist` is for classes the scanner can't see,
like names you assemble at runtime.

## Editors

The VS Code and Zed extensions, and the LSP server behind them, are in this repo but not on npm
yet. The [Zed guide](./guides/zed.md) explains how to load the extension from source.

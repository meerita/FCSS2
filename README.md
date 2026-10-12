<!--
@file README.md
@description FCSS project readme: what it is, how to install it on each platform, and how to use it.
@layer root
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

<div align="center">

# FCSS

**Utility CSS that reads like CSS.**

[![npm version](https://img.shields.io/npm/v/@functionalcss/core?label=npm&color=cb3837)](https://www.npmjs.com/package/@functionalcss/core)
[![npm downloads](https://img.shields.io/npm/dm/@functionalcss/core?color=cb3837)](https://www.npmjs.com/package/@functionalcss/core)
[![CI](https://github.com/meerita/FCSS2/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/meerita/FCSS2/actions/workflows/ci.yml)
[![provenance](https://img.shields.io/badge/npm-provenance-2ea44f)](https://www.npmjs.com/package/@functionalcss/core#provenance)
[![license](https://img.shields.io/npm/l/@functionalcss/core)](LICENSE)

[![Vite](https://img.shields.io/badge/Vite-5--8-646cff?logo=vite&logoColor=white)](#vite-react-preact-solid-vanilla-js)
[![Next.js](https://img.shields.io/badge/Next.js-14--16-000000?logo=nextdotjs&logoColor=white)](#nextjs)
[![Astro](https://img.shields.io/badge/Astro-7-bc52ee?logo=astro&logoColor=white)](#astro)
[![Angular](https://img.shields.io/badge/Angular-17--22-dd0031?logo=angular&logoColor=white)](#angular)
[![Bun](https://img.shields.io/badge/Bun-supported-f9f1e1?logo=bun&logoColor=black)](#package-manager-equivalents)

[Install](#installation) · [Usage](#usage) · [Docs](docs/README.md) · [npm](https://www.npmjs.com/org/functionalcss)

</div>

FCSS is a utility CSS library where every class name is a CSS property and a value. If you know
CSS, you already know FCSS. It works with any framework, or none.

```html
<div class="display--flex align-items--center gap--16 padding--24">
  <p class="color--blue font-size--16 font-weight--bold">Hello, FCSS</p>
</div>
```

One class is one declaration: `padding--24` is `padding: 24px` and nothing else. Names are the
real CSS names, so it's `background-color--blue`, not `bg-blue`, and there is no cheat sheet to
keep open. Hover, ARIA and breakpoint variants are part of the name (`color--red:hover`,
`display--block:aria-expanded:true`, `md-display--none`). There is no runtime: the browser gets
plain CSS, and your build removes the classes you don't use.

## Contents

- [Requirements](#requirements)
- [Installation](#installation): [Vite](#vite-react-preact-solid-vanilla-js) · [Next.js](#nextjs) · [Astro](#astro) · [Angular](#angular) · [Other bundlers (PostCSS)](#other-bundlers-postcss) · [Plain HTML / CDN](#plain-html--cdn)
- [Usage](#usage)
- [CLI](#cli)
- [Packages](#packages)
- [Documentation](#documentation)

## Requirements

| You need                                                  | Notes                                                                                          |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Node.js 20.19+** or **Bun**                             | Tested on Node.js 24 and Bun 1.4. Your framework may require a newer Node.js.                  |
| A package manager: **npm**, **pnpm**, **yarn** or **bun** | All four work. Examples show npm and bun; see the [equivalents](#package-manager-equivalents). |
| A bundler or build step (recommended)                     | To purge unused classes. Without one you can still use the [CDN](#plain-html--cdn).            |

Supported frameworks: **Vite 5 – 8**, **Next.js 14 – 16**, **Astro 7**, **Angular 17 – 22**.

FCSS finds the classes you use by scanning **HTML, JS/TS, JSX/TSX, Angular templates and
`.astro` files**. Vue (`.vue`) and Svelte (`.svelte`) files are not scanned yet, so a class
used only there gets purged. Support is on the list.

### Package manager equivalents

| npm                    | pnpm                | yarn                | bun                |
| ---------------------- | ------------------- | ------------------- | ------------------ |
| `npm install <pkg>`    | `pnpm add <pkg>`    | `yarn add <pkg>`    | `bun add <pkg>`    |
| `npm install -D <pkg>` | `pnpm add -D <pkg>` | `yarn add -D <pkg>` | `bun add -d <pkg>` |
| `npx fcss <command>`   | `pnpm exec fcss …`  | `yarn fcss …`       | `bunx fcss …`      |
| `npm run build`        | `pnpm build`        | `yarn build`        | `bun run build`    |

## Installation

Every setup has two parts. `@functionalcss/core` is the CSS itself: every class in every state
and breakpoint, about 28 MB. Then a purge step, usually a framework integration, cuts that down
to the classes your source actually uses, which is typically a few KB. You want both. Nobody
should ship 28 MB of CSS, however good the gzip ratio looks.

| Platform                                   | Install                                                                     |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| Vite (React, Preact, Solid, vanilla JS/TS) | `npm install @functionalcss/core` + `npm install -D @functionalcss/vite`    |
| Next.js                                    | `npm install @functionalcss/core @functionalcss/next`                       |
| Astro                                      | `npm install @functionalcss/core @functionalcss/astro`                      |
| Angular                                    | `ng add @functionalcss/angular`                                             |
| Other bundlers (PostCSS)                   | `npm install @functionalcss/core` + `npm install -D @functionalcss/postcss` |
| Plain HTML / CDN                           | Nothing for a `<link>` tag; `@functionalcss/cli` to purge                   |

### Vite (React, Preact, Solid, vanilla JS)

```bash
npm install @functionalcss/core
npm install -D @functionalcss/vite

# or with bun
bun add @functionalcss/core
bun add -d @functionalcss/vite
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { fcss } from '@functionalcss/vite';

export default defineConfig({
  plugins: [fcss()],
});
```

```ts
// src/main.ts (your entry point)
import '@functionalcss/core/full.css';
```

`vite dev` serves every class; `vite build` purges to what `src/**/*.{html,js,jsx,ts,tsx}` uses.
Scan other paths with `fcss({ config: { content: ['index.html', 'src/**/*.tsx'] } })` or an
[`fcss.config.ts`](#configuration). Guide: [React](docs/guides/react.md) ·
[package README](packages/vite/README.md).

### Next.js

```bash
npm install @functionalcss/core @functionalcss/next
# or
bun add @functionalcss/core @functionalcss/next
```

```ts
// next.config.ts
import { withFcss } from '@functionalcss/next';

export default withFcss({
  // your Next.js config
});
```

```tsx
// app/layout.tsx (App Router), or pages/_app.tsx (Pages Router)
import '@functionalcss/core/full.css';
```

> **Next.js 16** builds with Turbopack by default; FCSS purges through webpack. Use
> `"build": "next build --webpack"` in `package.json`. `next dev` needs no flag. Next.js 14 and 15
> need no changes.

Guide: [Next.js](docs/guides/nextjs.md) · [package README](packages/next/README.md).

### Astro

```bash
npm install @functionalcss/core @functionalcss/astro
# or
bun add @functionalcss/core @functionalcss/astro
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

Works for static and server output; `class="…"` and static `class:list` entries are scanned.
Guide: [Astro](docs/guides/astro.md) · [package README](packages/astro/README.md).

### Angular

```bash
ng add @functionalcss/angular
# in a bun workspace
bunx ng add @functionalcss/angular
```

The schematic installs the packages, adds the stylesheet to `angular.json`, and wires a purge
step into your `build` script. Then:

```bash
ng serve        # development, every class available
npm run build   # production: purge first, then ng build (or: bun run build)
```

Always build through `npm run build`; `ng build` on its own skips the purge.
Guide: [Angular](docs/guides/angular.md) · [package README](packages/angular/README.md).

### Other bundlers (PostCSS)

```bash
npm install @functionalcss/core
npm install -D @functionalcss/postcss

# or with bun
bun add @functionalcss/core
bun add -d @functionalcss/postcss
```

```js
// postcss.config.mjs
import { createRequire } from 'node:module';
import fcss from '@functionalcss/postcss';

const require = createRequire(import.meta.url);

export default {
  plugins: [
    // The plugin purges on every run; this keeps the full set in development.
    process.env.NODE_ENV === 'production' &&
      fcss({
        manifest: require.resolve('@functionalcss/core/manifest.json'),
        content: ['src/**/*.{html,js,jsx,ts,tsx}'],
      }),
  ].filter(Boolean),
};
```

Import `@functionalcss/core/full.css` from your entry point, and make sure your bundler runs
PostCSS on CSS imported from `node_modules`. This path is used under the hood by the Vite, Next.js
and Astro integrations; other bundlers have not been tested yet. Options:
[package README](packages/postcss/README.md).

### Plain HTML / CDN

No build step? Link the full stylesheet:

```html
<link rel="stylesheet" href="https://unpkg.com/@functionalcss/core/dist/full.css" />
```

This loads every class (about 28 MB), which is fine for prototypes but not for production. To
ship only what you use, purge with the CLI:

```bash
npm install @functionalcss/core
npm install -D @functionalcss/cli
npx fcss init --framework none   # creates fcss.config.ts; point `content` at your HTML
npx fcss purge -i node_modules/@functionalcss/core/dist/full.css -o public/fcss.css

# same with bun
bun add @functionalcss/core
bun add -d @functionalcss/cli
bunx fcss init --framework none
bunx fcss purge -i node_modules/@functionalcss/core/dist/full.css -o public/fcss.css
```

Run the purge again whenever your HTML changes.

```html
<link rel="stylesheet" href="/fcss.css" />
```

## Usage

### Class syntax

| Pattern                             | Example                             | CSS                                           |
| ----------------------------------- | ----------------------------------- | --------------------------------------------- |
| `property--value`                   | `padding--24`                       | `padding: 24px`                               |
| `property--value:pseudo`            | `color--red:hover`                  | `:hover { color: … }`                         |
| `property--value:aria-attr:value`   | `display--block:aria-expanded:true` | `[aria-expanded='true'] { display: block }`   |
| `breakpoint-property--value`        | `md-display--none`                  | `@media (min-width: 768px) { display: none }` |
| `breakpoint-property--value:pseudo` | `md-color--red:hover`               | both combined                                 |

```html
<button class="padding--16 background-color--blue color--white border-radius--8 color--red:hover">
  Save
</button>

<nav class="display--none md-display--flex justify-content--space-between">…</nav>
```

Breakpoints are mobile-first (`min-width`):

| Prefix | `sm`   | `md`   | `lg`   | `xl`    | `xxl`   |
| ------ | ------ | ------ | ------ | ------- | ------- |
| Min    | 576 px | 768 px | 992 px | 1200 px | 1400 px |

Colors are custom properties (`--fcss-color-blue`, …) defined in `root.css`, so you can re-theme
them. Look up any class with `npx fcss explain <class>`, list them with `npx fcss list`, or see
the [reference](docs/reference.md).

### Keep class names static

The purge step reads your source files; it cannot run your code. Write full class names:

```tsx
// ✅ found by the scanner
<div className={isOpen ? 'display--block' : 'display--none'} />

// ❌ assembled at runtime, so it gets purged
<div className={`display--${isOpen ? 'block' : 'none'}`} />
```

Classes you can't write statically go in the `safelist`.

### Configuration

Optional `fcss.config.ts` at your project root (`npx fcss init` creates one):

```ts
import { defineConfig } from '@functionalcss/cli';

export default defineConfig({
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  safelist: ['display--none', 'display--block'],
});
```

### Custom classes

Multi-declaration, project-specific rules use the `c-` prefix and live in your own CSS:

```css
.c-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 16px;
}
```

## CLI

```bash
npm install -D @functionalcss/cli   # or: bun add -d @functionalcss/cli
```

| Command                               | Description                                                |
| ------------------------------------- | ---------------------------------------------------------- |
| `fcss init [-f <framework>]`          | Create `fcss.config.ts` and add the CSS import             |
| `fcss purge -i <in.css> -o <out.css>` | Keep only the classes found in your `content` globs        |
| `fcss audit`                          | Flag dynamic class fragments and deprecated classes        |
| `fcss explain <class>`                | Show what a class compiles to                              |
| `fcss list [-p <property>]`           | List classes for a property or category                    |
| `fcss build`                          | Generate custom CSS (colors, data states) from your config |
| `fcss doctor`                         | Check your installation                                    |
| `fcss migrate`                        | Migrate from legacy TFCSSF class names                     |

## Packages

| Package                                          | What it is                                      |
| ------------------------------------------------ | ----------------------------------------------- |
| [`@functionalcss/core`](packages/core)           | The CSS library and class manifest              |
| [`@functionalcss/vite`](packages/vite)           | Vite plugin (purge + dev diagnostics)           |
| [`@functionalcss/next`](packages/next)           | Next.js plugin                                  |
| [`@functionalcss/astro`](packages/astro)         | Astro integration                               |
| [`@functionalcss/angular`](packages/angular)     | Angular `ng add` schematic                      |
| [`@functionalcss/postcss`](packages/postcss)     | PostCSS purge plugin (used by the integrations) |
| [`@functionalcss/cli`](packages/cli)             | `fcss` command-line tool                        |
| [`@functionalcss/scanner`](packages/scanner)     | Source scanner (for building your own tooling)  |
| [`@functionalcss/spec`](packages/spec)           | Machine-readable specification                  |
| [`@functionalcss/generator`](packages/generator) | CSS generator                                   |

All published on npm under [`@functionalcss`](https://www.npmjs.com/org/functionalcss).
Editor support (VS Code and Zed extensions, LSP server) lives in this repo and is not published
yet.

## Documentation

[Installation](docs/installation.md) · [Syntax](docs/syntax.md) · [Responsive](docs/responsive.md) ·
[States](docs/states.md) · [Purging](docs/purging.md) · [Custom CSS](docs/custom-css.md) ·
[Reference](docs/reference.md) · [Migration](docs/migration.md) · [Philosophy](docs/philosophy.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, architecture, and contribution guidelines.

## License

MIT © Diego Lafuente

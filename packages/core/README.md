<!--
@file packages/core/README.md
@description @functionalcss/core package documentation — installation and CSS entry points.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @functionalcss/core

The FCSS utility library as plain, generated CSS. Framework-agnostic, no runtime JavaScript.

## Installation

```bash
npm install @functionalcss/core
# or: pnpm add / yarn add / bun add @functionalcss/core
```

## Usage

With a bundler (Vite, webpack, Parcel, Next.js, Astro…):

```js
import '@functionalcss/core/full.css';
```

Without a build step:

```html
<link rel="stylesheet" href="https://unpkg.com/@functionalcss/core/dist/full.css" />
```

`full.css` contains every utility, state and breakpoint variant. Use a framework integration
(`@functionalcss/vite`, `@functionalcss/next`, `@functionalcss/astro`, `@functionalcss/postcss`)
or `fcss purge` from `@functionalcss/cli` to ship only the classes you use.

## Entry points

| Import                                   | Contents                              |
| ---------------------------------------- | ------------------------------------- |
| `@functionalcss/core` / `/full.css`      | Everything                            |
| `/reset.css`                             | Minimal reset                         |
| `/root.css`                              | Custom properties                     |
| `/utilities.css`                         | Base utilities                        |
| `/states/pseudo.css`, `/states/aria.css` | Pseudo-class / ARIA state variants    |
| `/breakpoints/{sm,md,lg,xl,xxl}.css`     | One breakpoint each                   |
| `/manifest.json`                         | Compact class catalog used by tooling |

See the [installation guide](https://github.com/meerita/FCSS2/blob/master/docs/installation.md).

## License

MIT

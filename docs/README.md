# FCSS documentation

FCSS is a utility CSS library. Each class sets one CSS declaration, and its name is that
declaration: `display--flex` sets `display: flex`. There is no second vocabulary to learn.

```html
<div class="display--flex align-items--center gap--16 padding--24">
  <h1 class="font-size--32 font-weight--700 color--black">Hello</h1>
</div>
```

## Start here

```bash
npm install @functionalcss/core   # npm
bun add @functionalcss/core       # bun
```

```js
import '@functionalcss/core/full.css';
```

That gives you every class. Before you ship, add the purge step for your framework so the
browser only downloads the classes you use. [Installation](./installation.md) covers each setup.

## Contents

| Document                             | What it covers                                        |
| ------------------------------------ | ----------------------------------------------------- |
| [Philosophy](./philosophy.md)        | Why one class maps to one declaration                 |
| [Installation](./installation.md)    | Vite, Next.js, Astro, Angular, PostCSS and plain HTML |
| [Syntax](./syntax.md)                | How class names are built                             |
| [Responsive design](./responsive.md) | Breakpoint prefixes and the order files load in       |
| [States](./states.md)                | Pseudo-classes, ARIA states and data states           |
| [Custom CSS](./custom-css.md)        | The `c-` prefix for rules a utility can't express     |
| [Purging](./purging.md)              | Shipping only the classes you use                     |
| [Reference](./reference.md)          | Which CSS properties are covered                      |
| [Framework guides](./guides/)        | React, Next.js, Angular, Astro and Zed in more depth  |
| [Migration](./migration.md)          | Moving from the legacy TFCSSF repository              |

## Packages

These are published on npm under [`@functionalcss`](https://www.npmjs.com/org/functionalcss):

| Package                    | What it does                                           |
| -------------------------- | ------------------------------------------------------ |
| `@functionalcss/core`      | The generated CSS and the class manifest               |
| `@functionalcss/vite`      | Vite plugin: purge on build, warnings in dev           |
| `@functionalcss/next`      | Next.js plugin (`withFcss`)                            |
| `@functionalcss/astro`     | Astro integration, built on the Vite plugin            |
| `@functionalcss/angular`   | `ng add` schematic                                     |
| `@functionalcss/postcss`   | The purge itself, as a PostCSS plugin                  |
| `@functionalcss/cli`       | The `fcss` command                                     |
| `@functionalcss/scanner`   | Finds class names in source files                      |
| `@functionalcss/spec`      | The machine-readable spec everything is generated from |
| `@functionalcss/generator` | Turns the spec into CSS                                |

The language service, LSP server, VS Code and Zed extensions live in this repo but are not
on npm yet.

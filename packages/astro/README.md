<!--
@file packages/astro/README.md
@description @fcss/astro integration guide — installation, configuration, and usage.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @fcss/astro

Official Astro integration for [FCSS](https://github.com/cognativinc/fcss) — registers
[`@fcss/vite`](../vite/README.md)'s plugin into Astro's Vite config to enable production CSS
purging and development dynamic-fragment warnings for Astro projects.

`@fcss/astro` is a thin wrapper: it does not reimplement scanning or purging, it delegates
directly to `@fcss/vite`'s `fcss()` plugin (Astro's build pipeline _is_ Vite), adding only
Astro-aware default content globs.

## Features

- **Production purge** — removes unused FCSS utility classes at build time, on both static
  (SSG) and server (SSR) output.
- **Dev diagnostics** — warns when a dynamic `class:list` entry prevents static analysis.
- **`.astro` template scanning** — `class="..."` attributes and static `class:list={[...]}`
  entries are extracted out of the box.
- **No runtime JS** — zero FCSS code is added to the browser bundle.

## Installation

```bash
npm install @fcss/core @fcss/astro
```

## Setup

### `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import fcss from '@fcss/astro';

export default defineConfig({
  integrations: [fcss()],
});
```

### `fcss.config.ts`

```ts
import type { FcssViteConfig } from '@fcss/astro';

const config: FcssViteConfig = {
  content: ['src/**/*.astro', '!node_modules/**'],
};

export default config;
```

If you omit `fcss.config.ts` (or omit `content` from it), `@fcss/astro` supplies an
Astro-aware default —
`src/**/*.{html,js,jsx,ts,tsx,astro}` — instead of `@fcss/vite`'s own HTML/JS/TS/JSX/TSX-only
default. An explicit `content` in your `fcss.config.ts`, or passed directly to `fcss()`, is
always respected and never overridden.

### A layout or page

```astro
---
import '@fcss/core/full.css';
---
```

## Options

`fcss()` accepts the same options as `@fcss/vite`'s `fcss()` plugin:

| Option            | Type                                   | Description                                                          |
| ----------------- | -------------------------------------- | -------------------------------------------------------------------- |
| `config.content`  | `string[]`                             | Glob patterns pointing to source files.                              |
| `config.safelist` | `Array<string \| { pattern: RegExp }>` | Classes to always keep, regardless of whether they appear in source. |

## Static class pattern

FCSS relies on static analysis. Use string literals in `class` — not template expressions:

```astro
<!-- ✅ Correct: static class -->
<div class="display--flex padding--16" />

<!-- ❌ Wrong: an expression container with a template literal prevents static analysis -->
<div class={`display--flex opacity--${isActive ? '1' : '0.5'}`} />
```

## `class:list` — static vs. dynamic

Astro's `class:list={[...]}` merge directive is scanned the same way `clsx`/`ngClass` usage is
in the JSX and Angular extractors: static string, array, and object entries are extracted;
anything that resolves a class name at runtime (a template literal with interpolation, a bare
identifier, a function call) cannot be statically analysed and triggers a dev-mode warning.

```astro
---
const opacityByState: Record<'active' | 'inactive', string> = {
  active: 'opacity--1',
  inactive: 'opacity--0.5',
};
const state = isActive ? 'active' : 'inactive';
---

<!-- ✅ Correct: static array entries -->
<div class:list={['display--flex', 'padding--16']} />

<!-- ✅ Correct: static object entries — both keys are statically visible regardless
     of which branch `hidden` takes at runtime -->
<div class:list={[{ 'display--none': hidden, 'display--flex': !hidden }]} />

<!-- ✅ Correct: static class map keyed by a variable, mirroring the dynamic-class-map
     pattern in @fcss/vite's README — the class *names* are static, only the lookup is dynamic -->
<div class:list={[opacityByState[state]]} />

<!-- ❌ Wrong: template literal interpolation prevents static analysis -->
<div class:list={[`opacity--${state}`]} />
```

The plugin warns about dynamic fragments in dev mode and purges those classes in production.

## Production purge report

When `astro build` runs, the underlying `@fcss/postcss` plugin logs a purge summary:

```
[@fcss/postcss] Purge: 18/326313 selectors retained (326295 removed, 100.0% reduction, ...)
```

## Static output vs. server output

Both `output: 'static'` (SSG) and `output: 'server'` (SSR) are verified directly, including
the official `@astrojs/node` adapter for server output — see `examples/astro/static/` and
`examples/astro/server/` in this repository. Because purging happens in the underlying Vite
plugin, other deploy adapters (Vercel, Netlify, Cloudflare, etc.) are expected to work the same
way — they run the same Vite build — but are not individually verified here.

## Peer dependencies

- `astro ^7.0.0`
- `@fcss/core` (for the CSS and manifest)

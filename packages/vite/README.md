<!--
@file packages/vite/README.md
@description @fcss/vite plugin documentation — installation, configuration, and usage guide.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @fcss/vite

Vite plugin for [FCSS](https://github.com/cognativinc/fcss) — adds production CSS purging and development dynamic-fragment warnings for React+Vite projects.

## Features

- **Production purge** — removes unused FCSS utility classes at build time (via PostCSS AST, not regex).
- **Dev diagnostics** — warns when dynamic template literals in `className` prevent static analysis.
- **HMR support** — triggers full reload when `fcss.config.ts` changes.
- **No runtime JS** — zero FCSS code is added to the browser bundle.

## Installation

```bash
npm install @fcss/core @fcss/vite -D
```

## Setup

### `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fcss } from '@fcss/vite';

export default defineConfig({
  plugins: [react(), fcss()],
});
```

### `fcss.config.ts`

```ts
import type { FcssViteConfig } from '@fcss/vite';

const config: FcssViteConfig = {
  content: ['src/**/*.{ts,tsx}', '!node_modules/**'],
};

export default config;
```

### `src/main.tsx`

```tsx
import '@fcss/core/full.css';
```

## Options

| Option            | Type                                   | Description                                                                          |
| ----------------- | -------------------------------------- | ------------------------------------------------------------------------------------ |
| `config.content`  | `string[]`                             | Glob patterns pointing to source files. Defaults to `src/**/*.{html,js,jsx,ts,tsx}`. |
| `config.safelist` | `Array<string \| { pattern: RegExp }>` | Classes to always keep, regardless of whether they appear in source.                 |

## Static class pattern

FCSS relies on static analysis. Use string literals or class maps — not template literals:

```tsx
// ✅ Correct: static class map
const stateClass: Record<string, string> = {
  active:   'opacity--1',
  inactive: 'opacity--0.5',
};
<div className={stateClass[isActive ? 'active' : 'inactive']} />

// ✅ Correct: static string
<div className="display--flex padding--16" />

// ❌ Wrong: template literal prevents static analysis
<div className={`display--flex opacity--${isActive ? '1' : '0.5'}`} />
```

The plugin warns about dynamic fragments in dev mode and purges those classes in production.

## Dynamic class map pattern

For conditional classes, use an explicit map object:

```tsx
const buttonVariant: Record<'primary' | 'ghost', string> = {
  primary: 'background-color--black color--white',
  ghost: 'background-color--white color--black',
};

<button className={buttonVariant[variant]}>{label}</button>;
```

## Production purge report

When `vite build` runs, the plugin logs a purge summary:

```
[@fcss/postcss] Purge: 17/326313 selectors retained (326296 removed, 100.0% reduction, ...)
```

## Peer dependencies

- `vite ^5.0.0 || ^6.0.0`
- `@fcss/core` (for the CSS and manifest)

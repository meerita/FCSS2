<!--
@file packages/angular/README.md
@description @fcss/angular integration guide for Angular standalone and workspace projects.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @fcss/angular

Official Angular integration for [FCSS](../../README.md) — one `ng add` command installs
FCSS, adds the global stylesheet, creates `fcss.config.ts`, and configures the production
PostCSS purge pipeline.

## Requirements

- Angular 17, 18, or 19
- Node.js 18+

## Installation

```bash
ng add @fcss/angular
```

For a specific project in a multi-project workspace:

```bash
ng add @fcss/angular --project my-app
```

Skip the package manager install step:

```bash
ng add @fcss/angular --skip-install
```

## What the schematic does

| Action | Detail |
|--------|--------|
| Adds `@fcss/core` to `dependencies` | Global CSS library |
| Adds `@fcss/postcss` to `devDependencies` | PostCSS purge plugin |
| Prepends `node_modules/@fcss/core/dist/full.css` to `styles` in `angular.json` | Global import |
| Creates `fcss.config.ts` | Scanner configuration |
| Creates `postcss.config.mjs` | Production purge configuration |

All steps are **idempotent** — running `ng add` twice makes no duplicate changes.

## Template class usage

Use FCSS utility classes directly in component templates:

```html
<!-- app.component.html -->
<div class="display--flex flex-direction--column gap--16">
  <h1 class="font-size--2rem font-weight--700">Hello FCSS</h1>
  <p class="color--var(--fcss-color-muted)">Framework-agnostic utility CSS.</p>
</div>
```

## ARIA state classes

ARIA state classes use attribute selectors. In Angular templates, use the `class` attribute
directly (not `[class.x]`) for ARIA class names that contain colons:

```html
<!-- Safe: bind aria-expanded and use the ARIA utility class via plain class -->
<button
  [attr.aria-expanded]="isOpen"
  class="display--block:aria-expanded:true"
>
  Toggle
</button>
```

## `[class.x]` binding — safe form for special characters

Angular's `[class.x]` binding syntax does not support dots or colons in the class name.
Use `[ngClass]` with a string key for FCSS classes that contain special characters:

```html
<!-- Supported: simple class names -->
<div [class.display--block]="isVisible"></div>

<!-- For classes with dots/colons, use ngClass -->
<div [ngClass]="{'opacity--0.5': isDimmed}"></div>
<div [ngClass]="{'display--block:aria-expanded:true': isExpanded}"></div>
```

## ngClass patterns

**Object literal** (keys are the class names):

```html
<div [ngClass]="{'display--flex': row, 'flex-direction--column': col}"></div>
```

**Array literal** (mix of static strings and conditional expressions):

```html
<div [ngClass]="['padding--16', isActive ? 'background-color--blue' : '']"></div>
```

## Configuration

Edit `fcss.config.ts` to customise which files the scanner analyses:

```typescript
import type { FcssAngularConfig } from '@fcss/angular';

const config: FcssAngularConfig = {
  content: [
    'src/**/*.{ts,html}',
    '../../packages/ui/src/**/*.{ts,html}', // shared library
  ],
};

export default config;
```

## Purge configuration

The schematic creates `postcss.config.mjs` at the workspace root:

```js
import { createRequire } from 'module';
import fcssPostcss from '@fcss/postcss';

const require = createRequire(import.meta.url);

export default {
  plugins: [
    fcssPostcss({
      manifest: require.resolve('@fcss/core/dist/manifest.json'),
      content: ['src/**/*.{ts,html}'],
      report: true,
    }),
  ],
};
```

Angular CLI reads this file automatically for both the webpack (`@angular-devkit/build-angular:browser`)
and esbuild (`@angular/build:application`) builders. The FCSS PostCSS plugin purges unused
utility classes at production build time.

### Angular version compatibility

| Builder | Supported |
|---------|-----------|
| `@angular/build:application` (esbuild, Angular 17+) | ✅ |
| `@angular-devkit/build-angular:browser` (webpack, Angular 15–17) | ✅ |

## Multi-project workspace

When the workspace has multiple projects, the schematic only modifies the project
specified with `--project`. Other projects are untouched:

```bash
# Only app1 is configured; app2 is unmodified
ng add @fcss/angular --project app1
```

## SSR

FCSS is build-time only and has zero runtime JavaScript. Adding FCSS to an Angular
Universal (SSR) project has no effect on server-side rendering behaviour.

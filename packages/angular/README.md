<!--
@file packages/angular/README.md
@description @functionalcss/angular integration guide for Angular standalone and workspace projects.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @functionalcss/angular

Official Angular integration for [FCSS](../../README.md) — one `ng add` command installs
FCSS, adds the global stylesheet, creates `fcss.config.ts`, and wires a purge step into your
production build.

## Requirements

- Angular 17 – 22 (verified with `ng new` + `ng add` + `npm run build` on 17, 20, 21 and 22)
- The Node.js version your Angular release requires

## Installation

```bash
ng add @functionalcss/angular
```

For a specific project in a multi-project workspace:

```bash
ng add @functionalcss/angular --project my-app
```

Skip the package manager install step:

```bash
ng add @functionalcss/angular --skip-install
```

## What the schematic does

| Action                                                                                  | Detail                        |
| --------------------------------------------------------------------------------------- | ----------------------------- |
| Adds `@functionalcss/core` to `dependencies`                                            | Global CSS library            |
| Adds `@functionalcss/postcss` to `devDependencies`                                      | PostCSS purge plugin          |
| Prepends `node_modules/@functionalcss/core/dist/full.css` to `styles` in `angular.json` | Global import                 |
| Sets the `production` configuration's `styles` to `src/fcss.purged.css`                 | Purged stylesheet for builds  |
| Creates `fcss.config.ts`                                                                | Scanner configuration         |
| Creates `fcss-purge.mjs`                                                                | Pre-build purge script        |
| Changes the `build` script to `node fcss-purge.mjs && ng build`                         | Purge runs before every build |
| Adds `/src/fcss.purged.css` to `.gitignore`                                             | Generated file                |

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
<button [attr.aria-expanded]="isOpen" class="display--block:aria-expanded:true">Toggle</button>
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
import type { FcssAngularConfig } from '@functionalcss/angular';

const config: FcssAngularConfig = {
  content: [
    'src/**/*.{ts,html}',
    '../../packages/ui/src/**/*.{ts,html}', // shared library
  ],
};

export default config;
```

## Production builds

`ng serve` and development builds use the full stylesheet, so every utility is available while
you work. Production builds use a purged copy instead:

```bash
npm run build   # = node fcss-purge.mjs && ng build
```

`fcss-purge.mjs` scans `src/**/*.{ts,html}`, keeps only the utilities you use, and writes them to
`src/fcss.purged.css`, which the `production` configuration in `angular.json` points at. Purging
happens _before_ `ng build`, so Angular's default bundle budgets stay as they are.

Always build through `npm run build` (or `pnpm build`, `bun run build`, `yarn build`). Running
`ng build` on its own skips the purge, and fails if `src/fcss.purged.css` does not exist yet.

## Multi-project workspace

When the workspace has multiple projects, the schematic only modifies the project
specified with `--project`. Other projects are untouched:

```bash
# Only app1 is configured; app2 is unmodified
ng add @functionalcss/angular --project app1
```

## SSR

FCSS is build-time only and has zero runtime JavaScript. Adding FCSS to an Angular
Universal (SSR) project has no effect on server-side rendering behaviour.

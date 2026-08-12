# FCSS Documentation

> Utility CSS using the CSS syntax you already know.

FCSS (Functional CSS) is a utility-first CSS framework where every class maps to exactly one CSS declaration. No abbreviations, no shorthand aliases, no proprietary syntax — just CSS property names and values as classes.

```html
<div class="display--flex align-items--center gap--16 padding--24">
  <h1 class="font-size--2rem font-weight--700 color--black">Hello</h1>
</div>
```

## Contents

| Document                             | Description                                                    |
| ------------------------------------ | -------------------------------------------------------------- |
| [Philosophy](./philosophy.md)        | Why FCSS exists and how it differs from other approaches       |
| [Installation](./installation.md)    | Setup for Vanilla, React, Vite, Next.js, Angular, and Astro    |
| [Syntax](./syntax.md)                | Class naming rules, breakpoints, states, and the `c-` prefix   |
| [Responsive Design](./responsive.md) | Mobile-first breakpoints and cascade ordering                  |
| [States](./states.md)                | Pseudo-classes, ARIA states, form states, and data states      |
| [Custom CSS](./custom-css.md)        | When and how to use the `c-` escape hatch                      |
| [Purging](./purging.md)              | Removing unused utilities for production                       |
| [Reference](./reference.md)          | CSS property coverage index                                    |
| [Framework Guides](./guides/)        | Detailed React, Next.js, Angular, and Astro integration guides |
| [Migration](./migration.md)          | Moving from the legacy TFCSSF repository                       |

## Quick start

```bash
npm install @fcss/core
```

```js
// Import in your entry point
import '@fcss/core/fcss.css';
```

```html
<div class="display--flex flex-direction--column gap--8">
  <p class="color--black font-size--1rem">One class. One declaration.</p>
</div>
```

## Packages

| Package                  | Purpose                                                     |
| ------------------------ | ----------------------------------------------------------- |
| `@fcss/core`             | Generated CSS utility set                                   |
| `@fcss/cli`              | Build, purge, generate, and doctor commands                 |
| `@fcss/next`             | Next.js plugin (`withFcss`) for App Router and Pages Router |
| `@fcss/angular`          | Angular `ng-add` schematic                                  |
| `@fcss/vite`             | Vite plugin                                                 |
| `@fcss/astro`            | Astro integration (wraps `@fcss/vite`)                      |
| `@fcss/postcss`          | PostCSS purge pipeline                                      |
| `@fcss/scanner`          | Static class extraction engine                              |
| `@fcss/language-service` | IntelliSense and validation                                 |
| `@fcss/eslint-plugin`    | ESLint rules for FCSS class validation                      |

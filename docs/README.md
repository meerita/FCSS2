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
npm install @functionalcss/core
```

```js
// Import in your entry point
import '@functionalcss/core/full.css';
```

```html
<div class="display--flex flex-direction--column gap--8">
  <p class="color--black font-size--1rem">One class. One declaration.</p>
</div>
```

## Packages

| Package                           | Purpose                                                     |
| --------------------------------- | ----------------------------------------------------------- |
| `@functionalcss/core`             | Generated CSS utility set                                   |
| `@functionalcss/cli`              | Build, purge, generate, and doctor commands                 |
| `@functionalcss/next`             | Next.js plugin (`withFcss`) for App Router and Pages Router |
| `@functionalcss/angular`          | Angular `ng-add` schematic                                  |
| `@functionalcss/vite`             | Vite plugin                                                 |
| `@functionalcss/astro`            | Astro integration (wraps `@functionalcss/vite`)             |
| `@functionalcss/postcss`          | PostCSS purge pipeline                                      |
| `@functionalcss/scanner`          | Static class extraction engine                              |
| `@functionalcss/language-service` | IntelliSense and validation                                 |
| `@functionalcss/eslint-plugin`    | ESLint rules for FCSS class validation                      |

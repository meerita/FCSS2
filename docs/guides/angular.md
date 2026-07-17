# Angular Guide

`@fcss/angular` provides an `ng-add` schematic that configures FCSS in an Angular project automatically.

## Automatic setup (recommended)

```bash
ng add @fcss/angular
```

The schematic:

1. Installs `@fcss/core` as a dependency
2. Adds `@fcss/core/fcss.css` to `angular.json` styles
3. Optionally generates an `fcss.config.ts`

## Manual setup

```bash
npm install @fcss/core
```

Add the CSS to your `angular.json`:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "styles": ["node_modules/@fcss/core/fcss.css", "src/styles.css"]
          }
        }
      }
    }
  }
}
```

## Using classes in templates

Apply FCSS classes directly in Angular templates:

```html
<!-- app.component.html -->
<div class="display--flex flex-direction--column gap--1rem padding--2rem">
  <h1 class="font-size--2rem font-weight--700 color--black">{{ title }}</h1>
  <p class="font-size--1rem color--gray line-height--1-5">{{ description }}</p>
</div>
```

## Class binding

Use Angular's `[class]` or `[ngClass]` binding with complete class name literals:

```html
<!-- Safe — both values are complete class literals -->
<button
  [class]="isLoading ? 'opacity--0-6 cursor--wait' : 'opacity--1 cursor--pointer'"
  [disabled]="isLoading"
>
  {{ isLoading ? 'Saving…' : 'Save' }}
</button>
```

```html
<!-- Safe — ngClass with literal keys -->
<div
  [ngClass]="{
    'display--block': isOpen,
    'display--none': !isOpen
  }"
>
  Panel
</div>
```

```html
<!-- Unsafe — class name assembled at runtime, purger will miss it -->
<div [class]="property + '--' + value"></div>
```

## Angular class binding syntax note

FCSS class names contain colons (`:`), which Angular parses as special syntax in template binding. When a class name contains `:`, use the `[class.classname]` binding with bracket notation or keep the class static:

```html
<!-- Static — works as-is -->
<a class="color--blue color--red:hover">Link</a>

<!-- Dynamic binding with colon — use string binding -->
<div [ngClass]="{'color--red:hover': true}">...</div>
```

For Angular class bindings, prefer static classes for state-based utilities and use `[ngClass]` with object syntax when toggling is needed.

## Responsive classes

```html
<div
  class="display--grid grid-template-columns--1fr md-grid-template-columns--1fr-1fr lg-grid-template-columns--repeat-3-1fr gap--1rem"
>
  <div
    class="padding--1rem background-color--white border-radius--0-25rem"
    *ngFor="let item of items"
  >
    {{ item.title }}
  </div>
</div>
```

## ARIA state classes

FCSS ARIA state classes pair naturally with Angular's accessibility patterns:

```html
<!-- Disclosure pattern -->
<button
  [attr.aria-expanded]="isOpen"
  (click)="isOpen = !isOpen"
  class="display--flex align-items--center gap--0-5rem cursor--pointer"
>
  Toggle
</button>
<div class="display--none display--block:aria-expanded:true" [attr.aria-expanded]="isOpen">
  Content
</div>
```

## Production purging

Add PostCSS purging to your Angular build. The recommended approach is the CLI:

```bash
npm install -D @fcss/cli @fcss/postcss
```

```ts
// fcss.config.ts
import { defineConfig } from '@fcss/cli';

export default defineConfig({
  content: ['src/**/*.{ts,html}'],
  safelist: ['display--none', 'display--block'],
});
```

Run purge as part of your build pipeline:

```json
// package.json
{
  "scripts": {
    "build": "ng build && fcss purge"
  }
}
```

Or integrate via a custom PostCSS configuration in your Angular project:

```js
// postcss.config.js (at project root)
const { fcssPlugin } = require('@fcss/postcss');

module.exports = {
  plugins: [
    process.env.NODE_ENV === 'production' &&
      fcssPlugin({
        content: ['src/**/*.{ts,html}'],
      }),
  ].filter(Boolean),
};
```

## IntelliSense

Install `@fcss/vscode` from the VS Code marketplace for autocompletion in Angular template files (`.html`).

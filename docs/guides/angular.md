# Angular Guide

`@functionalcss/angular` provides an `ng-add` schematic that configures FCSS in an Angular project automatically.

## Automatic setup (recommended)

```bash
ng add @functionalcss/angular
```

The schematic (Angular 17 – 22):

1. Adds `@functionalcss/core` and `@functionalcss/postcss` to `package.json`
2. Adds the full stylesheet to `angular.json` styles, and points the `production` configuration
   at a purged copy, `src/fcss.purged.css`
3. Creates `fcss.config.ts` and `fcss-purge.mjs`
4. Changes the `build` script to `node fcss-purge.mjs && ng build`

Build for production with `npm run build` — see [Production purging](#production-purging).

## Manual setup

```bash
npm install @functionalcss/core
```

Add the CSS to your `angular.json`:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "styles": ["node_modules/@functionalcss/core/dist/full.css", "src/styles.css"]
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

With `ng add`, purging is already set up: `npm run build` runs `fcss-purge.mjs`, which writes only
the utilities your templates use to `src/fcss.purged.css`, then runs `ng build` with the
`production` configuration pointing at that file. Development (`ng serve`) keeps the full set.

Purging runs before the build on purpose. The full stylesheet is about 20 MB, so adding it to a
production build would exceed Angular's default `initial` bundle budget (1 MB) before any
post-build step could shrink it.

For manual setups, copy the same arrangement: generate the purged file with
[`@functionalcss/postcss`](../../packages/postcss/README.md) from
`@functionalcss/core/full.css`, and reference it in your `production` configuration's `styles`.

## IntelliSense

Install `@functionalcss/vscode` from the VS Code marketplace for autocompletion in Angular template files (`.html`).

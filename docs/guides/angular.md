# Angular Guide

`@functionalcss/angular` is an `ng add` schematic. It works on Angular 17 through 22.

## Setup

```bash
ng add @functionalcss/angular
```

`ng add` installs with your workspace's package manager. On a bun workspace:

```bash
bunx ng add @functionalcss/angular
```

What the schematic changes:

1. Adds `@functionalcss/core` and `@functionalcss/postcss` to `package.json`.
2. Adds the full stylesheet to `styles` in `angular.json`, and points the `production`
   configuration at a purged copy, `src/fcss.purged.css`.
3. Creates `fcss.config.ts` and `fcss-purge.mjs`.
4. Changes the `build` script to `node fcss-purge.mjs && ng build`.
5. Adds `/src/fcss.purged.css` to `.gitignore`.

Run it twice and nothing gets duplicated.

## Build

```bash
ng serve          # development: every class available
npm run build     # production: purge, then ng build
bun run build     # same thing on bun
```

`fcss-purge.mjs` scans `src/**/*.{ts,html}` and writes only the classes it finds to
`src/fcss.purged.css`. Then `ng build` picks that file up through the `production`
configuration.

The purge runs before the build, not after. The full stylesheet is about 20 MB, and Angular's
default `initial` budget is 1 MB, so a post-build purge never gets the chance: the build fails
first.

Don't run `ng build` on its own. It skips the purge, and if `src/fcss.purged.css` doesn't exist
yet, it fails.

## Manual setup

If you'd rather not use the schematic:

```bash
npm install @functionalcss/core
npm install -D @functionalcss/postcss
# or
bun add @functionalcss/core
bun add -d @functionalcss/postcss
```

Development can point straight at the full stylesheet:

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

For production, copy what the schematic does: generate a purged file from
`@functionalcss/core/full.css` with [`@functionalcss/postcss`](../../packages/postcss/README.md)
before `ng build`, and list that file in the `production` configuration's `styles`.

## Classes in templates

```html
<!-- app.component.html -->
<div class="display--flex flex-direction--column gap--16 padding--32">
  <h1 class="font-size--3xl font-weight--700 color--black">{{ title }}</h1>
  <p class="font-size--base color--gray line-height--relaxed">{{ description }}</p>
</div>
```

## Bindings

Keep class names complete. The purge reads your templates, it doesn't evaluate them.

```html
<!-- Fine: both values are complete class names -->
<button
  [class]="isLoading ? 'opacity--0.6 cursor--wait' : 'cursor--pointer'"
  [disabled]="isLoading"
>
  {{ isLoading ? 'Saving…' : 'Save' }}
</button>

<!-- Fine: literal keys -->
<div [ngClass]="{ 'display--block': isOpen, 'display--none': !isOpen }">Panel</div>

<!-- Purged: assembled at runtime -->
<div [class]="property + '--' + value"></div>
```

`[class.x]` can't take a name with a colon or a dot in it. For classes like
`color--red:hover` or `opacity--0.5`, use a static `class` attribute, or `[ngClass]` with the
name as a quoted key:

```html
<a class="color--blue color--red:hover">Link</a>

<div [ngClass]="{ 'opacity--0.5': isDimmed }"></div>
```

## Responsive classes

```html
<div
  class="display--grid grid-template-columns--1 md-grid-template-columns--2 lg-grid-template-columns--3 gap--16"
>
  @for (item of items; track item.id) {
  <div class="padding--16 background-color--white border-radius--4">{{ item.title }}</div>
  }
</div>
```

## ARIA states

An ARIA class matches when the element itself carries the attribute:

```html
<button
  [attr.aria-expanded]="isOpen"
  (click)="isOpen = !isOpen"
  class="background-color--white background-color--lightest-gray:aria-expanded:true"
>
  Menu
</button>
```

## Editor support

The VS Code extension lives in `packages/vscode` and isn't on the Marketplace yet.

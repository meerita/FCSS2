# Responsive Design

FCSS uses a **mobile-first** breakpoint strategy. Unprefixed utility classes apply at all viewport widths. Prefixed classes apply from their breakpoint's minimum width upward.

## Default breakpoints

| Prefix | Min-width | Typical target |
| --- | --- | --- |
| *(none)* | all sizes | Mobile and all devices |
| `sm-` | 576px | Small devices |
| `md-` | 768px | Tablets |
| `lg-` | 992px | Desktop |
| `xl-` | 1200px | Large desktop |
| `xxl-` | 1400px | Widescreen |

## How to use

Start with the mobile (unprefixed) classes, then add breakpoint-prefixed overrides for larger screens.

```html
<!-- Single column on mobile, two columns from tablet up, three from desktop -->
<div class="
  display--grid
  grid-template-columns--1fr
  md-grid-template-columns--1fr-1fr
  lg-grid-template-columns--1fr-1fr-1fr
">
```

```html
<!-- Hidden on mobile, shown from tablet up -->
<nav class="display--none md-display--flex">
```

```html
<!-- Font size scales with viewport -->
<h1 class="font-size--1-5rem md-font-size--2rem lg-font-size--3rem">
  Headline
</h1>
```

## Choosing which breakpoints to load

You do not need to load all breakpoint files. Match what you import to what your design actually uses:

| Design target | Import |
| --- | --- |
| Single layout (no responsive) | `generics.css` only |
| Mobile + desktop | `generics.css`, `md.css` |
| Mobile + tablet + desktop | `generics.css`, `sm.css`, `md.css`, `lg.css` |
| Full responsive range | All files |

Unused breakpoint files contribute zero classes to the purged output, but omitting them at import time speeds up development builds.

## Cascade ordering

Within the same property, breakpoint files override the generic file because they are imported later. The cascade order is:

```
root.css → normalizer.css → generics.css → sm.css → md.css → lg.css → xl.css → xxl.css → custom.css
```

A class like `md-display--flex` only takes effect when the viewport matches `min-width: 768px`. At smaller widths the browser ignores it, and the unprefixed class (if present) applies instead.

## Custom breakpoints

You can define additional breakpoints in `fcss.config.ts`:

```ts
import { defineConfig } from '@fcss/cli';

export default defineConfig({
  breakpoints: [
    { name: 'xs', minWidth: 400 },
    { name: 'wide', minWidth: 1600 },
  ],
});
```

Run `fcss build` after changing breakpoints to regenerate the CSS files.

## Responsive + state combinations

Breakpoint prefixes compose with state suffixes:

```html
<!-- Blue link that turns red on hover only from tablet up -->
<a class="color--blue md-color--blue md-color--red:hover">
```

# Current Framework Audit

Audited repository: `https://github.com/meerita/tfcssf`
Local clone: `/Users/diegolafuente/Projects/fcss-legacy`
Audit date: 2026-07-17

---

## Repository overview

The legacy FCSS project is a **Next.js 13.4.11 documentation site**, not a
distributable npm package. There is no `index.js`, no build step that emits
distributable CSS, and no published package on npm. The CSS files live in
`src/styles/` and are consumed only by the docs site itself.

| Field | Value |
|---|---|
| package name | `tfcssf` |
| version | `0.1.0` |
| private | `true` |
| license (package.json) | MIT |
| license (LICENSE file) | Unlicense (public domain) — **inconsistent** |
| framework | Next.js 13.4.11 |
| react | 18.2.0 |
| typescript | 5.1.6 |
| package manager | yarn (yarn.lock present) |

---

## File inventory

| File | Size (bytes) | Role |
|---|---|---|
| `src/styles/root.css` | 865 | CSS custom properties (design tokens) |
| `src/styles/normalizer.css` | 1,037 | CSS reset |
| `src/styles/generics.css` | 44,933 | Base utility classes (all devices) |
| `src/styles/hovers.css` | 49,111 | `:hover` state variants |
| `src/styles/focus.css` | 49,111 | `:focus` state variants |
| `src/styles/active.css` | 50,709 | `:active` state variants (**not imported**) |
| `src/styles/visited.css` | 52,305 | `:visited` state variants (**not imported**) |
| `src/styles/sm.css` | 28,514 | `max-width: 576px` breakpoint |
| `src/styles/md.css` | 29,021 | `min-width: 576px` breakpoint |
| `src/styles/lg.css` | 29,062 | `min-width: 992px` breakpoint |
| `src/styles/xl.css` | 29,017 | `min-width: 1200px` breakpoint |
| `src/styles/xxl.css` | 29,534 | `min-width: 1400px` breakpoint |
| `src/styles/custom.css` | 106 | Project-specific overrides |
| Total | 393,325 | |

**Critical**: `active.css` and `visited.css` are not imported in `_app.tsx`.
They exist on disk but are never loaded.

Import order in `_app.tsx`:
```
root.css → normalizer.css → generics.css → hovers.css → focus.css →
sm.css → md.css → lg.css → xl.css → xxl.css → custom.css
```

---

## Selector inventory

| File | Selectors |
|---|---|
| generics.css | 849 |
| hovers.css | 768 |
| focus.css | 768 |
| active.css | 768 |
| visited.css | 768 |
| sm.css | 504 |
| md.css | 515 |
| lg.css | 516 |
| xl.css | 515 |
| xxl.css | 515 |
| **Total** | **6,486** |

Note: generics.css has more selectors than each pseudo-state file (849 vs 768).
The difference of 81 entries comes from: (a) hover variants embedded directly
inside generics.css for the `color` property (lines 390–434), and (b) utilities
that were not mirrored into the pseudo-state files.

---

## Design tokens

### Colors (`src/styles/root.css`)

| Token | Value |
|---|---|
| `--blue` | `#1e90ff` |
| `--green` | `#4cd964` |
| `--yellow` | `#ffcc00` |
| `--orange` | `#ff9500` |
| `--red` | `#ff3830` |
| `--pink` | `#ff1e90` |
| `--purple` | `#93268e` |
| `--black` | `#121212` |
| `--darkest-gray` | `#222` |
| `--dark-gray` | `#4a4a4a` |
| `--gray` | `#656565` |
| `--light-gray` | `#73737a` |
| `--lighter-gray` | `#8e8e93` |
| `--lightest-gray` | `#d1d1d6` |
| `--white` | `#fff` |

### Font families

| Token | Value |
|---|---|
| `--font-family-serif` | `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Droid Sans, Helvetica Neue, sans-serif` |
| `--font-family-sans-serif` | Same as `--font-family-serif` — **identical stacks, both sans-serif** |
| `--font-family-mono` | `SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace` |

Note: `--font-family-serif` is misnamed — it uses a sans-serif font stack.

### Spacing scale (margin/padding)

`0, 4, 8, 12, 16, 24, 32, 48, 64, 96` px

### Font sizes

`8, 10, 12, 14, 16, 22, 24, 28, 32, 36, 45, 57` px

### Z-index values

`auto, 0, 1, 4, 8, 16, 24, 32`

### Opacity values

`0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1`
(encoded as `opacity--0`, `opacity--01`, `opacity--02`, … `opacity--1`)

### Border radius values

`0, 2, 4, 6, 8, 10` px (limited set; no percentage-based values)

### Order values

`1` through `12`

---

## CSS property coverage

### Properties present in generics.css (base utilities)

`accent-color`, `align-content`, `align-items`, `align-self`, `appearance`,
`background-color`, `border-radius`, `box-sizing`, `caption-side`, `caret-color`,
`clear`, `color`, `column-gap`, `cursor`, `direction`, `display`, `elevation`*,
`empty-cells`, `fill`, `flex-basis`, `flex-direction`, `flex-flow`, `flex-wrap`,
`font-family`, `font-kerning`, `font-optical-sizing`, `font-size`, `font-stretch`,
`font-style`, `font-variant-caps`, `font-weight`, `gap`, `grid-auto-columns`,
`hanging-punctuation`, `height`, `image-orientation`, `image-rendering`,
`justify-content`, `justify-items`, `justify-self`, `left`, `line-break`,
`line-height`, `list-style-type`, `margin`, `margin-block`, `margin-block-end`,
`margin-block-start`, `margin-bottom`, `margin-inline`, `margin-inline-end`,
`margin-inline-start`, `margin-left`, `margin-right`, `margin-top`, `max-width`,
`min-height`, `mix-blend-mode`, `object-fit`, `opacity`, `order`, `outline-color`,
`outline-style`, `outline-width`, `overflow`, `overflow-block`, `overflow-inline`,
`overflow-wrap`, `overflow-x`, `overflow-y`, `overscroll-behavior`, `padding`,
`padding-block`, `padding-bottom`, `padding-end`†, `padding-inline`, `padding-start`†,
`padding-top`, `pointer-events`, `position`, `resize`, `row-gap`, `scroll-behavior`,
`scroll-snap-align`, `scroll-snap-stop`, `scroll-snap-type`, `template-columns`‡,
`text-align`, `text-transform`, `transition-duration`, `transition-property`,
`transition-timing-function`, `width`, `writing-mode`, `z-index`

*`elevation` is a `box-shadow` alias (11 levels: 0–10); values are multi-shadow composites.
†`padding-start/end` map to `padding-inline-start/end` — naming mismatch.
‡`template-columns` maps to `grid-template-columns` — naming mismatch.

### Properties in breakpoint files but NOT in generics.css

`float` — available in breakpoint files (sm/md/lg/xl/xxl) only.

### Properties in generics.css but NOT in breakpoint files

`accent-color`, `appearance`, `background-color`, `box-sizing`, `caret-color`,
`clear`, `color`, `cursor`, `direction`, `elevation`, `empty-cells`, `fill`,
`font-family`, `font-style`, `font-variant-caps`, `hanging-punctuation`, `height`,
`image-orientation`, `image-rendering`, `mix-blend-mode`, `outline-color`,
`outline-style`, `outline-width`, `pointer-events`, `transition-duration`,
`transition-property`, `transition-timing-function`, `writing-mode`

---

## Pseudo-state architecture

Each state file is a complete copy of generics.css with a modified selector suffix.

| File | Suffix pattern | Selector example |
|---|---|---|
| generics.css | none | `.display--flex` |
| hovers.css | `\:hover:hover` | `.display--flex\:hover:hover` |
| focus.css | `\:focus:focus` | `.display--flex\:focus:focus` |
| active.css | `\:active:active` | `.display--flex\:active:active` |
| visited.css | `\:visited:visited` | `.display--flex\:visited:visited` |

Additionally, color hover variants appear **directly in generics.css** (lines 390–434),
duplicating what is already in hovers.css.

---

## Known bugs and structural issues

### Bug 1 — Malformed gray selectors (all pseudo-state files)

The gray color tokens use multi-word names (`darkest-gray`, `dark-gray`, etc.).
The pseudo-suffix is inserted before the final word segment, producing broken
selectors that never match anything in a browser.

Examples:
```css
/* intended: .color--darkest-gray\:hover:hover */
/* actual:   .color--darkest\:hover:hover-gray  */
.color--darkest\:hover:hover-gray { color: var(--darkest-gray); }
```

Affected classes: `*--darkest-gray`, `*--dark-gray`, `*--light-gray`,
`*--lighter-gray`, `*--lightest-gray` across hovers.css, focus.css, active.css,
visited.css.

### Bug 2 — Double pseudo-class suffix (hovers.css, focus.css, active.css, visited.css)

The `background-color` color group is duplicated in each pseudo-state file with
a double-escaped suffix, producing selectors that can never be triggered:

```css
/* valid (appears once) */
.background-color--blue\:hover:hover { background-color: var(--blue); }

/* bug (appears again) */
.background-color--blue\:hover:hover\:hover:hover { background-color: var(--blue); }
```

### Bug 3 — Duplicate selectors in generics.css

The following selectors each appear twice:
- `.height--100vh`
- `.height--100dvh`
- `.height--100vw`
- `.height--100vmin`
- `.height--100dvm`
- `.overscroll-behavior--auto`

### Bug 4 — Invalid CSS values used as cursor values

These class names use CSS property names from other properties as cursor values
(e.g., border styles as cursor names). None are valid `cursor` property values
and will silently fall back to `auto`:
```
cursor--no-underline, cursor--dashed, cursor--dotted, cursor--solid,
cursor--double, cursor--groove, cursor--ridge, cursor--inset, cursor--outset
```

### Bug 5 — Invalid transition-timing-function values

```css
.transition-timing-function--steps { transition-timing-function: steps; }
.transition-timing-function--cubic-bezier { transition-timing-function: cubic-bezier; }
```
Both require arguments: `steps(n, start|end)` and `cubic-bezier(x1,y1,x2,y2)`.

### Bug 6 — Invalid height units

```css
.height--100v   { height: 100v; }    /* not a valid CSS unit */
.height--100dvm { height: 100dvm; }  /* not a valid CSS unit */
```

### Bug 7 — Class-name/declaration mismatch

```css
.margin-block--auto { margin-block: 0; }  /* value is 0, not auto */
```

### Bug 8 — Non-FCSS class names in generics.css

`.md-clear-left` and `.md-clear-right` appear in generics.css without a
`@media` wrapper. They use the `md-` prefix but are not responsive — they
apply at all viewport widths.

### Bug 9 — active.css and visited.css not imported

Both files exist but are absent from the import list in `_app.tsx`.
Any class using `:active` or `:visited` state variants does not work.

### Bug 10 — License inconsistency

`package.json` declares `"license": "MIT"` but the `LICENSE` file contains the
Unlicense (public domain dedication). These are incompatible.

---

## Purge mechanism (documented)

The docs site describes using `@fullhuman/postcss-purgecss` with a custom regex
extractor:

```js
extractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
```

The documented build output references a **Vite** project (not Next.js),
suggesting the purge example was copied from a different project. No PurgeCSS
config exists in the legacy repo itself.

Documented size reduction: 73.53 kB → 5.62 kB (92.4% reduction uncompressed,
10.97 kB → 1.71 kB gzipped).

---

## Node.js / build requirements

- Node.js: not pinned; no `.nvmrc` or `.node-version` file
- Audited with: Node.js v22.21.1, yarn 1.22.22
- Package manager: yarn 1.x (classic)
- Build: `yarn && yarn build` (Next.js production build)
- No PostCSS config present in legacy repo
- No PurgeCSS config present in legacy repo

---

## Legacy build output

```
yarn run v1.22.22
$ next build
- info Linting and checking validity of types...
- info Creating an optimized production build...
- info Compiled successfully
- info Collecting page data...
- info Generating static pages (11/11)
- info Finalizing page optimization...

Route (pages)                              Size     First Load JS
┌ ○ /                                      1.14 kB        78.5 kB
├   /_app                                  0 B            74.9 kB
├ ○ /404                                   181 B          75.1 kB
├ λ /api/hello                             0 B            74.9 kB
├ ○ /breakpoint                            2.52 kB         321 kB
├ ○ /customization (434 ms)                2.74 kB         322 kB
├ ○ /grid (428 ms)                         2.81 kB         322 kB
├ ○ /installation                          2.49 kB         321 kB
├ ○ /manifesto                             3.87 kB        81.2 kB
├ ○ /purge (442 ms)                        2.24 kB         321 kB
├ ○ /syntax                                2.11 kB         321 kB
└ ○ /why                                   7.71 kB        85.1 kB
+ First Load JS shared by all              106 kB
  └ css/a3b3ffcb45ad2c5c.css               31.4 kB

Done in 18.89s.
```

Commands to reproduce:
```sh
cd /path/to/fcss-legacy
yarn           # install dependencies
yarn build     # Next.js production build
```

The CSS bundle (`31.4 kB`) is Next.js's bundled output of the active CSS imports —
no PurgeCSS is applied. Note: `active.css` and `visited.css` are not imported, so
they are excluded from this bundle.

---

## Purge simulation

A minimal HTML fixture was created with one class from each major utility category.
PurgeCSS was run against the combined CSS (all 12 files concatenated, 392,288 bytes).

**Fixture** (`/tmp/fcss-fixture.html`):
```html
<!DOCTYPE html><html><body>
  <div class="display--flex align-items--center justify-content--space-between">
    <p class="color--blue font-size--16 font-weight--bold margin--0 padding--16">Hello</p>
    <span class="background-color--black color--white border-radius--4 opacity--05">Badge</span>
    <button class="cursor--pointer color--red:hover transition-duration--300">Click</button>
    <nav class="position--fixed z-index--32 width--100 overflow--hidden">Nav</nav>
    <ul class="list-style-type--none flex-direction--row gap--8">
      <li class="sm-display--none md-display--block">Item</li>
    </ul>
    <img class="object-fit--cover max-width--100 height--auto">
    <div class="elevation--4 writing-mode--horizontal-tb">Shadow</div>
    <textarea class="resize--none overflow--auto"></textarea>
  </div>
</body></html>
```

**Command:**
```sh
npx purgecss --css all-fcss.css --content fcss-fixture.html \
  --output purged-fcss.css --safelist ':root'
```

**Results:**

| Metric | Before | After |
|---|---|---|
| Total CSS (bytes) | 392,288 | 4,642 |
| Selector rules retained | ~6,486 | 42 |
| Reduction | — | **98.8%** |

Note: PurgeCSS default extractor does not handle the `\:hover` escape syntax in
class names. The documented custom extractor (`/[\w-/:]+(?<!:)/g`) is required
for hover/focus/active/visited class names to survive purging.

---

## npm scope status

| Package | Status |
|---|---|
| `@fcss` scope | No packages registered; scope appears unclaimed |
| `@fcss/core` | 404 Not Found on npm registry |
| `fcss` (unscoped) | Exists — unrelated BSD-2-Clause package by kevin14 (v0.1.5, 2015) |

The `@fcss` npm scope is available. It must be claimed before alpha publication.

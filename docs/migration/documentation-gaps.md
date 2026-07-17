# Documentation Gaps

Compares classes present in the legacy CSS against what is documented in the
legacy docs site (`src/pages/`). Gaps flow in both directions.

---

## Classes used in docs but absent from CSS

These selectors appear in JSX files as `className` values but do not exist in
any CSS file in `src/styles/`.

| Class | Used in | Notes |
|---|---|---|
| `border-dp` | `installation/index.tsx`, `customization/index.tsx`, `breakpoint/index.tsx` | Referenced as a demo class; no definition found anywhere |
| `border-collapse--collapse` | `breakpoint/index.tsx` | `border-collapse` property not in generics.css |
| `font-weight--500` | `breakpoint/index.tsx` | generics.css only has named `font-weight` values (`bold`, `bolder`, `lighter`, `normal`), not numeric 500 |
| `inline` prop on `BodySmall` | breakpoint/index.tsx | Not a CSS class; a React prop on a custom component — listed for completeness |

---

## CSS features absent from documentation

### Pseudo-state files

| File | Documented? |
|---|---|
| `hovers.css` (`:hover` variants) | Partially — syntax page shows one `color--green:hover` example |
| `focus.css` (`:focus` variants) | **Not documented** — no page covers focus states |
| `active.css` (`:active` variants) | **Not documented AND not imported** in `_app.tsx` |
| `visited.css` (`:visited` variants) | **Not documented AND not imported** in `_app.tsx` |

### CSS properties with no documentation page or example

The following properties exist in generics.css but appear nowhere in the docs site:

`accent-color`, `appearance`, `box-sizing`, `caret-color`, `clear`, `cursor`,
`direction`, `elevation` (box-shadow alias), `empty-cells`, `fill`,
`font-kerning`, `font-optical-sizing`, `font-style`, `font-stretch`,
`font-variant-caps`, `hanging-punctuation`, `image-orientation`,
`image-rendering`, `mix-blend-mode`, `object-fit`, `outline-color`,
`outline-style`, `outline-width`, `pointer-events`, `resize`,
`scroll-behavior`, `scroll-snap-align`, `scroll-snap-stop`, `scroll-snap-type`,
`transition-duration`, `transition-property`, `transition-timing-function`,
`writing-mode`

### Breakpoint file properties not documented

The breakpoint files (`sm.css`–`xxl.css`) contain `float` which is absent from
generics.css but also absent from any documentation page.

---

## Documentation errors (docs contradict implementation)

### Error 1 — sm breakpoint value

**Docs** (`syntax/index.tsx`, code block):
```css
@media (max-width: 640px) { .sm-display--block { display: block; } }
```

**Actual** (`sm.css`):
```css
@media (max-width: 576px) { .sm-display--block { display: block; } }
```

640px vs 576px.

### Error 2 — md breakpoint value

**Docs** (`breakpoint/index.tsx`, table): shows `md-` starting at `+768px`

**Actual** (`md.css`):
```css
@media (min-width: 576px) { … }
```

576px not 768px. The file comment also says "medium devices: 768px - 992px"
which contradicts the actual query.

### Error 3 — Wrong filename in installation docs

**Docs** (`installation/index.tsx`): `import '@/styles/hover.css'`

**Actual** (`_app.tsx`): `import '@/styles/hovers.css'` (plural)

### Error 4 — File listing omits several files

The `ls -la` output shown in `installation/index.tsx` is missing:
`active.css`, `focus.css`, `visited.css`, `xxl.css`, `root.css`, `normalizer.css`.

### Error 5 — Purge docs use a Vite project, not Next.js

The build output shown in `purge/index.tsx` references `vite v4.x` and Vite
output format. The legacy repo is a Next.js project and does not use Vite.
The PostCSS config shown also targets `.ts/.tsx` files, which requires
additional extractor configuration beyond what is shown for `\:hover` class
syntax to survive purging.

### Error 6 — `border-dp` presented as a working demo

`installation/index.tsx` renders `<div className='border-dp'>` as a live demo
of "the framework in action," but this class does not exist in any CSS file.

---

## Documentation pages vs topics covered

| Page | Topic | Coverage |
|---|---|---|
| `index.tsx` | Home / intro | No class reference |
| `manifesto/` | Philosophy | No class reference |
| `why/` | Motivation | No class reference |
| `installation/` | Setup guide | Partially correct (see errors above) |
| `syntax/` | Class naming rules | Covers base syntax and one hover example only |
| `breakpoint/` | Responsive strategy | Breakpoint table has wrong md value |
| `grid/` | Grid layout | Not audited in detail |
| `customization/` | custom.css usage | Correct; uses missing `border-dp` in demo |
| `purge/` | PurgeCSS setup | Vite example in Next.js project |

No page covers: all available properties, complete value scales, focus/active/visited
variants, the elevation system, or the complete class reference.

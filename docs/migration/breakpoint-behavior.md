# Breakpoint Behavior

Documents the exact breakpoint strategy in the legacy FCSS repo as found in
`src/styles/*.css`. This is the ground-truth reference — docs-site breakpoint
tables are **not** authoritative (see documentation-gaps.md for discrepancies).

---

## Breakpoint table

| Prefix | File | Query | Strategy | Applies to |
|---|---|---|---|---|
| none | `generics.css` | none | all devices | all viewport widths |
| `sm-` | `sm.css` | `max-width: 576px` | max-width | viewports ≤ 576 px |
| `md-` | `md.css` | `min-width: 576px` | min-width | viewports ≥ 576 px |
| `lg-` | `lg.css` | `min-width: 992px` | min-width | viewports ≥ 992 px |
| `xl-` | `xl.css` | `min-width: 1200px` | min-width | viewports ≥ 1200 px |
| `xxl-` | `xxl.css` | `min-width: 1400px` | min-width | viewports ≥ 1400 px |

### Key observations

1. **`sm-` uses max-width, all others use min-width.** This is a hybrid strategy
   (not pure mobile-first). `sm-` targets only small screens; `md-` and above
   cascade upward from their min-width.

2. **`md-` starts at 576 px, not 768 px.** The file comment says
   "medium devices: 768px - 992px" and the docs-site table shows "+768px", but
   the actual `@media` query is `min-width: 576px`. The 768 px tier is absent.

3. **All breakpoint file comments say "medium devices: 768px - 992px"** —
   copy-paste error; no file was updated with correct descriptions.

4. **No 768 px breakpoint exists.** The breakpoint token `--md-device: 768px`
   in `root.css` does not correspond to any `@media` query in any CSS file.

5. **The `md-` and `sm-` ranges overlap at 576 px.** A viewport exactly 576 px
   wide activates both `sm-` (max-width ≤ 576) and `md-` (min-width ≥ 576),
   creating a conflict zone where specificity order determines which wins.

---

## Breakpoint property coverage

Not all generics.css properties are available in breakpoint files. Below is the
delta between generics.css and the sm/md/lg/xl/xxl files (all five breakpoint
files contain the same property set).

### In generics.css only (not in any breakpoint file)

`accent-color`, `appearance`, `background-color`, `box-sizing`, `caret-color`,
`clear`, `color`, `cursor`, `direction`, `elevation`, `empty-cells`, `fill`,
`font-family`, `font-style`, `font-variant-caps`, `hanging-punctuation`,
`height`, `image-orientation`, `image-rendering`, `mix-blend-mode`,
`outline-color`, `outline-style`, `outline-width`, `pointer-events`,
`transition-duration`, `transition-property`, `transition-timing-function`,
`writing-mode`

### In breakpoint files only (not in generics.css)

`float` — available as `sm-float--left`, `sm-float--right`, `sm-float--none`,
etc. across all five breakpoint files.

### In both generics.css and all breakpoint files

`align-content`, `align-items`, `align-self`, `border-radius`, `caption-side`,
`column-gap`, `display`, `flex-basis`, `flex-direction`, `flex-flow`,
`flex-wrap`, `font-kerning`, `font-optical-sizing`, `font-size`, `font-stretch`,
`font-weight`, `gap`, `grid-auto-columns`, `justify-content`, `justify-items`,
`justify-self`, `left`, `line-break`, `line-height`, `list-style-type`,
`margin` (and all sub-properties), `max-width`, `min-height`, `object-fit`,
`opacity`, `order`, `overflow` (and all sub-properties), `overscroll-behavior`,
`padding` (and all sub-properties), `position`, `resize`, `row-gap`,
`scroll-behavior`, `scroll-snap-align`, `scroll-snap-stop`, `scroll-snap-type`,
`template-columns`, `text-align`, `text-transform`, `width`, `z-index`

---

## Class naming convention for breakpoints

```
[prefix]-[property]--[value]
```

Examples:
- `sm-display--none` → `@media (max-width: 576px) { .sm-display--none { display: none; } }`
- `md-flex-direction--column` → `@media (min-width: 576px) { … }`
- `lg-width--50` → `@media (min-width: 992px) { … }`

No pseudo-state (hover/focus/active/visited) variants exist for breakpoint classes.
Breakpoint files do not include any `:hover` or other state suffixes.

---

## Selector count per breakpoint file

| File | Selectors |
|---|---|
| `sm.css` | 504 |
| `md.css` | 515 |
| `lg.css` | 516 |
| `xl.css` | 515 |
| `xxl.css` | 515 |

The slight variation in `sm.css` (504 vs ~515) reflects its smaller property
subset — a handful of properties available in md/lg/xl/xxl are absent from sm.

---

## FCSS 2.0 migration decisions

Based on the audit above, FCSS 2.0 must resolve:

1. **Standardise on min-width throughout.** The `sm-` prefix should become a
   `min-width: 0` (or be dropped in favour of mobile-first defaults). The
   max-width pattern of legacy `sm.css` must not carry forward.

2. **Add the missing 768 px tier.** The `--md-device: 768px` token exists but
   has no corresponding breakpoint file. FCSS 2.0 breakpoints are:
   `sm` (576), `md` (768), `lg` (992), `xl` (1200), `xxl` (1400) — all min-width.

3. **Resolve the 576 px overlap.** Since FCSS 2.0 uses min-width exclusively,
   there is no overlap: each prefix activates at its own floor and cascades
   upward naturally.

4. **Ensure all generics properties are available at all breakpoints** (or
   explicitly document which are excluded and why).

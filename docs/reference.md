# Reference

This document lists the CSS property categories covered by FCSS. The full utility set is generated from the spec catalog. Use `fcss list` to explore all available classes, or `fcss explain <class>` to see the CSS declaration for a specific class.

## Using the CLI

```bash
# List all classes for a property
npx fcss list --property display

# Explain a specific class
npx fcss explain display--flex

# Search by property or value
npx fcss list --search flex
```

## Coverage index

### Box model

| Property         | Example class                                                       |
| ---------------- | ------------------------------------------------------------------- |
| `display`        | `display--flex`, `display--grid`, `display--block`, `display--none` |
| `box-sizing`     | `box-sizing--border-box`                                            |
| `width`          | `width--100`, `width--auto`, `width--100vw`                         |
| `min-width`      | `min-width--0`, `min-width--100`                                    |
| `max-width`      | `max-width--100`, `max-width--none`                                 |
| `height`         | `height--100`, `height--auto`, `height--100vh`                      |
| `min-height`     | `min-height--0`, `min-height--100vh`                                |
| `max-height`     | `max-height--100`, `max-height--none`                               |
| `padding`        | `padding--0`, `padding--1rem`, `padding--8px`                       |
| `padding-top`    | `padding-top--0`, `padding-top--1rem`                               |
| `padding-right`  | `padding-right--0`, `padding-right--1rem`                           |
| `padding-bottom` | `padding-bottom--0`, `padding-bottom--1rem`                         |
| `padding-left`   | `padding-left--0`, `padding-left--1rem`                             |
| `margin`         | `margin--0`, `margin--auto`, `margin--1rem`                         |
| `margin-top`     | `margin-top--0`, `margin-top--auto`                                 |
| `margin-right`   | `margin-right--0`, `margin-right--auto`                             |
| `margin-bottom`  | `margin-bottom--0`, `margin-bottom--auto`                           |
| `margin-left`    | `margin-left--0`, `margin-left--auto`                               |
| `overflow`       | `overflow--hidden`, `overflow--auto`, `overflow--scroll`            |
| `overflow-x`     | `overflow-x--hidden`, `overflow-x--auto`                            |
| `overflow-y`     | `overflow-y--hidden`, `overflow-y--auto`                            |

### Flexbox

| Property          | Example class                                                            |
| ----------------- | ------------------------------------------------------------------------ |
| `flex`            | `flex--1`, `flex--auto`, `flex--none`                                    |
| `flex-direction`  | `flex-direction--row`, `flex-direction--column`                          |
| `flex-wrap`       | `flex-wrap--wrap`, `flex-wrap--nowrap`                                   |
| `flex-grow`       | `flex-grow--0`, `flex-grow--1`                                           |
| `flex-shrink`     | `flex-shrink--0`, `flex-shrink--1`                                       |
| `flex-basis`      | `flex-basis--auto`, `flex-basis--0`                                      |
| `align-items`     | `align-items--center`, `align-items--flex-start`, `align-items--stretch` |
| `align-self`      | `align-self--center`, `align-self--auto`                                 |
| `align-content`   | `align-content--center`, `align-content--flex-start`                     |
| `justify-content` | `justify-content--center`, `justify-content--space-between`              |
| `justify-items`   | `justify-items--center`, `justify-items--start`                          |
| `justify-self`    | `justify-self--center`, `justify-self--auto`                             |
| `gap`             | `gap--0`, `gap--1rem`, `gap--8px`                                        |
| `column-gap`      | `column-gap--0`, `column-gap--1rem`                                      |
| `row-gap`         | `row-gap--0`, `row-gap--1rem`                                            |
| `order`           | `order--0`, `order--1`, `order--last`                                    |

### Grid

| Property                | Example class                                                       |
| ----------------------- | ------------------------------------------------------------------- |
| `grid-template-columns` | `grid-template-columns--1fr`, `grid-template-columns--repeat-3-1fr` |
| `grid-template-rows`    | `grid-template-rows--auto`                                          |
| `grid-template-areas`   | — (use `c-` for named areas)                                        |
| `grid-column`           | `grid-column--1`, `grid-column--1--3`, `grid-column--span-2`        |
| `grid-row`              | `grid-row--1`, `grid-row--span-2`                                   |
| `grid-auto-flow`        | `grid-auto-flow--row`, `grid-auto-flow--column`                     |
| `grid-auto-columns`     | `grid-auto-columns--1fr`                                            |
| `grid-auto-rows`        | `grid-auto-rows--auto`, `grid-auto-rows--1fr`                       |

### Positioning

| Property   | Example class                                                                     |
| ---------- | --------------------------------------------------------------------------------- |
| `position` | `position--relative`, `position--absolute`, `position--fixed`, `position--sticky` |
| `top`      | `top--0`, `top--auto`, `top--50`                                                  |
| `right`    | `right--0`, `right--auto`                                                         |
| `bottom`   | `bottom--0`, `bottom--auto`                                                       |
| `left`     | `left--0`, `left--auto`                                                           |
| `z-index`  | `z-index--0`, `z-index--1`, `z-index--10`, `z-index--100`                         |
| `inset`    | `inset--0`, `inset--auto`                                                         |

### Typography

| Property          | Example class                                                                     |
| ----------------- | --------------------------------------------------------------------------------- |
| `font-family`     | `font-family--inherit`, `font-family--monospace`                                  |
| `font-size`       | `font-size--1rem`, `font-size--0-875rem`, `font-size--2rem`                       |
| `font-weight`     | `font-weight--400`, `font-weight--500`, `font-weight--700`                        |
| `font-style`      | `font-style--normal`, `font-style--italic`                                        |
| `line-height`     | `line-height--1`, `line-height--1-5`, `line-height--2`                            |
| `letter-spacing`  | `letter-spacing--0`, `letter-spacing--0-05em`                                     |
| `text-align`      | `text-align--left`, `text-align--center`, `text-align--right`                     |
| `text-decoration` | `text-decoration--none`, `text-decoration--underline`                             |
| `text-transform`  | `text-transform--none`, `text-transform--uppercase`, `text-transform--capitalize` |
| `text-overflow`   | `text-overflow--ellipsis`, `text-overflow--clip`                                  |
| `white-space`     | `white-space--nowrap`, `white-space--normal`                                      |
| `word-break`      | `word-break--normal`, `word-break--break-all`                                     |
| `vertical-align`  | `vertical-align--middle`, `vertical-align--top`                                   |

### Color and background

| Property           | Example class                                              |
| ------------------ | ---------------------------------------------------------- |
| `color`            | `color--black`, `color--white`, `color--inherit`           |
| `background-color` | `background-color--transparent`, `background-color--white` |
| `background`       | `background--none`, `background--transparent`              |
| `opacity`          | `opacity--0`, `opacity--0-5`, `opacity--1`                 |

### Border

| Property         | Example class                                                       |
| ---------------- | ------------------------------------------------------------------- |
| `border`         | `border--none`, `border--0`                                         |
| `border-width`   | `border-width--0`, `border-width--1px`                              |
| `border-style`   | `border-style--solid`, `border-style--dashed`, `border-style--none` |
| `border-color`   | `border-color--transparent`, `border-color--black`                  |
| `border-radius`  | `border-radius--0`, `border-radius--0-25rem`, `border-radius--50`   |
| `border-top`     | `border-top--none`, `border-top--0`                                 |
| `border-right`   | `border-right--none`                                                |
| `border-bottom`  | `border-bottom--none`                                               |
| `border-left`    | `border-left--none`                                                 |
| `outline`        | `outline--none`, `outline--0`                                       |
| `outline-offset` | `outline-offset--0`, `outline-offset--2px`                          |

### Transform and transition

| Property                     | Example class                                                            |
| ---------------------------- | ------------------------------------------------------------------------ |
| `transform`                  | `transform--none`                                                        |
| `transform-origin`           | `transform-origin--center`                                               |
| `transition`                 | `transition--none`                                                       |
| `transition-property`        | `transition-property--all`, `transition-property--opacity`               |
| `transition-duration`        | `transition-duration--0`, `transition-duration--150ms`                   |
| `transition-timing-function` | `transition-timing-function--ease`, `transition-timing-function--linear` |
| `animation`                  | `animation--none`                                                        |

### Visibility and interaction

| Property         | Example class                                                               |
| ---------------- | --------------------------------------------------------------------------- |
| `visibility`     | `visibility--visible`, `visibility--hidden`                                 |
| `pointer-events` | `pointer-events--none`, `pointer-events--auto`                              |
| `cursor`         | `cursor--pointer`, `cursor--default`, `cursor--not-allowed`, `cursor--wait` |
| `user-select`    | `user-select--none`, `user-select--auto`, `user-select--text`               |
| `appearance`     | `appearance--none`, `appearance--auto`                                      |
| `resize`         | `resize--none`, `resize--both`, `resize--vertical`                          |

### Other

| Property          | Example class                                                   |
| ----------------- | --------------------------------------------------------------- |
| `float`           | `float--left`, `float--right`, `float--none`                    |
| `clear`           | `clear--both`, `clear--left`, `clear--right`                    |
| `list-style`      | `list-style--none`                                              |
| `list-style-type` | `list-style-type--none`, `list-style-type--disc`                |
| `table-layout`    | `table-layout--fixed`, `table-layout--auto`                     |
| `border-collapse` | `border-collapse--collapse`, `border-collapse--separate`        |
| `caption-side`    | `caption-side--top`, `caption-side--bottom`                     |
| `object-fit`      | `object-fit--cover`, `object-fit--contain`, `object-fit--fill`  |
| `object-position` | `object-position--center`                                       |
| `aspect-ratio`    | `aspect-ratio--auto`, `aspect-ratio--1-1`, `aspect-ratio--16-9` |

## Generating the full reference

The complete reference, including all generated values, is available via the CLI:

```bash
npx fcss list --format markdown > docs/full-reference.md
```

This generates a Markdown table from the current `manifest.json`, including every supported class, its CSS output, and its status in the spec catalog.

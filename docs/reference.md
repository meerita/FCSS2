# Reference

FCSS covers 156 CSS properties. This page lists them by group, with how many values each one
has and a few examples.

To check a single class, ask the CLI. `explain` reads the same manifest the tooling uses, so it
is never out of date, and it understands states and breakpoints:

```bash
npx fcss explain md-color--red:hover
```

```text
Class:       md-color--red:hover
Property:    color
Value:       var(--fcss-color-red)
Condition:   :hover
Breakpoint:  md
Media:       @media (min-width: 768px)
Selector:    .md-color--red\:hover:hover
Declaration: color: var(--fcss-color-red)
```

`npx fcss list -p <property>` or `-c <group>` lists a property's keyword values (the group IDs
are in the headings below). It skips the numeric scales and ignores `-s` and `-b` for now, so
`fcss list -p padding` comes back empty. Use the scales below for those.

## Values

Most properties share a few scales. Learn these and you can guess most class names:

| Scale       | Classes                                       | CSS                        |
| ----------- | --------------------------------------------- | -------------------------- |
| Pixels      | `--0` to `--96` (1 to 8, 10, 12, 14, 16 … 96) | `0`, `1px` to `96px`       |
| Percentages | `--0%` to `--100%` (10, 20, 25, 30, 33 …)     | `0%` to `100%`             |
| Colors      | `--black`, `--blue`, `--light-gray` …         | `var(--fcss-color-blue)` … |
| Keywords    | whatever the property accepts                 | `display--grid` is `grid`  |

Some properties add named steps on top: `font-size--xs` to `font-size--5xl`,
`line-height--tight`, `border-radius--full`, `box-shadow--md`. The examples column below shows
the first few values of each property; `fcss explain` confirms any guess.

## Coverage

### Display and overflow (`display`)

| Property          | Values | Examples                                                                     |
| ----------------- | ------ | ---------------------------------------------------------------------------- |
| `display`         | 20     | `display--none`, `display--block`, `display--inline`                         |
| `visibility`      | 3      | `visibility--visible`, `visibility--hidden`, `visibility--collapse`          |
| `overflow`        | 4      | `overflow--visible`, `overflow--hidden`, `overflow--scroll`                  |
| `overflow-x`      | 4      | `overflow-x--visible`, `overflow-x--hidden`, `overflow-x--scroll`            |
| `overflow-y`      | 4      | `overflow-y--visible`, `overflow-y--hidden`, `overflow-y--scroll`            |
| `box-sizing`      | 2      | `box-sizing--content-box`, `box-sizing--border-box`                          |
| `float`           | 3      | `float--none`, `float--left`, `float--right`                                 |
| `clear`           | 4      | `clear--none`, `clear--left`, `clear--right`                                 |
| `resize`          | 4      | `resize--none`, `resize--both`, `resize--horizontal`                         |
| `object-fit`      | 5      | `object-fit--fill`, `object-fit--contain`, `object-fit--cover`               |
| `object-position` | 9      | `object-position--center`, `object-position--top`, `object-position--bottom` |

### Box model (`box-model`)

| Property                     | Values | Examples                                                                                          |
| ---------------------------- | ------ | ------------------------------------------------------------------------------------------------- |
| `margin-top`                 | 43     | `margin-top--auto`, `margin-top--0`, `margin-top--1`                                              |
| `margin-right`               | 43     | `margin-right--auto`, `margin-right--0`, `margin-right--1`                                        |
| `margin-bottom`              | 43     | `margin-bottom--auto`, `margin-bottom--0`, `margin-bottom--1`                                     |
| `margin-left`                | 43     | `margin-left--auto`, `margin-left--0`, `margin-left--1`                                           |
| `margin`                     | 43     | `margin--auto`, `margin--0`, `margin--1`                                                          |
| `padding-top`                | 42     | `padding-top--0`, `padding-top--1`, `padding-top--2`                                              |
| `padding-right`              | 42     | `padding-right--0`, `padding-right--1`, `padding-right--2`                                        |
| `padding-bottom`             | 42     | `padding-bottom--0`, `padding-bottom--1`, `padding-bottom--2`                                     |
| `padding-left`               | 42     | `padding-left--0`, `padding-left--1`, `padding-left--2`                                           |
| `padding`                    | 42     | `padding--0`, `padding--1`, `padding--2`                                                          |
| `border-top-width`           | 30     | `border-top-width--thin`, `border-top-width--medium`, `border-top-width--thick`                   |
| `border-right-width`         | 30     | `border-right-width--thin`, `border-right-width--medium`, `border-right-width--thick`             |
| `border-bottom-width`        | 30     | `border-bottom-width--thin`, `border-bottom-width--medium`, `border-bottom-width--thick`          |
| `border-left-width`          | 30     | `border-left-width--thin`, `border-left-width--medium`, `border-left-width--thick`                |
| `border-width`               | 30     | `border-width--thin`, `border-width--medium`, `border-width--thick`                               |
| `border-top-style`           | 10     | `border-top-style--none`, `border-top-style--hidden`, `border-top-style--dotted`                  |
| `border-right-style`         | 10     | `border-right-style--none`, `border-right-style--hidden`, `border-right-style--dotted`            |
| `border-bottom-style`        | 10     | `border-bottom-style--none`, `border-bottom-style--hidden`, `border-bottom-style--dotted`         |
| `border-left-style`          | 10     | `border-left-style--none`, `border-left-style--hidden`, `border-left-style--dotted`               |
| `border-style`               | 10     | `border-style--none`, `border-style--hidden`, `border-style--dotted`                              |
| `border-top-color`           | 17     | `border-top-color--black`, `border-top-color--white`, `border-top-color--blue`                    |
| `border-right-color`         | 17     | `border-right-color--black`, `border-right-color--white`, `border-right-color--blue`              |
| `border-bottom-color`        | 17     | `border-bottom-color--black`, `border-bottom-color--white`, `border-bottom-color--blue`           |
| `border-left-color`          | 17     | `border-left-color--black`, `border-left-color--white`, `border-left-color--blue`                 |
| `border-color`               | 17     | `border-color--black`, `border-color--white`, `border-color--blue`                                |
| `border-top-left-radius`     | 42     | `border-top-left-radius--0`, `border-top-left-radius--1`, `border-top-left-radius--2`             |
| `border-top-right-radius`    | 42     | `border-top-right-radius--0`, `border-top-right-radius--1`, `border-top-right-radius--2`          |
| `border-bottom-right-radius` | 42     | `border-bottom-right-radius--0`, `border-bottom-right-radius--1`, `border-bottom-right-radius--2` |
| `border-bottom-left-radius`  | 42     | `border-bottom-left-radius--0`, `border-bottom-left-radius--1`, `border-bottom-left-radius--2`    |
| `border-radius`              | 43     | `border-radius--full`, `border-radius--0`, `border-radius--1`                                     |
| `box-shadow`                 | 6      | `box-shadow--none`, `box-shadow--sm`, `box-shadow--md`                                            |

### Dimensions (`dimensions`)

| Property     | Values | Examples                                                                        |
| ------------ | ------ | ------------------------------------------------------------------------------- |
| `width`      | 46     | `width--auto`, `width--max-content`, `width--min-content`                       |
| `min-width`  | 45     | `min-width--max-content`, `min-width--min-content`, `min-width--fit-content`    |
| `max-width`  | 47     | `max-width--auto`, `max-width--max-content`, `max-width--min-content`           |
| `height`     | 46     | `height--auto`, `height--max-content`, `height--min-content`                    |
| `min-height` | 45     | `min-height--max-content`, `min-height--min-content`, `min-height--fit-content` |
| `max-height` | 47     | `max-height--auto`, `max-height--max-content`, `max-height--min-content`        |

### Positioning (`positioning`)

| Property   | Values | Examples                                                       |
| ---------- | ------ | -------------------------------------------------------------- |
| `position` | 5      | `position--static`, `position--relative`, `position--absolute` |
| `top`      | 43     | `top--auto`, `top--0`, `top--1`                                |
| `right`    | 43     | `right--auto`, `right--0`, `right--1`                          |
| `bottom`   | 43     | `bottom--auto`, `bottom--0`, `bottom--1`                       |
| `left`     | 43     | `left--auto`, `left--0`, `left--1`                             |
| `z-index`  | 18     | `z-index--auto`, `z-index---4`, `z-index---3`                  |

### Flexbox (`flexbox`)

| Property         | Values | Examples                                                                       |
| ---------------- | ------ | ------------------------------------------------------------------------------ |
| `flex-direction` | 4      | `flex-direction--row`, `flex-direction--row-reverse`, `flex-direction--column` |
| `flex-wrap`      | 3      | `flex-wrap--nowrap`, `flex-wrap--wrap`, `flex-wrap--wrap-reverse`              |
| `flex-flow`      | 4      | `flex-flow--row-nowrap`, `flex-flow--row-wrap`, `flex-flow--column-nowrap`     |
| `flex-grow`      | 21     | `flex-grow--0`, `flex-grow--1`, `flex-grow--0.05`                              |
| `flex-shrink`    | 21     | `flex-shrink--0`, `flex-shrink--1`, `flex-shrink--0.05`                        |
| `flex-basis`     | 47     | `flex-basis--auto`, `flex-basis--content`, `flex-basis--max-content`           |
| `flex`           | 4      | `flex--none`, `flex--auto`, `flex--1`                                          |

### Grid (`grid`)

| Property                | Values | Examples                                                                              |
| ----------------------- | ------ | ------------------------------------------------------------------------------------- |
| `grid-template-columns` | 11     | `grid-template-columns--none`, `grid-template-columns--1`, `grid-template-columns--2` |
| `grid-template-rows`    | 2      | `grid-template-rows--none`, `grid-template-rows--auto`                                |
| `grid-auto-columns`     | 4      | `grid-auto-columns--auto`, `grid-auto-columns--min`, `grid-auto-columns--max`         |
| `grid-auto-rows`        | 4      | `grid-auto-rows--auto`, `grid-auto-rows--min`, `grid-auto-rows--max`                  |
| `grid-auto-flow`        | 5      | `grid-auto-flow--row`, `grid-auto-flow--column`, `grid-auto-flow--dense`              |
| `grid-column-start`     | 18     | `grid-column-start--auto`, `grid-column-start---4`, `grid-column-start---3`           |
| `grid-column-end`       | 18     | `grid-column-end--auto`, `grid-column-end---4`, `grid-column-end---3`                 |
| `grid-row-start`        | 18     | `grid-row-start--auto`, `grid-row-start---4`, `grid-row-start---3`                    |
| `grid-row-end`          | 18     | `grid-row-end--auto`, `grid-row-end---4`, `grid-row-end---3`                          |
| `grid-column`           | 12     | `grid-column--auto`, `grid-column--span-1`, `grid-column--span-2`                     |
| `grid-row`              | 5      | `grid-row--auto`, `grid-row--span-1`, `grid-row--span-2`                              |

### Alignment and gap (`alignment`)

| Property          | Values | Examples                                                                       |
| ----------------- | ------ | ------------------------------------------------------------------------------ |
| `justify-content` | 12     | `justify-content--normal`, `justify-content--center`, `justify-content--start` |
| `align-items`     | 8      | `align-items--normal`, `align-items--stretch`, `align-items--center`           |
| `align-content`   | 13     | `align-content--normal`, `align-content--stretch`, `align-content--center`     |
| `align-self`      | 9      | `align-self--auto`, `align-self--normal`, `align-self--stretch`                |
| `justify-items`   | 9      | `justify-items--auto`, `justify-items--normal`, `justify-items--stretch`       |
| `justify-self`    | 9      | `justify-self--auto`, `justify-self--normal`, `justify-self--stretch`          |
| `place-items`     | 6      | `place-items--center`, `place-items--start`, `place-items--end`                |
| `place-self`      | 5      | `place-self--auto`, `place-self--center`, `place-self--start`                  |
| `gap`             | 27     | `gap--0`, `gap--1`, `gap--2`                                                   |
| `row-gap`         | 28     | `row-gap--normal`, `row-gap--0`, `row-gap--1`                                  |
| `column-gap`      | 28     | `column-gap--normal`, `column-gap--0`, `column-gap--1`                         |
| `order`           | 17     | `order--0`, `order---4`, `order---3`                                           |

### Typography (`typography`)

| Property                | Values | Examples                                                                                          |
| ----------------------- | ------ | ------------------------------------------------------------------------------------------------- |
| `font-family`           | 3      | `font-family--sans-serif`, `font-family--serif`, `font-family--mono`                              |
| `font-size`             | 51     | `font-size--xs`, `font-size--sm`, `font-size--base`                                               |
| `font-style`            | 3      | `font-style--normal`, `font-style--italic`, `font-style--oblique`                                 |
| `font-weight`           | 13     | `font-weight--normal`, `font-weight--bold`, `font-weight--bolder`                                 |
| `font-stretch`          | 9      | `font-stretch--normal`, `font-stretch--condensed`, `font-stretch--semi-condensed`                 |
| `font-variant`          | 2      | `font-variant--normal`, `font-variant--small-caps`                                                |
| `line-height`           | 27     | `line-height--normal`, `line-height--none`, `line-height--tight`                                  |
| `letter-spacing`        | 28     | `letter-spacing--normal`, `letter-spacing--0`, `letter-spacing--1`                                |
| `word-spacing`          | 28     | `word-spacing--normal`, `word-spacing--0`, `word-spacing--1`                                      |
| `text-align`            | 6      | `text-align--left`, `text-align--right`, `text-align--center`                                     |
| `text-indent`           | 42     | `text-indent--0`, `text-indent--1`, `text-indent--2`                                              |
| `text-transform`        | 4      | `text-transform--none`, `text-transform--capitalize`, `text-transform--uppercase`                 |
| `text-decoration-line`  | 4      | `text-decoration-line--none`, `text-decoration-line--underline`, `text-decoration-line--overline` |
| `text-decoration-style` | 5      | `text-decoration-style--solid`, `text-decoration-style--double`, `text-decoration-style--dotted`  |
| `text-decoration-color` | 1      | `text-decoration-color--currentColor`                                                             |
| `text-decoration`       | 3      | `text-decoration--none`, `text-decoration--underline`, `text-decoration--line-through`            |
| `text-overflow`         | 2      | `text-overflow--clip`, `text-overflow--ellipsis`                                                  |
| `white-space`           | 6      | `white-space--normal`, `white-space--nowrap`, `white-space--pre`                                  |
| `word-break`            | 3      | `word-break--normal`, `word-break--break-all`, `word-break--keep-all`                             |
| `overflow-wrap`         | 3      | `overflow-wrap--normal`, `overflow-wrap--break-word`, `overflow-wrap--anywhere`                   |
| `direction`             | 2      | `direction--ltr`, `direction--rtl`                                                                |
| `writing-mode`          | 3      | `writing-mode--horizontal-tb`, `writing-mode--vertical-rl`, `writing-mode--vertical-lr`           |

### Color (`color`)

| Property           | Values | Examples                                                                       |
| ------------------ | ------ | ------------------------------------------------------------------------------ |
| `color`            | 17     | `color--black`, `color--white`, `color--blue`                                  |
| `background-color` | 17     | `background-color--black`, `background-color--white`, `background-color--blue` |
| `opacity`          | 21     | `opacity--0`, `opacity--0.05`, `opacity--0.1`                                  |

### Background (`background`)

| Property                | Values | Examples                                                                                            |
| ----------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| `background-image`      | 1      | `background-image--none`                                                                            |
| `background-position`   | 9      | `background-position--center`, `background-position--top`, `background-position--bottom`            |
| `background-size`       | 3      | `background-size--auto`, `background-size--cover`, `background-size--contain`                       |
| `background-repeat`     | 6      | `background-repeat--no-repeat`, `background-repeat--repeat`, `background-repeat--repeat-x`          |
| `background-origin`     | 3      | `background-origin--padding-box`, `background-origin--border-box`, `background-origin--content-box` |
| `background-clip`       | 4      | `background-clip--padding-box`, `background-clip--border-box`, `background-clip--content-box`       |
| `background-attachment` | 3      | `background-attachment--scroll`, `background-attachment--fixed`, `background-attachment--local`     |

### Table borders (`border`)

| Property          | Values | Examples                                                      |
| ----------------- | ------ | ------------------------------------------------------------- |
| `border-collapse` | 2      | `border-collapse--collapse`, `border-collapse--separate`      |
| `border-spacing`  | 27     | `border-spacing--0`, `border-spacing--1`, `border-spacing--2` |

### Lists (`lists`)

| Property              | Values | Examples                                                                    |
| --------------------- | ------ | --------------------------------------------------------------------------- |
| `list-style-type`     | 12     | `list-style-type--none`, `list-style-type--disc`, `list-style-type--circle` |
| `list-style-position` | 2      | `list-style-position--inside`, `list-style-position--outside`               |
| `list-style-image`    | 1      | `list-style-image--none`                                                    |

### Tables (`tables`)

| Property       | Values | Examples                                    |
| -------------- | ------ | ------------------------------------------- |
| `caption-side` | 2      | `caption-side--top`, `caption-side--bottom` |
| `empty-cells`  | 2      | `empty-cells--show`, `empty-cells--hide`    |
| `table-layout` | 2      | `table-layout--auto`, `table-layout--fixed` |

### Multi-column (`columns`)

| Property            | Values | Examples                                                                            |
| ------------------- | ------ | ----------------------------------------------------------------------------------- |
| `column-count`      | 12     | `column-count--auto`, `column-count--1`, `column-count--2`                          |
| `column-width`      | 28     | `column-width--auto`, `column-width--0`, `column-width--1`                          |
| `column-rule-width` | 30     | `column-rule-width--thin`, `column-rule-width--medium`, `column-rule-width--thick`  |
| `column-rule-style` | 10     | `column-rule-style--none`, `column-rule-style--hidden`, `column-rule-style--dotted` |
| `column-rule-color` | 17     | `column-rule-color--black`, `column-rule-color--white`, `column-rule-color--blue`   |
| `column-rule`       | 1      | `column-rule--none`                                                                 |
| `column-fill`       | 3      | `column-fill--auto`, `column-fill--balance`, `column-fill--balance-all`             |
| `column-span`       | 2      | `column-span--none`, `column-span--all`                                             |

### Transforms (`transforms`)

| Property           | Values | Examples                                                                           |
| ------------------ | ------ | ---------------------------------------------------------------------------------- |
| `transform`        | 17     | `transform--none`, `transform--flip-x`, `transform--flip-y`                        |
| `transform-origin` | 9      | `transform-origin--center`, `transform-origin--top`, `transform-origin--top-right` |

### Transitions (`transitions`)

| Property                     | Values | Examples                                                                                                        |
| ---------------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| `transition`                 | 6      | `transition--none`, `transition--all`, `transition--colors`                                                     |
| `transition-property`        | 6      | `transition-property--none`, `transition-property--all`, `transition-property--colors`                          |
| `transition-duration`        | 8      | `transition-duration--75`, `transition-duration--100`, `transition-duration--150`                               |
| `transition-timing-function` | 7      | `transition-timing-function--ease`, `transition-timing-function--linear`, `transition-timing-function--ease-in` |
| `transition-delay`           | 8      | `transition-delay--75`, `transition-delay--100`, `transition-delay--150`                                        |

### Animation (`animation`)

| Property                    | Values | Examples                                                                                                     |
| --------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| `animation`                 | 5      | `animation--none`, `animation--spin`, `animation--ping`                                                      |
| `animation-duration`        | 8      | `animation-duration--75`, `animation-duration--100`, `animation-duration--150`                               |
| `animation-timing-function` | 7      | `animation-timing-function--ease`, `animation-timing-function--linear`, `animation-timing-function--ease-in` |
| `animation-delay`           | 8      | `animation-delay--75`, `animation-delay--100`, `animation-delay--150`                                        |
| `animation-iteration-count` | 12     | `animation-iteration-count--infinite`, `animation-iteration-count--1`, `animation-iteration-count--2`        |
| `animation-direction`       | 4      | `animation-direction--normal`, `animation-direction--reverse`, `animation-direction--alternate`              |
| `animation-fill-mode`       | 4      | `animation-fill-mode--none`, `animation-fill-mode--forwards`, `animation-fill-mode--backwards`               |
| `animation-play-state`      | 2      | `animation-play-state--running`, `animation-play-state--paused`                                              |

### UI and outline (`ui`)

| Property         | Values | Examples                                                                |
| ---------------- | ------ | ----------------------------------------------------------------------- |
| `cursor`         | 36     | `cursor--auto`, `cursor--default`, `cursor--pointer`                    |
| `pointer-events` | 2      | `pointer-events--auto`, `pointer-events--none`                          |
| `user-select`    | 5      | `user-select--none`, `user-select--auto`, `user-select--text`           |
| `appearance`     | 2      | `appearance--none`, `appearance--auto`                                  |
| `caret-color`    | 18     | `caret-color--auto`, `caret-color--black`, `caret-color--white`         |
| `outline-width`  | 30     | `outline-width--thin`, `outline-width--medium`, `outline-width--thick`  |
| `outline-style`  | 10     | `outline-style--none`, `outline-style--hidden`, `outline-style--dotted` |
| `outline-color`  | 18     | `outline-color--invert`, `outline-color--black`, `outline-color--white` |
| `outline-offset` | 27     | `outline-offset--0`, `outline-offset--1`, `outline-offset--2`           |

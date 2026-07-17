# Syntax

FCSS class names mirror the CSS declaration they produce. If you can write the CSS, you already know the class name.

## Base form

```
property--value
```

The property name and value are separated by a double dash (`--`). Multi-word properties and values use single dashes, exactly as in CSS.

| CSS declaration                 | FCSS class                      |
| ------------------------------- | ------------------------------- |
| `color: black`                  | `color--black`                  |
| `display: flex`                 | `display--flex`                 |
| `display: inline-block`         | `display--inline-block`         |
| `background-color: transparent` | `background-color--transparent` |
| `font-weight: 700`              | `font-weight--700`              |
| `align-items: center`           | `align-items--center`           |
| `flex-direction: column`        | `flex-direction--column`        |
| `gap: 1rem`                     | `gap--1rem`                     |

## Responsive form

```
breakpoint-property--value
```

Add a breakpoint prefix to apply a utility at a specific viewport width. FCSS is **mobile-first**: unprefixed classes apply at all sizes; prefixed classes apply at the breakpoint's minimum width and above.

| Prefix | Min-width | Targets              |
| ------ | --------- | -------------------- |
| `sm-`  | 576px     | Small devices and up |
| `md-`  | 768px     | Tablets and up       |
| `lg-`  | 992px     | Desktop and up       |
| `xl-`  | 1200px    | Large desktop and up |
| `xxl-` | 1400px    | Widescreen and up    |

```html
<!-- Block on mobile, flex from tablet up -->
<div class="display--block md-display--flex"></div>
```

See [Responsive Design](./responsive.md) for the full strategy.

## State suffix form

```
property--value:pseudo-class
```

Append a colon and the pseudo-class name to apply a utility only in that state.

```html
<a class="color--blue color--red:hover">Link</a>
<button class="opacity--1 opacity--0-5:disabled">Submit</button>
<input class="border-color--gray border-color--blue:focus" />
```

Supported pseudo-classes include `hover`, `focus`, `focus-visible`, `focus-within`, `active`, `visited`, `disabled`, `checked`, `required`, `optional`, `valid`, `invalid`, `placeholder`, `first-child`, `last-child`, `nth-child`, and more.

See [States](./states.md) for the complete list.

## ARIA state form

```
property--value:aria-attribute:value
```

FCSS generates utilities for ARIA attributes so component state is expressed directly in markup without JavaScript toggling class names.

```html
<!-- Collapsed by default, visible when aria-expanded="true" -->
<div class="display--none display--block:aria-expanded:true" aria-expanded="false">
  Dropdown content
</div>
```

```html
<!-- Dimmed when aria-disabled="true" -->
<button class="opacity--1 opacity--0-5:aria-disabled:true"></button>
```

## Responsive + state form

```
breakpoint-property--value:state
```

Combine a breakpoint prefix with a state suffix:

```html
<a class="color--blue md-color--green md-color--red:hover"></a>
```

## The `c-` prefix

Any class starting with `c-` is a custom class that lives in `custom.css`. Use it when no utility class can express what you need.

```css
/* custom.css */
.c-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1.5rem;
}
```

```html
<div class="c-card">...</div>
```

Custom classes must:

- Start with `c-`
- Be defined in `custom.css`
- Not replicate what a utility class already does

See [Custom CSS](./custom-css.md) for the full guide.

## Complete pattern reference

```
[breakpoint-]property--value[:state]
```

| Pattern            | Example                          |
| ------------------ | -------------------------------- |
| Base               | `display--flex`                  |
| Responsive         | `md-display--flex`               |
| Pseudo state       | `color--red:hover`               |
| ARIA state         | `display--none:aria-hidden:true` |
| Responsive + state | `md-color--red:hover`            |
| Custom             | `c-hero-layout`                  |

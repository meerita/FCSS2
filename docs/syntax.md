# Syntax

A class name is the declaration it produces, written so it fits in a `class` attribute.

```
[breakpoint-]property--value[:state]
```

## Property and value

Two dashes separate the property from the value. Everything else is spelled the way CSS
spells it.

| CSS                             | FCSS                            |
| ------------------------------- | ------------------------------- |
| `display: flex`                 | `display--flex`                 |
| `display: inline-block`         | `display--inline-block`         |
| `background-color: transparent` | `background-color--transparent` |
| `font-weight: 700`              | `font-weight--700`              |
| `align-items: center`           | `align-items--center`           |
| `flex-direction: column`        | `flex-direction--column`        |
| `gap: 16px`                     | `gap--16`                       |
| `opacity: 0.5`                  | `opacity--0.5`                  |

Lengths are pixels, so `gap--16` is `16px`. Colors resolve to custom properties:
`color--blue` sets `color: var(--fcss-color-blue)`. When you're not sure what a class does,
`npx fcss explain <class>` (or `bunx fcss explain <class>`) prints it.

## Breakpoints

Put a breakpoint in front to apply the class from that width up. Classes without a prefix
apply at every width.

```html
<!-- block on phones, flex from 768px -->
<div class="display--block md-display--flex"></div>
```

The prefixes are `sm-` (576px), `md-` (768px), `lg-` (992px), `xl-` (1200px) and `xxl-`
(1400px). [Responsive design](./responsive.md) has the details.

## Pseudo-classes

Add a colon and the pseudo-class:

```html
<a class="color--blue color--red:hover">Link</a>
<input class="border-color--gray border-color--blue:focus" />
```

The generated pseudo-classes are `hover`, `focus`, `focus-within`, `active`, `visited`, `link`,
`checked`, `disabled`, `enabled`, `required`, `optional`, `valid`, `invalid`, `in-range`,
`out-of-range`, `read-only`, `read-write` and `indeterminate`. Not every property gets every
one; `display` gets `hover`, `focus`, `focus-within` and `active`. [States](./states.md) lists
which go where.

## ARIA states

Add the ARIA attribute and its value. The style applies while the element carries that
attribute, so your JavaScript sets `aria-expanded` and never touches the class list.

```html
<div class="display--none display--block:aria-expanded:true" aria-expanded="false">
  Dropdown content
</div>

<button class="opacity--1 opacity--0.5:aria-disabled:true" aria-disabled="true">Save</button>
```

## Breakpoint and state together

```html
<a class="color--blue md-color--red:hover"></a>
```

From 768px up, the link turns red on hover.

## Custom classes

A class starting with `c-` is yours. FCSS doesn't generate it; you write it in your own
stylesheet when one declaration isn't enough.

```css
.c-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1.5rem;
}
```

Don't use `c-` for something a utility already does. [Custom CSS](./custom-css.md) covers the
rules.

## Cheat sheet

| Form               | Example                          |
| ------------------ | -------------------------------- |
| Base               | `display--flex`                  |
| Breakpoint         | `md-display--flex`               |
| Pseudo-class       | `color--red:hover`               |
| ARIA state         | `display--none:aria-hidden:true` |
| Breakpoint + state | `md-color--red:hover`            |
| Custom             | `c-hero-layout`                  |

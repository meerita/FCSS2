# States

Add a state to any class with a colon suffix. The class only applies while the element is in
that state.

```
property--value:pseudo-class
property--value:aria-attribute:value
```

Not every property gets every state. A state is generated where it makes sense for the
property, and nowhere else. When in doubt, ask the CLI:

```bash
npx fcss explain border-color--blue:hover
npx fcss explain padding--16:hover   # "Unknown class": padding has no :hover
```

## Pseudo-classes

| Properties                                                                                              | States                                                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `color`, `background-color`, `text-decoration-*`                                                        | `hover`, `focus`, `focus-within`, `active`, `visited`, `link`                                                                                                                    |
| 36 layout and visual properties, including `display`, `width`, `border-color`, `opacity`, `font-weight` | `hover`, `focus`, `focus-within`, `active`                                                                                                                                       |
| `appearance`, `caret-color`                                                                             | `hover`, `focus`, `active`, `enabled`, `disabled`, `checked`, `indeterminate`, `required`, `optional`, `valid`, `invalid`, `in-range`, `out-of-range`, `read-only`, `read-write` |
| The remaining 112 properties (`padding`, `margin`, `font-size`, `cursor`, …)                            | none                                                                                                                                                                             |

```html
<a class="color--blue color--purple:visited color--red:hover color--orange:active">Docs</a>

<input
  class="border-color--gray border-color--blue:focus caret-color--red:invalid"
  type="email"
  required
/>
```

Browsers only let a few properties change on `:visited`, for privacy reasons. Colors work;
layout does not. That is why `:visited` only exists on the color properties.

Structural pseudo-classes (`:first-child`, `:empty`, …) and `::placeholder` are not generated.
Write those as [custom CSS](./custom-css.md).

## ARIA states

```
property--value:aria-attribute:value
```

The selector matches the attribute on the same element that carries the class:
`display--block:aria-expanded:true` compiles to
`.display--block\:aria-expanded\:true[aria-expanded='true'] { display: block }`. Your component
flips the attribute, and the styling follows. No class toggling in JavaScript.

101 properties support these attributes:

| Attribute       | Values                                                      |
| --------------- | ----------------------------------------------------------- |
| `aria-expanded` | `true`, `false`                                             |
| `aria-selected` | `true`, `false`                                             |
| `aria-checked`  | `true`, `false`, `mixed`                                    |
| `aria-pressed`  | `true`, `false`, `mixed`                                    |
| `aria-disabled` | `true`, `false`                                             |
| `aria-hidden`   | `true`, `false`                                             |
| `aria-invalid`  | `true`, `false`, `grammar`, `spelling`                      |
| `aria-current`  | `true`, `false`, `page`, `step`, `location`, `date`, `time` |

A tab:

```html
<button
  role="tab"
  aria-selected="true"
  class="color--gray color--white:aria-selected:true background-color--blue:aria-selected:true"
>
  Billing
</button>
```

The current page in a nav:

```html
<a
  href="/docs"
  aria-current="page"
  class="color--gray color--black:aria-current:page font-weight--700:aria-current:page"
>
  Docs
</a>
```

A field your validation marks as wrong:

```html
<input aria-invalid="true" class="border-color--gray border-color--red:aria-invalid:true" />
```

`aria-busy` and the other ARIA attributes are not generated.

## Responsive states

Breakpoint prefixes combine with states. The breakpoint goes first, the state last:

```html
<!-- Red on hover, from 768px up -->
<a class="color--blue md-color--red:hover">Link</a>

<!-- Shown when expanded, from 992px up -->
<div aria-expanded="true" class="display--none lg-display--block:aria-expanded:true"></div>
```

49 properties are not responsive (`cursor`, `transition-*`, `animation-*`, `outline-*`,
…). They have no breakpoint variants, with or without a state.

## Data attributes

`fcss.config.ts` accepts a `dataStates` field, but `fcss build` does not generate usable rules
from it yet. For now, use an ARIA state when one fits, or write the rule as
[custom CSS](./custom-css.md).

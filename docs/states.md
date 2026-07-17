# States

FCSS generates utility classes for CSS pseudo-classes and ARIA attributes. Append a colon-delimited suffix to any utility class to scope it to a state.

## Pseudo-class states

```
property--value:pseudo-class
```

### Interaction states

| Suffix | CSS selector | When it applies |
| --- | --- | --- |
| `:hover` | `:hover` | Pointer is over the element |
| `:focus` | `:focus` | Element has keyboard focus |
| `:focus-visible` | `:focus-visible` | Keyboard focus (not pointer) |
| `:focus-within` | `:focus-within` | Element or descendant has focus |
| `:active` | `:active` | Element is being activated (click/tap) |
| `:visited` | `:visited` | Link has been visited |

```html
<a class="color--blue color--purple:visited color--red:hover color--orange:active">
  Link
</a>
```

> **Note:** Browser privacy restrictions limit which properties take effect on `:visited`. Color, background-color, border-color, and outline-color are permitted; layout and size properties are not.

### Form states

| Suffix | CSS selector | When it applies |
| --- | --- | --- |
| `:disabled` | `:disabled` | Form element is disabled |
| `:enabled` | `:enabled` | Form element is enabled |
| `:checked` | `:checked` | Checkbox or radio is checked |
| `:required` | `:required` | Input has the `required` attribute |
| `:optional` | `:optional` | Input does not have `required` |
| `:valid` | `:valid` | Input passes validation |
| `:invalid` | `:invalid` | Input fails validation |
| `:placeholder` | `::placeholder` | Placeholder text |
| `:read-only` | `:read-only` | Input is not editable |
| `:read-write` | `:read-write` | Input is editable |
| `:in-range` | `:in-range` | Numeric input is within range |
| `:out-of-range` | `:out-of-range` | Numeric input is outside range |

```html
<input
  class="
    border-color--gray
    border-color--blue:focus
    border-color--red:invalid
    border-color--green:valid
    opacity--1
    opacity--0-5:disabled
  "
  type="email"
  required
/>
```

### Structural states

| Suffix | CSS selector |
| --- | --- |
| `:first-child` | `:first-child` |
| `:last-child` | `:last-child` |
| `:only-child` | `:only-child` |
| `:first-of-type` | `:first-of-type` |
| `:last-of-type` | `:last-of-type` |
| `:empty` | `:empty` |

```html
<ul>
  <li class="border-top--none:first-child padding-top--0:first-child">
    First item (no top border)
  </li>
  <li class="border-top--1px-solid-gray">Item</li>
</ul>
```

## ARIA states

```
property--value:aria-attribute:aria-value
```

FCSS generates selectors that match ARIA attribute values directly. This lets you express component state in markup without JavaScript toggling class names.

### Common ARIA states

| Suffix | CSS attribute selector | When it applies |
| --- | --- | --- |
| `:aria-expanded:true` | `[aria-expanded="true"]` | Disclosure is open |
| `:aria-expanded:false` | `[aria-expanded="false"]` | Disclosure is closed |
| `:aria-selected:true` | `[aria-selected="true"]` | Tab or option is selected |
| `:aria-checked:true` | `[aria-checked="true"]` | Custom checkbox is checked |
| `:aria-disabled:true` | `[aria-disabled="true"]` | Element is semantically disabled |
| `:aria-hidden:true` | `[aria-hidden="true"]` | Element is hidden from assistive tech |
| `:aria-current:page` | `[aria-current="page"]` | Navigation item is current page |
| `:aria-pressed:true` | `[aria-pressed="true"]` | Toggle button is pressed |
| `:aria-busy:true` | `[aria-busy="true"]` | Element is loading |
| `:aria-invalid:true` | `[aria-invalid="true"]` | Input has an error |

### Examples

**Dropdown panel:**

```html
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<ul
  id="menu"
  class="display--none display--block:aria-expanded:true"
  aria-expanded="false"
>
  <!-- items -->
</ul>
```

**Active navigation item:**

```html
<a
  class="color--gray color--black:aria-current:page font-weight--400 font-weight--700:aria-current:page"
  aria-current="page"
  href="/docs"
>
  Documentation
</a>
```

**Loading button:**

```html
<button
  class="opacity--1 opacity--0-6:aria-busy:true cursor--pointer cursor--wait:aria-busy:true"
  aria-busy="false"
>
  Submit
</button>
```

## Data states

You can configure custom data-attribute state classes in `fcss.config.ts`:

```ts
import { defineConfig } from '@fcss/cli';

export default defineConfig({
  dataStates: [
    { attribute: 'data-theme', values: ['light', 'dark'] },
    { attribute: 'data-state', values: ['open', 'closed', 'loading'] },
  ],
});
```

This generates selectors like:

```
.color--black:data-theme:dark  → [data-theme="dark"] .color--black
```

Run `fcss build` after adding data states.

## Combining responsive + state

```html
<!-- Red on hover only from tablet up -->
<a class="color--blue md-color--red:hover">Link</a>

<!-- Show element when expanded, but only from desktop -->
<div class="display--none lg-display--block:aria-expanded:true">
```

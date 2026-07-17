# Philosophy

> A developer who knows CSS already knows how to use FCSS.

## One class. One declaration.

Every FCSS utility class maps to exactly one CSS declaration. No exceptions.

```css
.display--flex    { display: flex; }
.gap--16px        { gap: 16px; }
.color--black     { color: black; }
```

This constraint is intentional. When a class name tells you exactly what it does, you can read markup the same way you read CSS. There is nothing to memorize beyond the CSS properties you already know.

## No shorthand vocabulary

FCSS does not introduce abbreviations. `p` is not `padding`. `bg` is not `background-color`. The class name is the CSS property name.

| Other frameworks | FCSS |
| --- | --- |
| `p-4` | `padding--1rem` |
| `bg-gray-100` | `background-color--gray` |
| `flex` | `display--flex` |
| `font-bold` | `font-weight--700` |

If you know the CSS property, you know the FCSS class. No lookup table required.

## No hidden multi-property behavior

A class that sets `display: flex` sets only `display: flex`. It does not also set `flex-direction`, `align-items`, or any other property. What you see in the class name is the complete list of what the class does.

## Full set plus purge

FCSS ships a complete pre-generated utility set covering the CSS3 property catalog. You import the full set during development for the best authoring experience, then run the purge step before production to strip every class your markup does not use.

This means:
- No waiting for a build to see a new class.
- No configuration to enable a property.
- Production output is only as large as the classes you actually used.

## The `c-` rule

When a utility class does not fit — multi-property rules, keyframes, complex selectors — FCSS provides an escape hatch: the `c-` prefix. Any class starting with `c-` lives in `custom.css` and is written as normal CSS.

```css
/* custom.css */
.c-card-hero {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
}
```

Use `c-` sparingly. A project with many `c-` classes is a signal that the component design needs attention, not that you need more custom classes.

## Why not Tailwind?

Tailwind is a different philosophy. It introduces a proprietary shorthand vocabulary (`p-4`, `bg-gray-100`, `font-bold`) that you must learn independently of CSS. FCSS rejects that trade-off. CSS knowledge transfers directly to FCSS class names — no translation layer.

FCSS also does not support arbitrary values in markup (`bg-[#1a2b3c]`). Values come from the generated set or from CSS custom properties in `root.css`. This keeps the build deterministic and the markup readable.

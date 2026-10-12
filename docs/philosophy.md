# Philosophy

If you know CSS, you know FCSS. Everything below follows from that.

## One class, one declaration

```css
.display--flex {
  display: flex;
}
.gap--16 {
  gap: 16px;
}
.font-weight--700 {
  font-weight: 700;
}
```

A class never sets a second property behind your back. `display--flex` does not also set
`flex-direction` or `align-items`. When you read the markup, you are reading the CSS.

## No shorthand

`p` is not a CSS property, so it is not an FCSS prefix either. The class name is the property
name.

| Elsewhere     | FCSS                     |
| ------------- | ------------------------ |
| `p-4`         | `padding--16`            |
| `bg-gray-100` | `background-color--gray` |
| `flex`        | `display--flex`          |
| `font-bold`   | `font-weight--700`       |

The names are longer. You type them once and read them many times, and you never have to
look one up.

## Ship everything, purge before production

`@functionalcss/core` contains every class: each value, each state and each breakpoint. In
development you import all of it, so any class you write works immediately. No config to
enable a property, no rebuild to see it.

That full set is about 28 MB. Nobody should download that, so production builds run a purge
step that keeps only the classes your source files use. A typical page ends up with a few
kilobytes. [Purging](./purging.md) explains how it decides.

## Custom classes get a `c-` prefix

Some things don't fit in a single declaration: a card layout, a keyframe animation, a
selector that targets children. Write those as plain CSS in your own stylesheet and prefix the
class with `c-`, so anyone reading the markup can tell it apart from a utility.

```css
.c-card-hero {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
}
```

If your `c-` list keeps growing, look at the components before adding more classes.

## Why not Tailwind?

Tailwind is a good tool built on a different bet: its own vocabulary (`p-4`, `bg-gray-100`,
`font-bold`) in exchange for shorter class names. FCSS makes the opposite bet and keeps CSS
names.

FCSS also has no arbitrary values in markup, so there is no `bg-[#1a2b3c]`. Values come from
the generated set or from the custom properties in `root.css`. The output depends only on the
spec, which keeps builds deterministic.

# Custom CSS

Some styles are not one property and one value. A card layout, a `:nth-child(odd)` stripe, a
`@keyframes` animation. Those go in your own stylesheet, in classes prefixed with `c-`.

FCSS does not ship or generate this file. It is yours. Call it whatever you like; these docs
say `custom.css`.

## When to reach for `c-`

- The rule sets several declarations that always travel together.
- The selector is more than a class: descendants, `:nth-child()`, `:first-child`, `::placeholder`.
- It needs `@keyframes`, `@supports` or a container query.
- It defines project tokens (custom properties).

If a utility already does it, use the utility. `c-display-flex` is just `display--flex` with
extra steps.

```css
/* custom.css */
.c-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.c-zebra > :nth-child(odd) {
  background-color: var(--fcss-color-lightest-gray);
}
```

```html
<article class="c-card background-color--white">
  <img src="avatar.png" class="border-radius--50%" alt="" />
  <div>
    <h2 class="font-size--xl font-weight--600">Ada Lovelace</h2>
    <p class="color--gray">Analyst</p>
  </div>
</article>
```

## Naming

Start with `c-`, use kebab-case, and name what the thing _is_, not how it looks.
`.c-sidebar-nav` will still be correct after a redesign. `.c-white-rounded-box` will not.

## Load it after FCSS

FCSS utilities have no `!important`. When two rules set the same property on the same element,
the one that comes later in the stylesheet wins. Import your file after FCSS, so a `c-` class
beats a utility it overlaps with:

```js
import '@functionalcss/core/full.css';
import './custom.css';
```

The same rule applies between two utilities. The order in your `class` attribute does not
matter; the order in the stylesheet does:

```html
<!-- White: .color--white comes after .color--black in utilities.css -->
<p class="color--black color--white">…</p>
```

Don't put two classes for the same property on one element. Pick one in code:

```tsx
<p className={isError ? 'color--red' : 'color--black'}>{message}</p>
```

Keep both class names as full strings, like above. The purge step reads your source, and it
cannot finish `color--${tone}` for you. See [Purging](./purging.md#write-class-names-in-full).

## Keep it small

A healthy project has a handful of `c-` classes. If `custom.css` keeps growing, you are
writing a second CSS framework, and nobody asked for one. Usually one of these is true:

- The component wants to be split into smaller pieces that utilities can handle.
- The same layout shows up everywhere and should be a component, not a class.
- FCSS is missing a value you need. Open an issue.

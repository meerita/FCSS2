# Custom CSS

The `c-` prefix is the FCSS escape hatch for rules that cannot be expressed as a single utility class.

## When to use `c-`

Use `c-` when you need:

- **Multi-property rules** — a component layout that sets several declarations together
- **Complex selectors** — descendant selectors, `:nth-child(odd)`, etc.
- **Keyframe animations** — `@keyframes` cannot be a utility class
- **CSS custom property definitions** — project-specific token overrides

Do not use `c-` to replicate what a utility class already does. `c-display-flex` is wrong; `display--flex` is right.

## Writing a custom class

All `c-` classes live in `custom.css`. This file is imported last, so it has the highest precedence in the cascade without needing `!important`.

```css
/* custom.css */
.c-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.c-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}
```

```html
<article class="c-card background-color--white">
  <img src="..." class="border-radius--50" />
  <div>
    <h2 class="font-size--1-25rem font-weight--600">Title</h2>
    <p class="color--gray">Body text</p>
  </div>
</article>
```

## Naming convention

Custom class names must:

- Start with `c-`
- Use kebab-case after the prefix
- Describe what the class is for, not what it looks like

```css
/* Good */
.c-sidebar-nav { ... }
.c-page-header { ... }
.c-toast-container { ... }

/* Bad — describes appearance, not purpose */
.c-flex-center-gap { ... }
.c-white-rounded-box { ... }
```

## The cascade and `custom.css`

The import order guarantees that `c-` classes win:

```
generics.css → sm.css → … → xxl.css → custom.css  ← highest
```

This means a `c-` class always overrides a utility class when both set the same property on the same element. Use that intentionally and sparingly.

## Inheritance conflicts

FCSS utility classes do not use `!important`. Because of cascade order, the last rule for a given property wins. If you place two classes on the same element that both set `color`, the one defined later in the stylesheet wins — regardless of the order in your markup.

```html
<!-- color--white wins because it is declared after color--black in generics.css -->
<p class="color--black color--white">This text is white</p>
```

If you need to override a utility with another utility, use a `c-` class or restructure the component logic to apply the correct class conditionally:

```tsx
<p className={`color--${isError ? 'red' : 'black'}`}>
  Message
</p>
```

## Keeping custom classes under control

A healthy project has few `c-` classes. If you find yourself writing many of them, it usually means:

- The component should be split into smaller pieces, each styled with utilities.
- The design uses a repeating layout pattern that should be a component, not a class.
- The utility set is missing a value you need — consider opening an issue to add it.

If your `custom.css` grows large, review it against these questions:

1. Does this rule set more than three properties? Consider splitting.
2. Is this rule used in exactly one place? It belongs inline via utilities, not in a shared file.
3. Is this rule a layout primitive that appears everywhere? It is a good candidate for a component.

# Responsive design

FCSS is mobile-first. A class without a prefix applies at every width. A prefixed class applies
from its breakpoint up, using `min-width` media queries.

| Prefix   | From   |
| -------- | ------ |
| _(none)_ | 0      |
| `sm-`    | 576px  |
| `md-`    | 768px  |
| `lg-`    | 992px  |
| `xl-`    | 1200px |
| `xxl-`   | 1400px |

## Writing responsive markup

Write the phone layout first, then add prefixed classes for the widths where it changes.

```html
<!-- one column on phones, two from 768px, three from 992px -->
<div
  class="display--grid grid-template-columns--1 md-grid-template-columns--2 lg-grid-template-columns--3"
></div>

<!-- hidden on phones, shown from 768px -->
<nav class="display--none md-display--flex"></nav>

<!-- 24px, then 32px, then 48px -->
<h1 class="font-size--24 md-font-size--32 lg-font-size--48">Headline</h1>
```

`grid-template-columns--2` is `repeat(2, minmax(0, 1fr))`, which is usually what you want.

Prefixes combine with states:

```html
<!-- turns red on hover, but only from 768px up -->
<a class="color--blue md-color--red:hover"></a>
```

## Loading only some breakpoints

`full.css` includes every breakpoint. If you import the files one by one instead, you can leave
out the breakpoints you don't use:

```js
import '@functionalcss/core/reset.css';
import '@functionalcss/core/root.css';
import '@functionalcss/core/utilities.css';
import '@functionalcss/core/states/pseudo.css';
import '@functionalcss/core/states/aria.css';
import '@functionalcss/core/breakpoints/md.css';
import '@functionalcss/core/breakpoints/lg.css';
```

Each breakpoint file is about 4.6 MB before purging, so dropping the ones you don't need makes
development builds noticeably lighter. After purging it makes no difference: unused classes are
gone either way.

## Order matters

A base class and its breakpoint variant have the same specificity, so the one loaded last
wins. Keep this order, which is also the order inside `full.css`:

```
reset.css, root.css, utilities.css, states/pseudo.css, states/aria.css,
breakpoints/sm.css, md.css, lg.css, xl.css, xxl.css
```

Breakpoints go last and in ascending order, so a wider breakpoint overrides a narrower one.
Load your own `c-` classes after all of them.

## Custom breakpoints

You can declare extra breakpoints in `fcss.config.ts`:

```ts
import { defineConfig } from '@functionalcss/cli';

export default defineConfig({
  breakpoints: {
    xs: { minWidth: 400 },
    wide: { minWidth: 1600 },
  },
});
```

Be aware of what this does today. `fcss build` writes an empty `@media` block for each one into
`.fcss/generated.css`, for you to fill in. It does not generate `xs-` or `wide-` utility
classes.

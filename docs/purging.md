# Purging

`@functionalcss/core/full.css` has every class, every state and every breakpoint: 326,313
selectors, about 28 MB. Great for development. Not something you send to a phone.

Purging scans your source, finds the FCSS classes you actually use, and drops the rest. A typical
app ends up with a few KB. The purge step prints what it did:

```
[@functionalcss/postcss] Purge: 342/326313 selectors retained (325971 removed, 99.9% reduction, 21.4 KB → 4.9 KB gz).
```

The framework integrations purge on production builds only. In development you get the full
set, so a class works the moment you type it.

| Setup       | Purges when                      |
| ----------- | -------------------------------- |
| Vite, Astro | `vite build` / `astro build`     |
| Next.js     | `next build` (`--webpack` on 16) |
| Angular     | `npm run build`                  |
| PostCSS     | every run, unless you gate it    |
| CLI         | you run `fcss purge`             |

## Write class names in full

The scanner reads source text. It does not run your code, so it only finds class names written
out in full.

In HTML, Angular templates and `.astro` files it reads `class` attributes.

In `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs` and `.cjs` files it reads every string literal, wherever
it sits: `'...'`, `"..."`, and the static text of a template literal (the parts between the
`${…}` expressions). It splits each one on whitespace, and every token that matches an FCSS
class counts as used. All of these work:

```tsx
<div className="display--flex align-items--center" />
<div className={isOpen ? 'display--block' : 'display--none'} />
<div className={clsx('display--flex', { 'display--none': hidden })} />

const PADDING_CLASSES = { 16: 'padding--16', 24: 'padding--24' } as const; // a typed map
export const BUTTON_BASE = 'display--inline-flex ' + 'gap--8';               // a constant
const row = `display--flex ${gap} md-display--none`;                        // static parts
<div className={joinClassNames(PADDING_CLASSES[padding], BUTTON_BASE)} />;  // any function
```

A word that is not an FCSS class, such as `'hello world'`, is ignored. A string that happens to
hold an FCSS class name but is never used as a class keeps that one class in the CSS. That costs
a few bytes; it never drops a class you use.

Comments are skipped: a class that appears only in a comment is purged. Regex literals are skipped
too.

It does not find a class built from parts at runtime:

```tsx
<div className={`display--${mode}`} />; // "display--" + mode is not a class name
const size = 'padding--' + 16; // neither is this
```

Write each class name in full and pick between them instead, with a map or a ternary. The Vite
and Astro plugins warn about a dynamic fragment inside `className`, `clsx()`, `cn()` or
`classnames()` in dev, and `fcss audit` reports it. Vue and Svelte files are not scanned yet.

## Safelist

For classes you can't write out in full, add them to `fcss.config.ts`. They survive the purge
whether the scanner finds them or not.

```ts
import { defineConfig } from '@functionalcss/cli';

export default defineConfig({
  content: ['src/**/*.{ts,tsx,html}'],
  safelist: [
    'display--none',
    'display--block',
    { pattern: /^color--/ }, // every color utility
  ],
});
```

Vite, Astro, Next.js and `fcss purge` read this file. If you call the PostCSS plugin yourself,
pass `safelist: { exact: [...], patterns: [...] }` to it instead. The Angular purge script does
not read the safelist; edit `fcss-purge.mjs` if you need one there.

## With the CLI

`fcss purge` scans the `content` globs from `fcss.config.ts` and writes a purged copy:

```bash
npx fcss purge -i node_modules/@functionalcss/core/dist/full.css -o dist/fcss.css

# Also write a JSON report: what was kept, what was removed
npx fcss purge -i node_modules/@functionalcss/core/dist/full.css -o dist/fcss.css --report-json fcss-report.json
```

## With PostCSS

```js
// postcss.config.mjs
import { createRequire } from 'node:module';
import fcss from '@functionalcss/postcss';

const require = createRequire(import.meta.url);

export default {
  plugins: [
    process.env.NODE_ENV === 'production' &&
      fcss({
        manifest: require.resolve('@functionalcss/core/manifest.json'),
        content: ['src/**/*.{ts,tsx,html}'],
      }),
  ].filter(Boolean),
};
```

The plugin purges every time it runs. The `NODE_ENV` check keeps the full set in development.

## With Vite

`@functionalcss/vite` purges on `vite build`. By default it scans
`src/**/*.{html,js,jsx,ts,tsx}`; pass your own globs if your markup lives elsewhere:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { fcss } from '@functionalcss/vite';

export default defineConfig({
  plugins: [fcss({ config: { content: ['index.html', 'src/**/*.{ts,tsx}'] } })],
});
```

## Checking your source

`fcss audit` scans the same files and reports two things: dynamic class fragments the purge
will miss, and deprecated classes.

```bash
npx fcss audit
```

Each finding is one line with its type (`dynamic-fragment` or `deprecated-class`), the fragment
or class, and the file. It exits with code 1 only when it reports an error, such as a missing `@functionalcss/core`.

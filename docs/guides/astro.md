# Astro Guide

`@functionalcss/astro` plugs `@functionalcss/vite` into Astro's Vite config. Astro builds with
Vite, so there's nothing else to it: same scanner, same purge, plus `.astro` in the default
content globs.

## Install

```bash
npm install @functionalcss/core @functionalcss/astro
# or
bun add @functionalcss/core @functionalcss/astro
```

## Configure

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import fcss from '@functionalcss/astro';

export default defineConfig({
  integrations: [fcss()],
});
```

With no configuration, it scans `src/**/*.{html,js,jsx,ts,tsx,astro}`. To change that, pass
`fcss({ config: { content, safelist } })` or create an `fcss.config.ts`:

```ts
// fcss.config.ts
import type { FcssViteConfig } from '@functionalcss/astro';

const config: FcssViteConfig = {
  content: ['src/**/*.astro', '!node_modules/**'],
  safelist: ['display--none', 'display--block'],
};

export default config;
```

## Import the stylesheet

Astro has no single entry file, so import the CSS in a layout's frontmatter. Every page that
uses the layout gets it.

```astro
---
// src/layouts/Layout.astro
import '@functionalcss/core/full.css';
---

<html lang="en">
  <body>
    <slot />
  </body>
</html>
```

## Using classes

```astro
---
// src/pages/index.astro
import Layout from '../layouts/Layout.astro';
---

<Layout>
  <main class="display--flex flex-direction--column align-items--center gap--32 padding--64">
    <h1 class="font-size--4xl font-weight--700 color--black text-align--center">
      Write CSS. Use classes.
    </h1>
  </main>
</Layout>
```

## `class:list`

Static entries in `class:list` are scanned: strings, arrays and object keys. Anything that
builds a class name at runtime isn't.

```astro
<!-- Fine -->
<div class:list={['display--flex', 'padding--16']} />

<!-- Fine: both keys are visible, whichever way `hidden` goes -->
<div class:list={[{ 'display--none': hidden, 'display--flex': !hidden }]} />

<!-- Purged: interpolated -->
<div class:list={[`opacity--${state}`]} />
```

In dev, an interpolated entry logs a warning with the file and line. In production it's
purged unless you safelist it.

The frontmatter block (between the `---` lines) isn't scanned. A class you build there has
to reach the template as a complete string or a static `class:list` entry.

## Build

```bash
npm run build   # or: bun run build
```

Both `output: 'static'` and `output: 'server'` purge the same way, because the purge happens
in the Vite build. We've verified the `@astrojs/node` adapter. Vercel, Netlify and Cloudflare
run the same Vite build and should behave the same, but nobody has checked them one by one.

The build log shows what was kept:

```text
[@functionalcss/postcss] Purge: 18/326313 selectors retained (326295 removed, 100.0% reduction, ...)
```

## Editor support

Not for `.astro` files yet. They mix a TypeScript frontmatter with an HTML-like template, and
the language service doesn't parse that today.

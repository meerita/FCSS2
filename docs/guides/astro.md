# Astro Guide

`@fcss/astro` registers `@fcss/vite`'s plugin into Astro's Vite config to add production
CSS purging and dev-mode dynamic-fragment warnings. Astro's build pipeline is Vite, so
`@fcss/astro` does not reimplement scanning or purging — it is a thin wrapper.

## Installation

```bash
npm install @fcss/core @fcss/astro
```

## Configuration

Register the integration in `astro.config.mjs`:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import fcss from '@fcss/astro';

export default defineConfig({
  integrations: [fcss()],
});
```

`fcss()` accepts the same options as `@fcss/vite`'s `fcss()` plugin (`content`,
`safelist`). Configure them via `fcss.config.ts`:

```ts
// fcss.config.ts
import type { FcssViteConfig } from '@fcss/astro';

const config: FcssViteConfig = {
  content: ['src/**/*.astro', '!node_modules/**'],
  safelist: ['display--none', 'display--block'],
};

export default config;
```

If `fcss.config.ts` is omitted, or omits `content`, `@fcss/astro` supplies an Astro-aware
default: `src/**/*.{html,js,jsx,ts,tsx,astro}`.

## Importing CSS

Astro has no single shared entry point the way a Vite SPA has `src/main.ts` — import the
CSS from a layout's frontmatter instead, so every page that uses the layout gets it:

```astro
---
// src/layouts/Layout.astro
import '@fcss/core/full.css';
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
  <main class="display--flex flex-direction--column align-items--center gap--2rem padding--4rem">
    <h1 class="font-size--3rem font-weight--700 color--black text-align--center">
      Write CSS. Use classes.
    </h1>
  </main>
</Layout>
```

## `class:list` — static vs. dynamic

Astro's `class:list={[...]}` merge directive is scanned the same way `clsx`/`ngClass`
usage is in the JSX and Angular extractors: static string, array, and object entries are
extracted; anything that resolves a class name at runtime cannot be statically analyzed.

```astro
<!-- Safe — static array entries -->
<div class:list={['display--flex', 'padding--16']} />

<!-- Safe — static object entries; both keys are visible regardless of which branch
     `hidden` takes at runtime -->
<div class:list={[{ 'display--none': hidden, 'display--flex': !hidden }]} />

<!-- Unsafe — template literal interpolation prevents static analysis -->
<div class:list={[`opacity--${state}`]} />
```

Unsafe fragments log a dev-mode warning (file + line) and are purged in production unless
added to the safelist.

## Frontmatter is not scanned

Only the `.astro` file's template markup is scanned for classes — the `---`-delimited
frontmatter script block is not. A class name assembled in frontmatter and interpolated
into the template still needs to reach the template as a complete literal or a
`class:list` entry the extractor can statically resolve.

## Static output vs. server output

Both `output: 'static'` (SSG) and `output: 'server'` (SSR, including the `@astrojs/node`
adapter) purge the same way, since purging happens in the underlying Vite plugin during
`astro build`. Other deploy adapters (Vercel, Netlify, Cloudflare, etc.) are expected to
work the same way — they run the same Vite build — but are not individually verified.

## Production build

```bash
astro build
```

`@fcss/postcss` logs a purge summary during the build:

```
[@fcss/postcss] Purge: 18/326313 selectors retained (326295 removed, 100.0% reduction, ...)
```

## Editor support

Editor/IntelliSense support for `.astro` files (VS Code, Zed) is not yet available —
`.astro` mixes a TypeScript frontmatter with an HTML-like template, which the current
language-service integrations do not parse. This is planned as a future integration,
independent of the build-time purging covered by this guide.

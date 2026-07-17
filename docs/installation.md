# Installation

FCSS is framework-agnostic. The core package is plain generated CSS. Framework integrations add automatic purging and configuration support on top.

## Vanilla HTML / CSS

```bash
npm install @fcss/core
```

Import the full CSS set in your entry point or HTML file:

```html
<link rel="stylesheet" href="node_modules/@fcss/core/fcss.css" />
```

Or via a bundler:

```js
import '@fcss/core/fcss.css';
```

For production, run the CLI purge step to strip unused classes:

```bash
npx fcss purge --content "src/**/*.html"
```

---

## React (Create React App / custom bundler)

```bash
npm install @fcss/core
```

Import in your root entry point (`src/index.tsx` or `src/main.tsx`):

```tsx
import '@fcss/core/fcss.css';
```

Add purging via PostCSS:

```bash
npm install -D @fcss/postcss
```

```js
// postcss.config.js
const { fcssPlugin } = require('@fcss/postcss');

module.exports = {
  plugins: [
    fcssPlugin({ content: ['src/**/*.{ts,tsx}'] }),
  ],
};
```

---

## React + Vite

```bash
npm install @fcss/core
npm install -D @fcss/vite
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fcss } from '@fcss/vite';

export default defineConfig({
  plugins: [
    react(),
    fcss({ content: ['src/**/*.{ts,tsx}'] }),
  ],
});
```

Import CSS in your entry point:

```tsx
// src/main.tsx
import '@fcss/core/fcss.css';
```

---

## Next.js

```bash
npm install @fcss/core
npm install -D @fcss/next
```

Wrap your Next.js config:

```ts
// next.config.ts
import { withFcss } from '@fcss/next';

export default withFcss({
  // your existing Next.js config
});
```

Import CSS globally:

```tsx
// app/layout.tsx (App Router)
import '@fcss/core/fcss.css';

// or _app.tsx (Pages Router)
import '@fcss/core/fcss.css';
```

The plugin automatically reads content paths from `fcss.config.ts` if present, and defaults to scanning `app/**`, `pages/**`, `components/**`, and `src/**`.

See the [Next.js guide](./guides/nextjs.md) for advanced configuration.

---

## Angular

```bash
ng add @fcss/angular
```

The schematic handles the rest: adds `@fcss/core` to `angular.json` styles, installs dependencies, and optionally generates a `fcss.config.ts`.

For manual setup:

```bash
npm install @fcss/core
```

```json
// angular.json — inside your project's architect.build.options
{
  "styles": [
    "node_modules/@fcss/core/fcss.css",
    "src/styles.css"
  ]
}
```

See the [Angular guide](./guides/angular.md) for purging and schematic options.

---

## Manual modular imports

Instead of the full CSS bundle, you can import only the files you need:

```js
import '@fcss/core/dist/root.css';
import '@fcss/core/dist/normalizer.css';
import '@fcss/core/dist/generics.css';
import '@fcss/core/dist/states.css';
import '@fcss/core/dist/sm.css';
import '@fcss/core/dist/md.css';
import '@fcss/core/dist/lg.css';
import '@fcss/core/dist/xl.css';
import '@fcss/core/dist/xxl.css';
import '@fcss/core/dist/custom.css';
```

Import order matters. `root.css` and `normalizer.css` must come first. Breakpoint files (`sm`, `md`, `lg`, `xl`, `xxl`) must follow the generic file. `custom.css` must be last so that `c-` classes can override utilities when necessary.

---

## CLI

The `@fcss/cli` package provides the `fcss` command for building, purging, and inspecting utilities:

```bash
npm install -D @fcss/cli

npx fcss --help
```

Available commands:

| Command | Description |
| --- | --- |
| `fcss build` | Generate the CSS utility set from the spec |
| `fcss purge` | Remove unused classes from output CSS |
| `fcss init` | Create an `fcss.config.ts` file |
| `fcss list` | List all available utility classes |
| `fcss explain <class>` | Show the CSS declaration for a class |
| `fcss audit` | Check for unused or invalid classes in source |
| `fcss doctor` | Validate your FCSS configuration and environment |
| `fcss migrate` | Assist with migrating from the legacy TFCSSF repository |

### `fcss.config.ts`

```ts
import { defineConfig } from '@fcss/cli';

export default defineConfig({
  content: ['src/**/*.{html,ts,tsx,jsx}'],
  safelist: ['display--flex', 'display--none'],
});
```

# Purging

FCSS ships a complete pre-generated utility set. The full set is large — it covers every CSS property in the CSS3 profile across all breakpoints and states. You must remove unused classes before deploying to production.

## Why the full set is large

Every possible class is generated upfront so that authoring requires no build step. You write a class and it works immediately. The cost is that the unoptimized file contains thousands of classes you will never use in a given project.

Purging solves this. After scanning your source files, the purge step produces a CSS file containing only the classes that appear in your markup.

## Typical size reduction

A realistic project uses a few hundred utility classes. The purged output is usually between 3 KB and 15 KB, compared to the multi-megabyte full set.

Example output from a mid-size Vite project:

```
Before purge:
  dist/assets/index.css   847 kB │ gzip: 68 kB

After purge:
  dist/assets/index.css     6.1 kB │ gzip: 1.8 kB
```

## How purging works

The scanner reads your content files and extracts every string that matches the FCSS class pattern. It then filters the generated CSS to keep only the matched classes plus any safelisted classes.

FCSS uses static extraction — it reads source text, not a running application. This means classes must appear as complete literal strings in your source files.

## Static extraction requirement

The purger can only find classes that appear as complete strings in source files.

```tsx
// Safe — literal class string
<div class="display--flex align-items--center">

// Safe — conditional between two literals
<div class={isOpen ? 'display--block' : 'display--none'}>

// Unsafe — class name assembled at runtime
<div class={`${property}--${value}`}>
```

If you build class names dynamically, add those classes to the safelist.

## Safelisting

Use a safelist to protect classes from being purged even if they do not appear as literals in your source.

### In `fcss.config.ts`

```ts
import { defineConfig } from '@fcss/cli';

export default defineConfig({
  content: ['src/**/*.{ts,tsx,html}'],
  safelist: [
    'display--none',
    'display--block',
    // Pattern — all color utilities
    { pattern: /^color--/ },
  ],
});
```

### Via `@fcss/next`

```ts
// next.config.ts
import { withFcss } from '@fcss/next';

export default withFcss({
  fcss: {
    safelist: ['display--none', 'display--block'],
  },
});
```

## Purging with the CLI

```bash
# Purge using config from fcss.config.ts
npx fcss purge

# Purge with an explicit content glob
npx fcss purge --content "src/**/*.{ts,tsx}"

# Purge and write the output to a specific file
npx fcss purge --output dist/fcss.purged.css
```

## Purging with PostCSS

```bash
npm install -D @fcss/postcss
```

```js
// postcss.config.js
const { fcssPlugin } = require('@fcss/postcss');

module.exports = {
  plugins: [
    process.env.NODE_ENV === 'production' && fcssPlugin({
      content: ['src/**/*.{ts,tsx,html}'],
    }),
  ].filter(Boolean),
};
```

## Purging with Vite

The `@fcss/vite` plugin runs the purge step automatically on `vite build`:

```ts
// vite.config.ts
import { fcss } from '@fcss/vite';

export default defineConfig({
  plugins: [
    fcss({ content: ['src/**/*.{ts,tsx}'] }),
  ],
});
```

## Build report

After purging, run `fcss audit` to see which classes were kept, which were removed, and which classes in your source files did not match any known utility:

```bash
npx fcss audit --content "src/**/*.{ts,tsx}"
```

Output example:

```
✓ Kept:    342 classes
✗ Removed: 14,207 classes
⚠ Unknown: 3 classes (possible typos)
  → display--flx  (did you mean display--flex?)
  → color--blck   (did you mean color--black?)
  → c-unknwon     (not found in custom.css)
```

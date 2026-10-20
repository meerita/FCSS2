# @functionalcss/angular

## 0.1.3

### Patch Changes

- 73fe5a1: Two fixes for production builds.

  The scanner now reads every string literal in `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs` and `.cjs` files, not only the ones in `className`, `clsx()`, `cn()` and `classnames()`. It reads `'...'`, `"..."` and the static parts of template literals, splits them on whitespace, and keeps every token that is an FCSS class. Classes kept in typed maps, exported constants, strings joined with `+`, object values or arguments to your own helpers (`joinClassNames(PADDING_CLASSES[padding])`) were purged before, so components that pick their classes this way rendered without styles. Comments and regex literals are skipped, so a class that appears only in a comment is still purged. Every class the scanner found before is still found.

  `root.css` now defines `--fcss-font-family-sans-serif`, `--fcss-font-family-serif` and `--fcss-font-family-mono` with system font stacks (`system-ui, …, sans-serif`, `ui-serif, …, serif`, `ui-monospace, …, monospace`). The `font-family--*` utilities read these variables, and since nothing defined them, they fell back to the browser default font (Times in Chromium). Override any of them in a `:root` rule loaded after FCSS.

## 0.1.2

## 0.1.1

### Patch Changes

- 80b2380: - `@functionalcss/angular`: `ng add` now works. 0.1.0 shipped without the schematic's `schema.json`, blocked the Angular CLI from reading `package.json`, and added `@functionalcss/core@^0.0.0`. Production builds now purge _before_ `ng build` (`node fcss-purge.mjs && ng build`, `production` styles → `src/fcss.purged.css`), so Angular's default bundle budgets no longer fail. Supports Angular 17 – 22.
  - `@functionalcss/next`: supports Next.js 16. `next dev` works under Turbopack; production builds need `next build --webpack`, and a Turbopack production build stops with a clear error instead of shipping the unpurged stylesheet.
  - All packages expose `./package.json` in `exports`.

## 0.1.0

### Minor Changes

- 69845f5: First public release on npm under the `@functionalcss` scope.

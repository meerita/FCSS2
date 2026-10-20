# @functionalcss/astro

## 0.1.3

### Patch Changes

- 73fe5a1: Two fixes for production builds.

  The scanner now reads every string literal in `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs` and `.cjs` files, not only the ones in `className`, `clsx()`, `cn()` and `classnames()`. It reads `'...'`, `"..."` and the static parts of template literals, splits them on whitespace, and keeps every token that is an FCSS class. Classes kept in typed maps, exported constants, strings joined with `+`, object values or arguments to your own helpers (`joinClassNames(PADDING_CLASSES[padding])`) were purged before, so components that pick their classes this way rendered without styles. Comments and regex literals are skipped, so a class that appears only in a comment is still purged. Every class the scanner found before is still found.

  `root.css` now defines `--fcss-font-family-sans-serif`, `--fcss-font-family-serif` and `--fcss-font-family-mono` with system font stacks (`system-ui, …, sans-serif`, `ui-serif, …, serif`, `ui-monospace, …, monospace`). The `font-family--*` utilities read these variables, and since nothing defined them, they fell back to the browser default font (Times in Chromium). Override any of them in a `:root` rule loaded after FCSS.

- Updated dependencies [73fe5a1]
  - @functionalcss/vite@0.1.3

## 0.1.2

### Patch Changes

- 3caaf71: `@functionalcss/scanner` drops `fast-glob` for `tinyglobby`, so no FCSS package depends on `braces` any more. `braces` 3.0.3 has a high-severity advisory with no fixed release ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), stack exhaustion on deeply nested patterns), and it reached every project through `fast-glob > micromatch > braces`. The `content` patterns match the same files, with two edge cases that now match fewer: a pattern that leaves the project and comes back into it (`../**/*.tsx`), and a dot directory after a globstar (`**/.hidden/*`).
- Updated dependencies [3caaf71]
  - @functionalcss/vite@0.1.2

## 0.1.1

### Patch Changes

- @functionalcss/vite@0.1.1

## 0.1.0

### Minor Changes

- 69845f5: First public release on npm under the `@functionalcss` scope.

### Patch Changes

- Updated dependencies [69845f5]
  - @functionalcss/vite@0.1.0

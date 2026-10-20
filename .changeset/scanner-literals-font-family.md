---
'@functionalcss/scanner': patch
'@functionalcss/core': patch
'@functionalcss/next': patch
'@functionalcss/postcss': patch
'@functionalcss/vite': patch
'@functionalcss/astro': patch
'@functionalcss/angular': patch
'@functionalcss/cli': patch
---

Two fixes for production builds.

The scanner now reads every string literal in `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs` and `.cjs` files, not only the ones in `className`, `clsx()`, `cn()` and `classnames()`. It reads `'...'`, `"..."` and the static parts of template literals, splits them on whitespace, and keeps every token that is an FCSS class. Classes kept in typed maps, exported constants, strings joined with `+`, object values or arguments to your own helpers (`joinClassNames(PADDING_CLASSES[padding])`) were purged before, so components that pick their classes this way rendered without styles. Comments and regex literals are skipped, so a class that appears only in a comment is still purged. Every class the scanner found before is still found.

`root.css` now defines `--fcss-font-family-sans-serif`, `--fcss-font-family-serif` and `--fcss-font-family-mono` with system font stacks (`system-ui, …, sans-serif`, `ui-serif, …, serif`, `ui-monospace, …, monospace`). The `font-family--*` utilities read these variables, and since nothing defined them, they fell back to the browser default font (Times in Chromium). Override any of them in a `:root` rule loaded after FCSS.

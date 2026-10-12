---
'@functionalcss/cli': patch
'@functionalcss/postcss': patch
---

`fcss purge` now purges `@functionalcss/core` directly. It used to read only `.fcss/manifest.json` (custom classes from `fcss build`), so it failed without `fcss build` and left the core utilities untouched with it. It now uses the core manifest and adds the custom one when present. `@functionalcss/postcss` accepts several manifest paths in `manifest`.

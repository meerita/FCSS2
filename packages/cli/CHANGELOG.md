# @functionalcss/cli

## 0.1.1

### Patch Changes

- 2a937a4: `fcss purge` now purges `@functionalcss/core` directly. It used to read only `.fcss/manifest.json` (custom classes from `fcss build`), so it failed without `fcss build` and left the core utilities untouched with it. It now uses the core manifest and adds the custom one when present. `@functionalcss/postcss` accepts several manifest paths in `manifest`.
  - @functionalcss/generator@0.1.1
  - @functionalcss/scanner@0.1.1
  - @functionalcss/spec@0.1.1

## 0.1.0

### Minor Changes

- 69845f5: First public release on npm under the `@functionalcss` scope.

### Patch Changes

- Updated dependencies [69845f5]
  - @functionalcss/generator@0.1.0
  - @functionalcss/scanner@0.1.0
  - @functionalcss/spec@0.1.0

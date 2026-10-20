# @functionalcss/postcss

## 0.1.2

### Patch Changes

- 3caaf71: `@functionalcss/scanner` drops `fast-glob` for `tinyglobby`, so no FCSS package depends on `braces` any more. `braces` 3.0.3 has a high-severity advisory with no fixed release ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), stack exhaustion on deeply nested patterns), and it reached every project through `fast-glob > micromatch > braces`. The `content` patterns match the same files, with two edge cases that now match fewer: a pattern that leaves the project and comes back into it (`../**/*.tsx`), and a dot directory after a globstar (`**/.hidden/*`).
- Updated dependencies [3caaf71]
  - @functionalcss/scanner@0.1.2
  - @functionalcss/spec@0.1.2

## 0.1.1

### Patch Changes

- 2a937a4: `fcss purge` now purges `@functionalcss/core` directly. It used to read only `.fcss/manifest.json` (custom classes from `fcss build`), so it failed without `fcss build` and left the core utilities untouched with it. It now uses the core manifest and adds the custom one when present. `@functionalcss/postcss` accepts several manifest paths in `manifest`.
  - @functionalcss/scanner@0.1.1
  - @functionalcss/spec@0.1.1

## 0.1.0

### Minor Changes

- 69845f5: First public release on npm under the `@functionalcss` scope.

### Patch Changes

- Updated dependencies [69845f5]
  - @functionalcss/scanner@0.1.0
  - @functionalcss/spec@0.1.0

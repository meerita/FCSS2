# @functionalcss/angular

## 0.1.1

### Patch Changes

- 80b2380: - `@functionalcss/angular`: `ng add` now works. 0.1.0 shipped without the schematic's `schema.json`, blocked the Angular CLI from reading `package.json`, and added `@functionalcss/core@^0.0.0`. Production builds now purge _before_ `ng build` (`node fcss-purge.mjs && ng build`, `production` styles → `src/fcss.purged.css`), so Angular's default bundle budgets no longer fail. Supports Angular 17 – 22.
  - `@functionalcss/next`: supports Next.js 16. `next dev` works under Turbopack; production builds need `next build --webpack`, and a Turbopack production build stops with a clear error instead of shipping the unpurged stylesheet.
  - All packages expose `./package.json` in `exports`.

## 0.1.0

### Minor Changes

- 69845f5: First public release on npm under the `@functionalcss` scope.

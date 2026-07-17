# Migration

This guide covers moving a project from the legacy TFCSSF repository to FCSS 1.0.

## What changed

| Area                  | Legacy (TFCSSF)                       | FCSS 1.0                                    |
| --------------------- | ------------------------------------- | ------------------------------------------- |
| Package name          | `tfcssf` / private package            | `@fcss/core` on npm                         |
| Installation          | Manual file copy                      | `npm install @fcss/core`                    |
| CSS import            | Copy files to project                 | `import '@fcss/core/fcss.css'`              |
| Breakpoints           | Mobile-first with `max-width` on `sm` | All breakpoints use `min-width`             |
| Custom classes        | `c-` prefix in `custom.css`           | Same                                        |
| Class syntax          | `property--value`                     | Same                                        |
| Hover                 | `:hover` suffix                       | `:hover` suffix (unchanged)                 |
| ARIA states           | Not generated                         | `:aria-attribute:value` suffix              |
| CLI                   | None                                  | `@fcss/cli`                                 |
| Purging               | Manual PurgeCSS config                | `@fcss/postcss` or `fcss purge`             |
| Framework integration | Manual                                | `@fcss/next`, `@fcss/angular`, `@fcss/vite` |

## Automated migration

Run the migration command to get a report of changes needed in your project:

```bash
npx fcss migrate --content "src/**/*.{ts,tsx,html}"
```

The command will:

1. Scan your source files for legacy class names
2. Report which classes map cleanly to FCSS 1.0
3. Flag classes that have changed
4. List classes from the legacy set that have no equivalent

## Breakpoint changes

The legacy framework used `max-width` for `sm` (mobile) and `min-width` for larger breakpoints. FCSS 1.0 uses `min-width` for all breakpoints (true mobile-first).

| Breakpoint | Legacy              | FCSS 1.0                     |
| ---------- | ------------------- | ---------------------------- |
| `sm`       | `max-width: 576px`  | `min-width: 576px`           |
| `md`       | `min-width: 768px`  | `min-width: 768px` _(same)_  |
| `lg`       | `min-width: 992px`  | `min-width: 992px` _(same)_  |
| `xl`       | `min-width: 1200px` | `min-width: 1200px` _(same)_ |
| `xxl`      | `min-width: 1400px` | `min-width: 1400px` _(same)_ |

If your project used `sm-` classes for mobile-only styles (assuming `max-width` behavior), review those usages. The semantics have changed — `sm-` now means "small viewport and up", not "small viewport only".

## Class name compatibility

Most class names are identical between the legacy framework and FCSS 1.0. The `property--value` convention is unchanged.

### Classes to verify

Some legacy classes used shortened or non-standard property names. Run `fcss audit` to identify them:

```bash
npx fcss audit --content "src/**/*.{ts,tsx,html}"
```

Any class flagged as unknown should be checked against:

1. A typo in the original — fix it
2. A legacy shorthand — find the full property name equivalent
3. A class that was hand-written in the old `custom.css` — move it to `custom.css` in the new project

## Step-by-step migration

1. **Install FCSS 1.0**

   ```bash
   npm install @fcss/core
   npm install -D @fcss/cli
   ```

2. **Replace the CSS import**

   Remove manually copied CSS files. Import the package instead:

   ```diff
   - import './styles/generics.css';
   - import './styles/hovers.css';
   - import './styles/focus.css';
   - import './styles/sm.css';
   + import '@fcss/core/fcss.css';
   ```

3. **Move custom classes**

   Copy the contents of your legacy `custom.css` to the new project's `custom.css`. All `c-` classes should transfer without changes.

4. **Run the audit**

   ```bash
   npx fcss audit --content "src/**/*.{ts,tsx,html}"
   ```

   Fix any flagged classes.

5. **Review `sm-` breakpoint usage**

   If your project used `sm-` classes for mobile-only rules, test the layout at small viewports. The semantic change from `max-width` to `min-width` may require adjusting which breakpoint prefix you use.

6. **Set up purging**

   See the [Purging guide](./purging.md) to configure production build optimization.

7. **Set up the framework integration**

   - Next.js: see the [Next.js guide](./guides/nextjs.md)
   - Angular: see the [Angular guide](./guides/angular.md)
   - Vite + React: see the [Installation guide](./installation.md#react--vite)

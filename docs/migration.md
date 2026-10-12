# Migrating from TFCSSF

FCSS is the successor to the TFCSSF repository. The class syntax is the same, so most of the
work is swapping copied files for a package, and checking one breakpoint.

## What changed

| Area            | TFCSSF                           | FCSS                                              |
| --------------- | -------------------------------- | ------------------------------------------------- |
| Install         | Copy CSS files into your project | `npm install @functionalcss/core`                 |
| Import          | Your copied files                | `import '@functionalcss/core/full.css'`           |
| `sm` breakpoint | `max-width: 576px` (mobile only) | `min-width: 576px` (576px and up)                 |
| Class syntax    | `property--value`                | Same                                              |
| `:hover`        | Suffix                           | Same, plus more states                            |
| ARIA states     | None                             | `property--value:aria-attribute:value`            |
| `c-` classes    | In `custom.css`                  | Same; your own file                               |
| Purging         | Your own PurgeCSS setup          | Built into the integrations, or `fcss purge`      |
| Frameworks      | Manual                           | `@functionalcss/vite`, `next`, `astro`, `angular` |

## The one that bites: `sm-`

In TFCSSF, `sm-` meant "small screens only" (`max-width`). In FCSS every breakpoint is
`min-width`, so `sm-` now means "576px and wider". The other breakpoints did not change.

| Prefix | TFCSSF              | FCSS               |
| ------ | ------------------- | ------------------ |
| `sm`   | `max-width: 576px`  | `min-width: 576px` |
| `md`   | `min-width: 768px`  | same               |
| `lg`   | `min-width: 992px`  | same               |
| `xl`   | `min-width: 1200px` | same               |
| `xxl`  | `min-width: 1400px` | same               |

Every `sm-` class you used for a mobile-only style now does roughly the opposite. Search for
`sm-` and fix each one. A mobile-only style becomes the unprefixed class, undone at `sm`:

```html
<!-- TFCSSF: hidden on phones -->
<nav class="sm-display--none">…</nav>

<!-- FCSS: hidden by default, shown from 576px -->
<nav class="display--none sm-display--block">…</nav>
```

## Steps

1. Install the packages.

   ```bash
   npm install @functionalcss/core
   npm install -D @functionalcss/cli
   ```

2. Delete the copied CSS files and import the package instead.

   ```diff
   - import './styles/generics.css';
   - import './styles/hovers.css';
   - import './styles/focus.css';
   - import './styles/sm.css';
   + import '@functionalcss/core/full.css';
   ```

3. Keep your `custom.css`. Import it after FCSS. `c-` classes carry over unchanged. See
   [Custom CSS](./custom-css.md).

4. Fix every `sm-` class, as above.

5. Set up purging through your framework integration: [Next.js](./guides/nextjs.md),
   [Angular](./guides/angular.md), [Astro](./guides/astro.md), or
   [Vite](./installation.md). Background in [Purging](./purging.md).

6. Click through the app at a phone width and at a desktop width.

## Unknown classes

A class that FCSS does not generate simply has no styles; nothing fails. Some TFCSSF classes
used shortened or nonstandard names. Check anything that looks off:

```bash
npx fcss explain sm-display--none
```

`explain` prints the CSS for a real class and `Unknown class` for anything else. `fcss audit`
won't catch these: it reports dynamic class fragments and deprecated classes, not unknown names.

## `fcss migrate`

`fcss migrate` looks for legacy class names in your HTML, JS and TS files. It needs an inventory
of the TFCSSF classes in `legacy-classes.json` at the project root. That inventory is not
published with FCSS yet. Without it, the command says there is nothing to migrate and exits.

With an inventory in place:

```bash
npx fcss migrate             # report each match with file and line; exits 1 if any
npx fcss migrate --dry-run   # report only
npx fcss migrate --force     # apply replacements, writing a .fcss-backup copy of each file first
```

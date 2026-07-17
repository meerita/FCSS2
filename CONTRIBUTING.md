<!--
@file CONTRIBUTING.md
@description Contributor guide — setup, architecture, workflow, and standards for FCSS.
@layer root
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# Contributing to FCSS

Thank you for contributing. Please read this guide before opening a PR.

## Prerequisites

- Node.js ≥ 22
- pnpm ≥ 10 (`npm install -g pnpm`)
- Git

## Setup

```sh
git clone https://github.com/cognativinc/fcss-2.git
cd fcss-2
pnpm install
```

## Repository structure

```
apps/
  docs/             Legacy Next.js documentation site
packages/
  spec/             @fcss/spec — machine-readable CSS property specification (private)
  generator/        @fcss/generator — deterministic CSS generator (private)
  core/             @fcss/core — full generated CSS library (public)
  scanner/          @fcss/scanner — source code class name scanner (private)
  postcss/          @fcss/postcss — PostCSS purge plugin (public)
  vite/             @fcss/vite — Vite integration (public)
  next/             @fcss/next — Next.js integration (public)
  angular/          @fcss/angular — Angular integration (public)
  cli/              @fcss/cli — fcss command-line tool (public)
  language-service/ @fcss/language-service — IntelliSense engine (private)
  eslint-plugin/    @fcss/eslint-plugin — ESLint rules (public)
  vscode/           @fcss/vscode — VS Code extension (Marketplace)
examples/           Runnable integration examples (stub)
docs/decisions/     Architecture Decision Records (ADR-001 – ADR-010)
```

## Package dependency direction

Enforced — no circular dependencies:

```
spec → generator → core
spec → language-service → vscode
scanner → postcss → vite / next / angular
cli → spec + generator + scanner
```

`@fcss/core` must not depend on any framework package.

## Development workflow

```sh
pnpm run build        # build all packages
pnpm run test         # run all tests
pnpm run typecheck    # typecheck all packages
pnpm run lint         # lint all TypeScript
pnpm run fmt          # format all files
pnpm run fmt:check    # check formatting (CI gate)
```

## Adding a CSS property

1. Add the property descriptor to `packages/spec/src/` following the existing spec shape.
2. Ensure `packages/generator/src/` renders it correctly.
3. Regenerate: `pnpm run generate`.
4. Add semantic tests in `packages/core/src/__tests__/` verifying the generated selectors.
5. Update `docs/decisions/` if the new property introduces a new convention.

## Adding a new value

1. Add the value to the relevant property descriptor in `@fcss/spec`.
2. Regenerate and verify the output.
3. Add a test for the new class.

## Adding a pseudo-state or ARIA condition

1. Update the condition model in `@fcss/spec`.
2. Update the selector renderer in `@fcss/generator`.
3. Regenerate, verify selector syntax in a browser.

## Generated files

Files emitted by `@fcss/generator` are **read-only**. Never edit them manually.
Every generated CSS file begins with a read-only header comment. If you need to
change generated output, change the spec or the generator and re-run `pnpm run generate`.

## Commit format

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): summary
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`.
Scope: the package short name (`spec`, `generator`, `core`, `cli`, …) or `root`.

Examples:

```
feat(spec): add text-decoration property descriptor
fix(generator): escape percentage sign in class names
chore(root): upgrade TypeScript to 5.6
```

Keep commits atomic. Use the imperative mood.

## Pull requests

- Branch off `dev`, not `main`.
- One logical change per PR.
- Fill in a real description — what changed and why.
- All CI gates must pass before merge.
- PRs are squash-merged into `dev`.

## Changesets

Every PR that changes a published package must include a changeset:

```sh
pnpm changeset
```

Select the changed packages and the bump type. The changeset file is committed with the PR.

## Tests

- Unit tests: Vitest (`pnpm run test`).
- Browser tests: Playwright targeting Chromium, Firefox, and WebKit.
- Every new utility must have a semantic test verifying the generated selector.
- Tests must not use mocks for CSS output — assert against real generated strings.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

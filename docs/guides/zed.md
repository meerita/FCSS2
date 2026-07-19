# Zed Guide

This guide covers using FCSS IntelliSense inside the [Zed](https://zed.dev) editor via the
FCSS Zed extension — a Rust→WASM extension that launches `@fcss/lsp-server` and attaches it
to HTML, JavaScript (JSX), TSX, and TypeScript files.

## Prerequisites

### In your project

Install `@fcss/core` and `@fcss/lsp-server`:

```sh
npm install @fcss/core @fcss/lsp-server
```

Both packages must be present in your project's `node_modules`. The manifest is discovered at
`node_modules/@fcss/core/dist/manifest.json`; if it is missing, the server warns in the Zed
output panel and IntelliSense stays inactive.

Node.js must be on your `PATH`. The extension verifies this at startup and logs a clear error if
Node is not found.

### To build the extension

- **Rust** — install via [rustup](https://rustup.rs)
- **`wasm32-wasip2` target**:

```sh
rustup target add wasm32-wasip2
```

## Build

Clone or download this repository, then from `packages/zed/`:

```sh
cargo build --release --target wasm32-wasip2
```

The compiled artifact is at `packages/zed/target/wasm32-wasip2/release/fcss_zed.wasm`.

## Install as a Dev Extension in Zed

1. Open Zed.
2. Open the Extensions view: **Cmd+Shift+X** or `zed: extensions` in the command palette.
3. Click **Install Dev Extension** (top right).
4. Select the `packages/zed/` directory from this repository.

Zed compiles and loads the extension. Open a project that has `@fcss/core` and
`@fcss/lsp-server` installed — IntelliSense activates automatically when you open a supported
file.

To reload after a code change, rebuild the crate and use **Reload Extension** in the Extensions
view.

## Supported file types

| File type  | Language IDs registered |
| ---------- | ----------------------- |
| HTML       | `HTML`                  |
| JavaScript | `JavaScript`            |
| JSX        | `JavaScript` (JSX)      |
| TSX        | `TSX`                   |
| TypeScript | `TypeScript`            |

IntelliSense activates on `class` and `className` attributes in these file types.

## Features

### Completions

Typing inside a `class` or `className` attribute triggers FCSS class completions. The
trigger characters are `-`, `:`, `.`, and `%`.

Completion items include:

- **Property completions** — CSS property names (e.g. `display`, `margin-bottom`)
- **Value completions** — all values for the typed property (e.g. `display--flex`, `display--block`)
- **Pseudo-condition completions** — appending `:hover`, `:focus`, etc.
- **ARIA-condition completions** — appending `:aria-expanded:true`, etc.
- **Breakpoint completions** — responsive variants (e.g. `display--flex@sm`)

The documentation panel for each item shows the generated CSS declaration.

### Hover

Hovering a FCSS class inside a `class` or `className` attribute shows:

- The generated CSS rule
- The property category and source specification
- A deprecation notice if the class is deprecated (and its canonical replacement)
- The condition type (pseudo, ARIA, or breakpoint) when present

Hovering an unknown word shows no information.

### Diagnostics

The server publishes diagnostics on document open and on every change (debounced 200 ms). All
7 FCSS diagnostic codes are supported:

| Code                           | Severity | Description                                                                           |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------- |
| `fcss/unknown-property`        | Error    | Class uses a CSS property not in the `@fcss/core` manifest                            |
| `fcss/unknown-value`           | Error    | Property is known but value is not in the manifest                                    |
| `fcss/conflict`                | Error    | Two classes in the same attribute set the same CSS property                           |
| `fcss/duplicate`               | Warning  | Same class appears more than once in the same attribute                               |
| `fcss/invalid-condition-chain` | Error    | Class has more than one condition (only one pseudo or ARIA allowed)                   |
| `fcss/deprecated-class`        | Warning  | Class is marked deprecated in the manifest; canonical replacement shown               |
| `fcss/dynamic-purge-risk`      | Info     | Dynamic class construction (template literals, concatenation) prevents static purging |

Each diagnostic is anchored to the exact class-token range in the source. The
`fcss/dynamic-purge-risk` diagnostic is only emitted for JavaScript and TypeScript files.

Diagnostics refresh automatically when the document changes and when `@fcss/core` is rebuilt
(the server watches the manifest file with `watchManifest`).

### Code actions

Placing the cursor on a diagnostic and invoking **Quick Fix** (or the Zed code action shortcut)
shows available actions:

| Action                 | Kind       | Behavior                                                                                                                   |
| ---------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| Replace with canonical | `quickfix` | Applies a `WorkspaceEdit` that replaces the deprecated class in the source — works in Zed                                  |
| Add to safelist        | `quickfix` | Shows an information message with the `fcss.config.js` safelist snippet                                                    |
| Create c- rule         | `quickfix` | Shows an information message with the c- rule skeleton                                                                     |
| Convert to static map  | `refactor` | Shows an information message with the static class-map pattern                                                             |
| Open docs              | `source`   | Attempts `window/showDocument` to open the FCSS docs URL; falls back to an information message (see Zed limitations below) |

## Known Zed limitations

### `window/showDocument` — external URLs

The `fcss.openDocs` command sends a `window/showDocument` LSP request with `external: true` to
open the FCSS documentation URL in the system browser. Zed's support for this request depends on
the exact Zed version. If Zed does not handle the request, the server falls back gracefully and
shows the URL in an information message instead — no functionality is lost.

### Status bar

There is no FCSS status-bar item in Zed. The VS Code extension shows a manifest load indicator;
Zed does not expose a matching API surface for extensions. Manifest load status is logged to
the Zed output panel (via the LSP server console log).

### `fcss/deprecated-class` diagnostic with current `@fcss/core`

The current release of `@fcss/core` contains no deprecated class aliases. The
`fcss/deprecated-class` diagnostic and its "Replace with canonical" quick-fix are fully
implemented in `@fcss/language-service` and tested with fixture manifests, but they will not
appear in a real project until `@fcss/core` introduces deprecated entries.

## Validation project

The `examples/zed-validation/` directory in this repository provides a minimal HTML + TSX
project with `@fcss/core` and `@fcss/lsp-server` installed. Use it to verify each feature:

1. Build the WASM extension: `cargo build --release --target wasm32-wasip2` from `packages/zed/`.
2. In Zed, install it as a dev extension pointing to `packages/zed/`.
3. Open `examples/zed-validation/` as your Zed workspace.
4. Open `index.html` and `src/App.tsx` — IntelliSense activates automatically.

Each diagnostic class is annotated with a comment explaining the expected diagnostic.

## Troubleshooting

| Symptom                    | Likely cause                          | Fix                                                               |
| -------------------------- | ------------------------------------- | ----------------------------------------------------------------- |
| No completions or hover    | `@fcss/core` not installed in project | `npm install @fcss/core @fcss/lsp-server`                         |
| "Node.js not found" error  | Node not on `PATH`                    | Install Node.js and ensure it is on your `PATH`                   |
| Extension does not appear  | WASM build not done                   | Run `cargo build --release --target wasm32-wasip2`                |
| Diagnostics not refreshing | Manifest changed on disk              | The server watches the manifest; save a file to trigger a refresh |

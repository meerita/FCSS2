<!--
@file packages/zed/README.md
@description FCSS Zed extension — prerequisites, build, and dev-extension install.
@layer adapters
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# FCSS Zed Extension

Brings FCSS IntelliSense to the [Zed](https://zed.dev) editor: completions, hover
documentation, diagnostics, and code actions for `class` and `className` attributes
in HTML, JavaScript (JSX), TSX, and TypeScript files.

The extension is a thin Rust→WASM wrapper. All language intelligence lives in
`@fcss/lsp-server`, which the extension launches as a Node.js child process.

## Prerequisites

### In your project

```sh
npm install @fcss/core @fcss/lsp-server
```

Both packages must be present in your project's `node_modules`. Node.js must be on
your `PATH` (verified at Zed startup; if missing, the extension logs a clear error).

### To build the extension

- **Rust** — install via [rustup](https://rustup.rs)
- **wasm32-wasip2 target**:

```sh
rustup target add wasm32-wasip2
```

## Build

From `packages/zed/`:

```sh
cargo build --release --target wasm32-wasip2
```

The compiled artifact is written to
`packages/zed/target/wasm32-wasip2/release/fcss_zed.wasm`.

To verify formatting and lints before building:

```sh
cargo fmt --check
cargo clippy -- -D warnings
```

## Install as a Dev Extension in Zed

1. Open Zed.
2. Open the Extensions view: **Cmd+Shift+X** or `zed: extensions` in the command
   palette.
3. Click **Install Dev Extension** (top right).
4. Select the `packages/zed/` directory from this repository.

Zed compiles and loads the extension. Open a project that has `@fcss/core` and
`@fcss/lsp-server` in its `node_modules` — IntelliSense activates automatically.

To reload after a code change, run `cargo build --release --target wasm32-wasip2`
again and use **Reload Extension** in the Extensions view.

## Registry publication

Publication to the Zed extension registry (`zed-industries/extensions`) is out of
scope for v1. This extension is intended for local / dev-dir install only.

# Zed Guide

FCSS IntelliSense in [Zed](https://zed.dev) comes from a small Rust extension compiled to WASM.
It starts `@functionalcss/lsp-server` with Node.js and attaches it to HTML, JavaScript, TSX and
TypeScript files.

## Status

Neither the extension nor `@functionalcss/lsp-server` is published yet. The extension isn't in
Zed's registry, and the server isn't on npm. Today it runs from a clone of this repo, against
projects inside the workspace, such as `examples/zed-validation/`. The steps below are for that
setup.

## What you need

- Node.js on your `PATH`. The extension checks at startup and tells you if it's missing.
- [Rust](https://rustup.rs) with the WASM target:

```sh
rustup target add wasm32-wasip2
```

- A project with `@functionalcss/core` and `@functionalcss/lsp-server` in its `node_modules`.
  The server reads the class list from `node_modules/@functionalcss/core/dist/manifest.json`.
  Without it, the server logs a warning and stays quiet.

## Build and install the extension

From the repo root, build everything once so `lsp-server` has a `dist/`:

```sh
pnpm install
pnpm build
```

Then build the extension:

```sh
cd packages/zed
cargo build --release --target wasm32-wasip2
```

In Zed:

1. Open the Extensions view (**Cmd+Shift+X**, or `zed: extensions` in the command palette).
2. Click **Install Dev Extension**.
3. Pick the `packages/zed/` directory.

Open `examples/zed-validation/` as a workspace, then `index.html` or `src/App.tsx`. Every
example class there has a comment saying which diagnostic it should trigger.

After changing the extension, rebuild it and hit **Reload Extension**.

## What you get

IntelliSense works inside `class` and `className` attributes in HTML, JavaScript (including
JSX), TSX and TypeScript.

### Completions

Typing `-`, `:`, `.` or `%` triggers suggestions:

- property names (`display`, `margin-bottom`)
- values for the property you typed (`display--flex`, `display--block`)
- pseudo states (`:hover`, `:focus`) and ARIA states (`:aria-expanded:true`)
- breakpoint prefixes (`sm-`, `md-`, `lg-`, `xl-`, `xxl-`)

Each item shows the CSS it generates.

### Hover

Hovering a class shows the CSS rule, its category and source spec, the state or breakpoint it
applies to, and a deprecation notice with the replacement when there is one.

### Diagnostics

Diagnostics run when a file opens and 200 ms after you stop typing:

| Code                           | Severity | Meaning                                                      |
| ------------------------------ | -------- | ------------------------------------------------------------ |
| `fcss/unknown-property`        | Error    | The property isn't in the manifest                           |
| `fcss/unknown-value`           | Error    | Known property, unknown value                                |
| `fcss/conflict`                | Error    | Two classes in one attribute set the same property           |
| `fcss/duplicate`               | Warning  | Same class twice in one attribute                            |
| `fcss/invalid-condition-chain` | Error    | More than one pseudo or ARIA condition on a class            |
| `fcss/deprecated-class`        | Warning  | Deprecated class, with its replacement                       |
| `fcss/dynamic-purge-risk`      | Info     | Class built at runtime that the purge can't see (JS/TS only) |

When `@functionalcss/core` is rebuilt, the server reloads the manifest and refreshes them.

`@functionalcss/core` has no deprecated classes yet, so you won't see
`fcss/deprecated-class` in a real project. It's implemented and tested with fixture
manifests.

### Code actions

| Action                 | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| Replace with canonical | Rewrites a deprecated class to its replacement                     |
| Add to safelist        | Shows the safelist snippet to paste into your config               |
| Create c- rule         | Shows a skeleton for a custom `c-` class                           |
| Convert to static map  | Shows the static class-map pattern for a dynamic class             |
| Open documentation     | Asks Zed to open the docs; shows the URL if Zed doesn't support it |

## Zed limitations

**External links.** "Open documentation" sends `window/showDocument` with `external: true`.
Whether Zed opens the browser depends on your Zed version. If it doesn't, you get the URL in a
message instead.

**No status bar item.** Zed doesn't give extensions a status bar API. Manifest load messages
go to the Zed log (the LSP server's console output).

## Troubleshooting

| Symptom                       | Likely cause                                      | Fix                                                     |
| ----------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| No completions or hover       | `@functionalcss/core` missing in the project      | Install it, or open a project inside the workspace      |
| "lsp-server is not installed" | `@functionalcss/lsp-server` not in `node_modules` | Use a project in this workspace (see [Status](#status)) |
| "Node.js not found"           | Node isn't on your `PATH`                         | Install Node.js and restart Zed                         |
| Extension doesn't show up     | WASM not built                                    | `cargo build --release --target wasm32-wasip2`          |
| Server starts, then nothing   | `lsp-server` has no `dist/`                       | Run `pnpm build` at the repo root                       |

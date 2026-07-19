<!--
@file packages/lsp-server/README.md
@description FCSS language server — prerequisites, build, and LSP protocol surface.
@layer tools
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @fcss/lsp-server

A Node.js Language Server Protocol (LSP) server that wraps `@fcss/language-service` and speaks
LSP over stdio. It is consumed by editor extensions — the [FCSS Zed extension](../zed/README.md)
is the primary host.

All language intelligence (completions, hover, diagnostics, code actions) lives in
`@fcss/language-service`. This package is a thin LSP adapter: it manages document
synchronization, discovers and watches the `@fcss/core` manifest, extracts class occurrences
from document text, and translates library output into LSP protocol types.

## Prerequisites

- **Node.js** — the server is launched as `node dist/server.js`.
- **`@fcss/core` installed in your project** — the manifest is discovered at
  `node_modules/@fcss/core/dist/manifest.json` relative to the workspace root.

## Build

From the monorepo root:

```sh
pnpm --filter @fcss/lsp-server run build
```

Or from this directory:

```sh
pnpm run build
```

The compiled output is written to `dist/server.js`.

## Running manually

The server communicates over stdio and follows the LSP lifecycle. It is not intended to be
run directly by users — it is launched by editor extensions. To verify the binary works:

```sh
node dist/server.js
```

The process blocks waiting for LSP messages on stdin. Send `{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"rootUri":null,"capabilities":{}}}` followed by a newline to confirm the server responds.

## LSP capabilities

| Capability               | Trigger / detail                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `textDocumentSync`       | `Incremental` — diagnostics published on open and on change (200 ms debounce)        |
| `completionProvider`     | Trigger characters: `-`, `:`, `.`, `%`                                               |
| `hoverProvider`          | On any token inside a `class`/`className` attribute                                  |
| `codeActionProvider`     | On the cursor range covering a diagnostic                                            |
| `executeCommandProvider` | `fcss.addToSafelist`, `fcss.createCRule`, `fcss.convertToStaticMap`, `fcss.openDocs` |

## Diagnostic codes

| Code                           | Severity | Description                                                 |
| ------------------------------ | -------- | ----------------------------------------------------------- |
| `fcss/unknown-property`        | Error    | CSS property not in the `@fcss/core` manifest               |
| `fcss/unknown-value`           | Error    | Property known but value not in manifest                    |
| `fcss/conflict`                | Error    | Two classes in the same attribute set the same CSS property |
| `fcss/duplicate`               | Warning  | Same class appears more than once                           |
| `fcss/invalid-condition-chain` | Error    | More than one condition per class                           |
| `fcss/deprecated-class`        | Warning  | Class is deprecated; canonical replacement in message       |
| `fcss/dynamic-purge-risk`      | Info     | Dynamic class construction in JS/TS prevents static purging |

`fcss/dynamic-purge-risk` is only emitted for `javascript`, `javascriptreact`, `typescript`,
and `typescriptreact` language IDs.

## Code actions

Two shapes are produced depending on the diagnostic:

- **Edit-based** (`WorkspaceEdit`) — deprecated → canonical replacement. Applied directly by
  the editor.
- **Command-based** (`workspace/executeCommand`) — `addToSafelist`, `createCRule`,
  `convertToStaticMap`, `openDocs`. The server handles these with information messages.
  `openDocs` attempts `window/showDocument` (external URL) and falls back to an information
  message if the client does not support it.

## Manifest watch

On initialize, the server locates the manifest and loads it. On initialized, it calls
`watchManifest` to watch the file for changes. When `@fcss/core` is rebuilt and the manifest
changes on disk, all open documents are re-diagnosed automatically.

## Security

- The manifest path is resolved from the workspace root and validated to remain within the
  workspace — no path traversal is accepted.
- Document text is processed in memory only; it is never logged at info level or sent to any
  external service.
- The server makes no network requests.

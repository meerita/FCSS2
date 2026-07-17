<!--
@file packages/vscode/README.md
@description README for the FCSS IntelliSense VS Code extension.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# FCSS IntelliSense

VS Code extension for [FCSS](https://github.com/cognativinc/fcss) — provides completions, hover, and diagnostics powered by the `@fcss/core` manifest.

## Features

- **Completions** — property, value, pseudo-class, ARIA attribute, and breakpoint completions with generated CSS in each item's documentation
- **Hover** — shows the generated CSS, category, state, breakpoint, source, and deprecation warnings
- **Diagnostics** — unknown property/value, conflicts, duplicates, invalid condition chains, deprecated classes, dynamic purge risk
- **Status bar** — shows the number of active utilities when FCSS is detected in the workspace

## Requirements

Install `@fcss/core` in your project:

```sh
npm install @fcss/core
```

The extension automatically loads the manifest from `node_modules/@fcss/core/dist/manifest.json` in any workspace folder. No build step is required.

## Supported file types

- HTML (`.html`)
- JSX (`.jsx`, `.js`)
- TSX (`.tsx`, `.ts`)
- Angular inline templates (`.component.ts`)

## Usage

Open any supported file in a workspace containing `@fcss/core`. The status bar shows "FCSS (N utilities)" when active.

Type a partial FCSS class name inside a `class` or `className` attribute to trigger completions.

## Grammar

```
[breakpoint-]property--value[:condition]
```

Examples:

- `display--flex` — base class
- `md-display--flex` — responsive (≥768px)
- `display--flex:hover` — pseudo-class state
- `display--none:aria-expanded:true` — ARIA state

## Manifest watch

The extension watches `manifest.json` for changes and reloads automatically when you rebuild `@fcss/core`.

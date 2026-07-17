<!--
@file packages/language-service/README.md
@description README for @fcss/language-service.
@layer docs
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# @fcss/language-service

Manifest-driven language service engine for FCSS. Powers completions, hover, diagnostics, conflict detection, and code actions — all from the `@fcss/core` manifest. No separately maintained class list.

## API

### Parser

```ts
import { parseClass } from '@fcss/language-service';

const token = parseClass('md-display--flex:hover');
// { breakpoint: 'md', property: 'display', classValue: 'flex',
//   conditionType: 'pseudo', conditionValue: 'hover', isValid: true, errors: [] }
```

### Manifest

```ts
import { loadManifestFromPath, createManifestIndex, watchManifest } from '@fcss/language-service';

const entries = loadManifestFromPath('/path/to/node_modules/@fcss/core/dist/manifest.json');
const index = createManifestIndex(entries);

// Watch for changes (returns a disposer)
const stop = watchManifest(manifestPath, (newEntries) => {
  const newIndex = createManifestIndex(newEntries);
});
stop(); // unwatch
```

### Completions

```ts
import { getCompletions } from '@fcss/language-service';

const items = getCompletions('display--', index);
// Returns completion items for all display values
```

Completion contexts:

- Empty/partial property: suggests breakpoints and properties
- After `--`: suggests values for the detected property
- After `:`: suggests pseudo-classes and ARIA attribute prefix
- After `:aria-`: suggests ARIA attributes from the manifest
- After `:aria-attr:`: suggests known values for that attribute

### Hover

```ts
import { getHover } from '@fcss/language-service';

const result = getHover('md-display--flex:hover', index);
// result.contents — Markdown with CSS snippet, category, source, breakpoint, state info
```

### Diagnostics

```ts
import { getDiagnostics, getSourceDiagnostics } from '@fcss/language-service';

// Class-level diagnostics (from a class attribute)
const diags = getDiagnostics(['display--flex', 'display--block'], index);

// Source-level (DYNAMIC_PURGE_RISK only)
const sourceDiags = getSourceDiagnostics(fileContent);
```

Diagnostic codes:

| Code                           | Severity | Description                                                       |
| ------------------------------ | -------- | ----------------------------------------------------------------- |
| `fcss/unknown-property`        | error    | Property not in manifest                                          |
| `fcss/unknown-value`           | error    | Property exists but value is unknown                              |
| `fcss/conflict`                | error    | Same `(property, breakpoint, condition)` triple, different values |
| `fcss/duplicate`               | warning  | Identical class appears twice                                     |
| `fcss/invalid-condition-chain` | error    | More than one condition suffix                                    |
| `fcss/deprecated-class`        | warning  | Class marked deprecated in manifest                               |
| `fcss/dynamic-purge-risk`      | warning  | Template literal with FCSS fragment — may be purged incorrectly   |

### Conflict detection

```ts
import { detectConflicts } from '@fcss/language-service';

const conflicts = detectConflicts(['margin--16', 'margin-left--8'], index);
// [{ type: 'shorthand-overlap', classA: 'margin--16', classB: 'margin-left--8', property: 'margin' }]
```

### Code actions

```ts
import { getCodeActions } from '@fcss/language-service';

const actions = getCodeActions(diagnostic, index);
// Returns up to 5 action types: replace-canonical, add-safelist, convert-dynamic, open-docs, create-c-rule
```

## LSP compatibility

The API is designed for LSP compatibility. `CompletionItem`, `HoverResult`, and `DiagnosticItem` map directly to LSP protocol types, enabling future JetBrains or Neovim plugin support.

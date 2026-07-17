---
title: 'ADR-008 — Generated Specification Architecture'
order: 8
category: Decisions
summary: 'A machine-readable spec in @fcss/spec drives the generator; generated files are read-only.'
author: Diego Lafuente
date: 2026-07-17
---

# ADR-008 — Generated Specification Architecture

## Status

Accepted

## Context

The legacy FCSS CSS was hand-authored, leading to bugs, inconsistencies, and structural
issues catalogued in the Phase 0 audit (malformed selectors, duplicate rules, naming mismatches).
A utility CSS library with hundreds or thousands of classes cannot be maintained by hand.

## Decision

FCSS uses a **machine-readable specification** architecture:

1. `@fcss/spec` — TypeScript data that describes every CSS property, its allowed values,
   breakpoint support, and state variant support. This is the single source of truth.
2. `@fcss/generator` — reads the spec and deterministically emits the complete CSS library.
3. `@fcss/core` — distributes the generated CSS and the manifest (a JSON index of all class names
   and their declarations, used by the scanner and language service).

**Generated files are read-only.** Every generated CSS file begins with a header comment:

```css
/* GENERATED — do not edit. Run `pnpm run generate` to regenerate. */
```

Developers and agents must never manually edit generated output.

**Determinism** — given the same spec and configuration, the generator must produce
byte-identical output across runs, environments, and Node.js versions.

The dependency direction is enforced: `spec → generator → core`. No package may depend
in the reverse direction.

## Consequences

- Bugs in the CSS (like those found in Phase 0) are fixed by fixing the spec or generator, not by patching CSS.
- The full test suite for `@fcss/core` is semantic — it verifies generated selectors against expected strings.
- Adding a new CSS property is a spec change, not a CSS edit.
- The manifest enables the language service to provide IntelliSense without reading the CSS.
- Generated files must be committed to the repository so that consumers can install `@fcss/core` without running the generator.

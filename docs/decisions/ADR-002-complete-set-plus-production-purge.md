---
title: 'ADR-002 — Complete Set Plus Production Purge'
order: 2
category: Decisions
summary: 'Ship the full CSS library; purge unused classes at build time via PostCSS AST. No JIT.'
author: Diego Lafuente
date: 2026-07-17
---

# ADR-002 — Complete Set Plus Production Purge

## Status

Accepted

## Context

A utility CSS library must balance two concerns: completeness (every possible class is
available during development) and file size (only used classes are shipped to production).
Two architectural models exist:

1. **JIT (Just-in-Time)** — generate only the classes that appear in source files at build time.
   Examples: Tailwind CSS 3+.
2. **Full-set-plus-purge** — distribute the entire library; remove unused classes at build time.
   Examples: Tailwind CSS 1–2, the legacy FCSS implementation.

## Decision

FCSS uses the **full-set-plus-purge** model:

- `@fcss/generator` emits the complete CSS library as a single `fcss.css` file.
- The file is distributed as part of `@fcss/core`.
- `@fcss/scanner` scans project source files for FCSS class names using a PostCSS AST walk
  (not regex) to identify used classes.
- `@fcss/postcss` removes unused selectors from the distributed CSS at build time.

## Consequences

- Development experience is frictionless — no build step required to get a new class; just use it.
- The generator can be deterministic and offline — it needs no knowledge of project source code.
- Production bundles are as small as JIT (unused classes are removed).
- The PostCSS purge step is required in production builds. Frameworks that skip it ship 400 kB+ of unused CSS.
- The scanner must be accurate — false negatives (missing a used class) produce broken production styles. PostCSS AST is used instead of regex for correctness.
- JIT generation is explicitly out of scope for 1.0. The full-set model is simpler to test and guarantees deterministic byte-identical output.

---
title: 'ADR-009 — Framework Integration Boundaries'
order: 9
category: Decisions
summary: 'Framework packages are thin wrappers; all logic lives in the shared core packages.'
author: Diego Lafuente
date: 2026-07-17
---

# ADR-009 — Framework Integration Boundaries

## Status

Accepted

## Context

FCSS supports multiple build frameworks (Vite, Next.js, Angular). Without clear boundaries,
framework-specific packages tend to re-implement shared logic, leading to divergence and
maintenance burden.

## Decision

Framework integration packages (`@fcss/vite`, `@fcss/next`, `@fcss/angular`) are **thin wrappers**:

- They wire the shared `@fcss/scanner` and `@fcss/postcss` packages into the framework's build pipeline.
- They expose framework-specific configuration APIs (e.g. `withFcss()` for Next.js, a Vite plugin factory).
- They contain no scanning, parsing, or purge logic — that belongs in `@fcss/scanner` and `@fcss/postcss`.

Dependency direction:

```
scanner → postcss → vite / next / angular
```

Framework packages may depend on `scanner` and `postcss` but not on each other.
The core CSS package (`@fcss/core`) must not depend on any framework package.

The CLI (`@fcss/cli`) is the primary entry point for project-level configuration (`fcss.config.ts`).
Framework plugins read the config via the CLI's config loader, not by reimplementing their own.

## Consequences

- A bug in the purge logic is fixed once in `@fcss/postcss`, not three times across framework packages.
- Adding a new framework integration requires writing only the wiring layer (~200 lines), not the logic.
- Framework packages are thin enough that the community can maintain them without deep FCSS knowledge.
- The constraint "core must not depend on framework packages" is enforced by the CI dependency graph check (Phase 5).

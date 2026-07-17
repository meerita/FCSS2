---
title: 'ADR-010 — Custom c- Class Boundary'
order: 10
category: Decisions
summary: 'The c- prefix reserves space for project-specific multi-declaration rules outside the generated library.'
author: Diego Lafuente
date: 2026-07-17
---

# ADR-010 — Custom c- Class Boundary

## Status

Accepted

## Context

The one-declaration-per-utility rule (ADR-003) means FCSS classes are granular by design.
In practice, projects need reusable multi-declaration patterns (a card, a button, a layout
primitive) that don't belong in a utility library but should coexist with FCSS classes without
naming conflicts.

Additionally, some styling needs (conditional class groups, ancestor-dependent styles, grouping
peer states) cannot be expressed with a single FCSS utility and require multi-condition or
multi-property CSS.

## Decision

The `c-` prefix is the **project-owned namespace** in FCSS:

- Classes with the `c-` prefix are **never generated** by FCSS.
- Developers write `c-` classes in their own CSS files; FCSS never touches them.
- `c-` classes may contain any number of declarations, any value, and `!important`.
- The scanner and purge engine preserve `c-` selectors regardless of source scanning results.
- The language service does not provide IntelliSense for `c-` classes (they are project-specific).

Examples:

```css
/* In your project CSS — not in FCSS generated output */
.c-card {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 16px;
  box-shadow: var(--fcss-elevation-2);
}

.c-btn-primary {
  display: inline-flex;
  align-items: center;
  background-color: var(--fcss-color-blue);
  color: var(--fcss-color-white);
  border-radius: 4px;
  padding: 8px 16px;
}
```

## Consequences

- There is a clear boundary between generated utilities and project-specific rules.
- The `c-` prefix prevents naming conflicts with FCSS property names (no CSS property starts with `c-`).
- Projects can evolve their `c-` rules independently without affecting the FCSS library.
- The scanner must not strip `c-` selectors during purge.
- Auditors and IDEs can distinguish generated utilities from custom rules by the `c-` prefix alone.

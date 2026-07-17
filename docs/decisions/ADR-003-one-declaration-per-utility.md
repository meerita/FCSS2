---
title: 'ADR-003 — One Declaration Per Utility'
order: 3
category: Decisions
summary: 'Every built-in FCSS utility emits exactly one CSS declaration. No shorthand expansion.'
author: Diego Lafuente
date: 2026-07-17
---

# ADR-003 — One Declaration Per Utility

## Status

Accepted

## Context

Some utility CSS frameworks expand a single class into multiple CSS declarations for
convenience (e.g. a `flex` class that sets `display: flex; align-items: center;`).
This provides productivity for common patterns but creates hidden coupling: the developer
cannot see from the class name what CSS is applied.

FCSS's core principle is that a developer who knows CSS already knows how to use FCSS.
This principle requires class names to be transparent.

## Decision

Every built-in FCSS utility class emits **exactly one CSS declaration**:

```css
.display--flex {
  display: flex;
} /* ✅ one declaration */
.align-items--center {
  align-items: center;
} /* ✅ one declaration */
```

Shorthand expansion is forbidden:

```css
/* ❌ not allowed in built-ins */
.flex-center {
  display: flex;
  align-items: center;
}
```

The `c-` prefix is reserved for project-specific multi-declaration rules that live in the
developer's own CSS, not in the generated library.

`!important` is never used in any built-in utility. Developers may use it in their own `c-` CSS.

## Consequences

- Class names are fully transparent — no mental model beyond CSS property–value syntax.
- The generator is simple: one input descriptor → one output rule.
- Compositing multi-declaration patterns requires multiple classes (`display--flex align-items--center`), which is intentional.
- The `elevation` utility is a documented exception: it maps to a `box-shadow` multi-shadow composite. This exception is tracked as a named alias, not as a multi-declaration utility.

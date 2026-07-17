---
title: 'ADR-005 — State Suffix Model'
order: 5
category: Decisions
summary: 'Pseudo-state variants use a colon suffix on the class name, not a modifier prefix.'
author: Diego Lafuente
date: 2026-07-17
---

# ADR-005 — State Suffix Model

## Status

Accepted

## Context

Utility CSS libraries must support pseudo-state variants (hover, focus, active, visited).
Two common approaches:

1. **Prefix** — `hover:display--block`, `focus:color--red`
2. **Suffix** — `display--block:hover`, `color--red:focus`

The legacy FCSS used a suffix model with escaped colons in CSS class names.

## Decision

FCSS uses the **suffix model** for pseudo-state conditions:

```
property--value:pseudo-class
```

The colon in the HTML class attribute value is escaped in the CSS selector:

```css
.color--red\:hover:hover {
  color: red;
}
.display--block\:focus:focus {
  display: block;
}
```

The pattern is `.<escaped-class-name><pseudo-class-selector>`.

Rules:

- Zero or one condition per class name. Chaining (`:hover:focus`) is forbidden.
- Supported pseudo-classes: `:hover`, `:focus`, `:focus-within`, `:active`, `:visited`, `:disabled`, `:checked`, `:placeholder` (where applicable).
- ARIA conditions use the same suffix position (see ADR-006).

## Consequences

- Class names read left-to-right: property, value, then the condition when it applies.
- The escaped-colon pattern works in all browsers that support attribute-escaped class selectors (all evergreen browsers).
- Scanning for state variants requires a regex/AST that handles the colon in class attribute values.
- Chained conditions are impossible in the syntax — complex multi-state rules belong in `c-` CSS.

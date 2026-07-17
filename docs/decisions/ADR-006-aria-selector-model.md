---
title: 'ADR-006 — ARIA Selector Model'
order: 6
category: Decisions
summary: 'ARIA state conditions use attribute selectors generated from the class name suffix.'
author: Diego Lafuente
date: 2026-07-17
---

# ADR-006 — ARIA Selector Model

## Status

Accepted

## Context

Modern accessible interfaces conditionally apply styles based on ARIA attributes
(`aria-expanded`, `aria-selected`, `aria-disabled`, etc.). A utility CSS library
should provide first-class support so that accessibility-driven styling does not
require custom CSS.

## Decision

FCSS treats ARIA attribute conditions as first-class in the state suffix:

```
property--value:aria-attribute:value
```

Examples:

| Class                               | Generated CSS                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `display--block:aria-expanded:true` | `[aria-expanded='true'] .display--block\:aria-expanded\:true { display: block }`               |
| `opacity--05:aria-disabled:true`    | `[aria-disabled='true'] .opacity--05\:aria-disabled\:true { opacity: 0.5 }`                    |
| `color--gray:aria-selected:false`   | `[aria-selected='false'] .color--gray\:aria-selected\:false { color: var(--fcss-color-gray) }` |

The selector targets the element itself when the ARIA attribute is on that element,
and descendants when the ARIA attribute is on a parent. Generator implementations
may choose one model; the spec documents the chosen approach explicitly.

Supported ARIA attributes: `aria-expanded`, `aria-selected`, `aria-checked`,
`aria-disabled`, `aria-pressed`, `aria-hidden`, `aria-current`, `aria-invalid`.
Values: `true`, `false`, and string values where applicable.

## Consequences

- Accessibility-driven state styling is declarative and co-located with other utility classes.
- The selector pattern is more complex than pseudo-classes and requires careful escaping.
- Class name parsing must treat `:aria-` as the start of an ARIA condition, not a pseudo-class.
- Only boolean and enumerated ARIA attribute values are supported (not `aria-label` or `aria-labelledby`).

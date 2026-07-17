---
title: 'ADR-001 — FCSS Syntax Contract'
order: 1
category: Decisions
summary: 'Defines the canonical class-name syntax: property--value with optional breakpoint prefix and condition suffix.'
author: Diego Lafuente
date: 2026-07-17
---

# ADR-001 — FCSS Syntax Contract

## Status

Accepted

## Context

FCSS must define an unambiguous, machine-parseable class-name syntax that maps directly
to CSS property–value pairs. The syntax must be learnable by anyone who knows CSS, must
survive HTML attribute serialisation, and must support breakpoint and pseudo-state/ARIA
extensions without ambiguity.

Alternatives considered:

- Tailwind-style abbreviations (`flex`, `bg-blue`) — rejected; require memorising a mapping layer.
- BEM-style (`property__value--modifier`) — rejected; conflicts with CSS conventions and is verbose.
- Bracket values (`w-[100px]`) — rejected; arbitrary values encourage bypassing the design system.

## Decision

The canonical FCSS class-name syntax is:

```
[breakpoint-]property--value[:condition]
```

Where:

- `breakpoint` (optional) — one of `sm`, `md`, `lg`, `xl`, `xxl`. Applied as a `min-width` media query.
- `property` — the exact CSS property name, lowercase, with no abbreviation.
- `--` — the separator between property and value.
- `value` — the CSS value, with special encoding: `/` → `%2F`, spaces encoded as needed.
- `condition` (optional) — one of: a CSS pseudo-class (`:hover`, `:focus`), or an ARIA attribute condition (`:aria-expanded:true`). Zero or one condition per class.

Examples:

```
display--flex
md-display--none
color--red:hover
display--block:aria-expanded:true
```

The separator `--` was chosen because double-hyphens are valid in CSS class names and are
visually distinct from single-hyphen property names.

## Consequences

- Every utility class is fully self-describing — no external lookup needed to understand it.
- The scanner can extract classes using a deterministic regex without understanding CSS semantics.
- Chained conditions (`display--block:hover:focus`) are explicitly forbidden. Use `c-` classes for multi-condition rules.
- The `--` separator means FCSS class names cannot conflict with standard BEM notation.
- Negative values encode as `property---8` (three hyphens: `--` separator + `-` minus sign).

---
title: 'ADR-004 — CSS3 Profile'
order: 4
category: Decisions
summary: 'FCSS 1.0 targets the CSS3 feature set. Modern CSS4+ features are out of scope.'
author: Diego Lafuente
date: 2026-07-17
---

# ADR-004 — CSS3 Profile

## Status

Accepted

## Context

CSS has evolved rapidly. A utility library must define which CSS features it covers so that
the specification, generator, and test suite have a finite and well-defined scope.

Supporting every CSS property and value would make the library hard to maintain and the
generated file enormous. Supporting too few would make FCSS impractical.

## Decision

FCSS 1.0 targets the **CSS3 profile**, defined as:

**Included:**

- Flexbox (`display: flex`, `align-*`, `justify-*`, `flex-*`, `gap`, `order`)
- CSS Grid (`grid-template-*`, `grid-auto-*`, `grid-column/row`, `grid-area`)
- Custom Properties (`var()` usage; FCSS ships `--fcss-color-<name>` tokens)
- CSS Transitions and Animations Level 1 (`transition-*`, `animation-*`)
- CSS Transforms Level 1 (`transform`, `transform-origin`)
- All CSS2.1 layout and box model properties
- Typography, lists, tables, backgrounds, borders
- Overflow, visibility, z-index, position, float, clear
- Colors via custom properties only (no hex values in class names)

**Excluded (CSS4+ / modern):**

- `:has()`, `:is()`, `:where()` — selector features
- Container queries (`@container`)
- Cascade layers (`@layer`)
- Modern color spaces (`oklch`, `color-mix`, `lch`)
- Subgrid
- Individual transform properties (`translate`, `rotate`, `scale` as standalone properties)
- Logical properties (planned for `@fcss/modern` in a future major version)
- CSS Nesting

## Consequences

- The specification has a tractable, finite scope for 1.0.
- `@fcss/modern` is architected for but not implemented in 1.0 (see master plan out-of-scope).
- Developers needing CSS4+ utilities can use `c-` classes in their own CSS.
- Evergreen browsers only (no IE support). Chromium, Firefox, Safari, Mobile Safari, modern Android.

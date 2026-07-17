---
title: 'ADR-007 — Breakpoint Strategy'
order: 7
category: Decisions
summary: 'Five breakpoints, mobile-first min-width strategy, fixed pixel values, prefix notation.'
author: Diego Lafuente
date: 2026-07-17
---

# ADR-007 — Breakpoint Strategy

## Status

Accepted

## Context

Responsive utilities require a defined breakpoint system. Key decisions:

- How many breakpoints, and at what values?
- Mobile-first (`min-width`) or desktop-first (`max-width`)?
- How are breakpoints encoded in class names?

The legacy FCSS used a prefix notation (`sm-`, `md-`, `lg-`, `xl-`, `xxl-`) with both
`min-width` and `max-width` variants. The Phase 0 audit revealed the `sm` file used
`max-width: 576px` (desktop-first) while all other breakpoints used `min-width` (mobile-first),
creating an inconsistency.

## Decision

FCSS 1.0 uses **mobile-first `min-width` breakpoints exclusively**:

| Prefix | `min-width` |
| ------ | ----------- |
| `sm`   | 576 px      |
| `md`   | 768 px      |
| `lg`   | 992 px      |
| `xl`   | 1200 px     |
| `xxl`  | 1400 px     |

Class name encoding: `{prefix}-{property}--{value}`, e.g. `md-display--none`.

The legacy `sm` file's `max-width` usage was a bug (documented in Phase 0 audit). The
corrected `sm` means "apply at `min-width: 576px` and above", consistent with all other breakpoints.

No desktop-first variants are provided. Projects needing `max-width` media queries use `c-` CSS.

## Consequences

- A single, consistent mental model: all breakpoint classes apply "at this width and above."
- The breakpoint prefix must appear before the property name — `md-display--flex`, not `display--flex-md`.
- The base set (no prefix) applies at all widths. Breakpoint variants override.
- Breakpoint values match the Bootstrap 5 grid — familiar to most web developers.
- The legacy `sm.css` had `max-width: 576px`; the new `sm` is `min-width: 576px`. This is a semantic change from the legacy, but corrects the documented bug.

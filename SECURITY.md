<!--
@file SECURITY.md
@description Security policy — supported versions, private reporting process, and scope.
@layer root
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅ Yes    |
| < 1.0   | ⛔ No     |

Pre-release versions (0.x, alpha, beta) receive security fixes only on a best-effort basis.

## Reporting a vulnerability

**Do not file a public GitHub issue for security vulnerabilities.**

Report security issues privately by emailing **diego.lafuente@cognativinc.com** with the subject
line `[FCSS Security] <brief description>`. Include:

- A description of the vulnerability and its potential impact.
- Steps to reproduce or a proof-of-concept.
- Affected versions and packages.
- Any suggested mitigations, if known.

You will receive an acknowledgement within **48 hours** and a status update within **7 days**.

## Response policy

1. **Triage** — Within 48 hours we confirm receipt and begin assessment.
2. **Assessment** — We determine severity (CVSS) and affected scope within 7 days.
3. **Fix** — We develop and test a patch. Timeline depends on complexity.
4. **Disclosure** — We coordinate a release and public disclosure with the reporter. We follow
   [responsible disclosure](https://en.wikipedia.org/wiki/Responsible_disclosure) — typically
   90 days from report unless an earlier public fix is mutually agreed.
5. **Credit** — Reporters are credited in the release notes unless they prefer anonymity.

## Scope

In-scope:

- All packages under the `@fcss` npm scope.
- The `fcss` CLI tool.
- The VS Code extension (`@fcss/vscode`).

Out-of-scope:

- The documentation site (`apps/docs`) — it is a static read-only site.
- Third-party dependencies — please report these to their respective maintainers.
- Theoretical vulnerabilities without a proof of concept.

## Security constraints in the codebase

The following constraints are enforced by policy and must not be violated:

- No `eval` or `Function()` constructor usage anywhere in the tooling.
- No execution of project source code during scan or purge — FCSS reads tokens, it never runs them.
- No network access during `generate` or `purge` — these operations are fully offline.
- No npm install scripts in any FCSS package.
- Supply-chain review (dependency audit) required before every npm publish.

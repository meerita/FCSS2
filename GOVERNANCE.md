<!--
@file GOVERNANCE.md
@description Project governance — maintainer responsibilities, review requirements, and processes.
@layer root
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# FCSS Governance

## Maintainers

The project is currently maintained by **Diego Lafuente** (Cognativ Inc.).

Maintainer responsibilities:

- Review and merge pull requests within a reasonable time (target: 5 business days).
- Triage security reports per [SECURITY.md](SECURITY.md).
- Tag and publish releases after consensus.
- Keep the specification (`@fcss/spec`) authoritative — all breaking changes go through an ADR.
- Enforce the code of conduct.

## Review requirements

- Every pull request requires at least **one approving review** from a maintainer before merge.
- A PR authored by a maintainer requires review from at least one other contributor with commit access, unless trivial (e.g. dependency bumps with CI green).
- Security-sensitive changes (purge engine, scanner, authentication in docs) require maintainer review.

## Merge strategy

- Feature branches are squash-merged into `dev`.
- `dev → main` promotions are merge commits, preserving the integration history.
- No force-push to `dev` or `main`.

## Release authority

- Patch and minor releases: any maintainer may publish after CI is green and changesets are applied.
- Major releases: require documented consensus in a GitHub Discussion or Issue.
- Pre-releases (alpha, beta, rc): maintainer discretion; tag clearly.

## Specification changes

The CSS property specification (`@fcss/spec`) defines the observable contract of the library.
Changes that alter the set of emitted classes or selector patterns are **breaking** regardless of
their apparent scope and require:

1. An ADR documenting the decision and its rationale.
2. A major version bump in the affected packages.
3. A migration note in `CHANGELOG.md`.

## Deprecation process

1. Mark the deprecated feature in the manifest and emit a console warning when used via the CLI.
2. Keep the deprecated feature for at least one minor release after the deprecation notice.
3. Remove in the next major version.
4. Document in `CHANGELOG.md`.

## Security process

See [SECURITY.md](SECURITY.md) for the full vulnerability reporting and response policy.
Security fixes bypass the normal PR review timeline — a single maintainer approval is sufficient
to ship a patch release for a confirmed critical vulnerability.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contribution workflow.

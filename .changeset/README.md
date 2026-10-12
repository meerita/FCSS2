<!--
@file .changeset/README.md
@description Changesets directory — manages versioning and changelogs for published packages.
@layer root
@created Diego Lafuente <diego.lafuente@cognativinc.com>
-->

# Changesets

This directory contains pending changesets managed by
[@changesets/cli](https://github.com/changesets/changesets).

## Creating a changeset

```sh
pnpm changeset
```

Follow the prompts to select which packages changed and the bump type (major / minor / patch).

## Releasing

```sh
pnpm changeset version   # apply changesets → bump versions + update CHANGELOG.md
pnpm changeset publish   # publish updated packages to npm
```

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the full release workflow.

# Releases

This document describes how Verdaccio packages are released. For the mapping
between versions, branches, npm dist-tags, and Docker images, see
[VERSIONS.md](./VERSIONS.md).

## Overview

Releases are driven by [Changesets](https://github.com/changesets/changesets).
Contributors add a changeset describing each change; the pipeline turns the
pending changesets into a versioning pull request and, once that PR is merged,
publishes the affected packages.

Publishing is **protected**: the job that publishes to the npm registry runs
only after the required manual approval has been granted. Nothing reaches the
registry automatically.

## npm Trusted Publishing

All Verdaccio packages publish to npm via
[Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) — **no
long-lived npm tokens are used**. The publish workflows authenticate through
GitHub's OIDC identity (`id-token: write`) and npm verifies the configured
trusted publisher. This covers **every** package without exception: the
`verdaccio` registry, all `@verdaccio/*` modules, and all plugins.

## Branches

Verdaccio maintains several release lines, each released from its own branch.
The authoritative branch ↔ version ↔ npm dist-tag mapping lives in
[VERSIONS.md](./VERSIONS.md). At the time of writing:

- **`6.x` — the current `latest` line.** This is the stable release; it
  publishes the **`latest`** dist-tag, so a plain `npm install verdaccio`
  installs from `6.x`.
- **`master` — experimental (`9.x`).** Pre-release line under the `next-9`
  dist-tag; not production-ready.
- **`7.x` — next.** Pre-release line under the `next-7` dist-tag.
- **`8.x` — maintenance.** No public `verdaccio` release. It ships bug-fix
  updates for the internal `@verdaccio/*` modules that `6.x` currently depends
  on (under the `next-8` dist-tag) — a temporary arrangement while `6.x` is
  supported. New development happens on `master` (9.x).

> The `latest` designation always points at the current stable line — **today
> that is `6.x`** — and moves when a newer major becomes stable. Always check
> [VERSIONS.md](./VERSIONS.md) for the current mapping.

## Approvals

The approval gate covers **every release artifact, not just npm**. The publish
job **pauses and requires manual approval** before anything is pushed:

- **npm packages** — the `verdaccio` registry, all `@verdaccio/*` modules, and
  the plugins.
- **Docker images** — both the per-line images built inside the release's
  publish job (e.g. `6.x`, `7.x`) and the nightly image on `master` (gated by its
  own approval environment).
- **Helm charts** — published under the same approval gate.

Approval is requested automatically when a release is ready to publish; the job
waits until it is granted. This applies to every release line, stable and
experimental alike. See [VERSIONS.md](./VERSIONS.md) for which branch maps to
which line.

## Flow

1. **Changesets accumulate.** Each merged change carries a changeset on its
   target branch.
2. **Version PR.** The release workflow opens (or refreshes) a release pull
   request that applies the pending changesets — bumping versions and updating
   changelogs. This step runs freely and never publishes.
3. **Merge.** When maintainers merge the version PR, the pending changesets are
   consumed.
4. **Gated publish.** Merging triggers the publish job, which pauses for the
   required approval. Nothing ships until it is granted. Once approved, the job
   publishes every artifact for that line: the packages to **npm**, the
   **Docker images**, and the **Helm charts**.

## Docker images

Docker images are published through the same protected flow:

- For the stable and next lines (e.g. `6.x`, `7.x`), the release's **publish job
  builds and pushes the multi-arch image** immediately after the npm publish —
  behind the same approval gate. Tags follow each line's convention (see
  [VERSIONS.md](./VERSIONS.md)); only the latest line carries the `latest` tag.
- On `master`, the nightly image is published by a separate workflow that is
  **also protected by a manual-approval environment**, so nothing reaches Docker
  Hub automatically.

## UI theme

The web UI ships as a **pre-built, packed bundle** published as
[`@verdaccio/ui-theme`](https://www.npmjs.com/package/@verdaccio/ui-theme). The
published package contains only the compiled assets — the **source code lives in
the monorepo** at
[`packages/plugins/ui-theme`](https://github.com/verdaccio/verdaccio/tree/master/packages/plugins/ui-theme)
(built on the shared components under `packages/ui-components`).

The UI is a **special case**: a single theme is **shared across `6.x`, `7.x`,
and the experimental (`9.x` / `master`) releases** — every line depends on the
published `@verdaccio/ui-theme` rather than keeping its own copy. To avoid drift,
its **single source of truth is `master`**: the UI is developed and built there,
and the resulting bundle is consumed by all branches. This applies to every
branch.

## Notes

- The versioning pull request can be opened and refreshed at any time without
  approval; only the publish step is gated.
- A release with nothing new to publish is a no-op, even after approval.

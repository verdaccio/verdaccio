# Versions

> **Scope:** The version, support, and Node.js policies described in this document apply **only to the [`verdaccio`](https://www.npmjs.com/package/verdaccio) package** (the registry binary users install and run). Packages published under the [`@verdaccio/*`](https://www.npmjs.com/org/verdaccio) scope are internal architectural building blocks—plugins, libraries, and infrastructure—and follow their own independent versioning, release cadence, and support lifecycle. Their compatibility is defined by the `verdaccio` major they ship with, not by this table.

The following table describes the versions of this project:

| Version         | Supported                                                  | Minimum Node.js | Branch | Npm Tag  | Docker Images           | Helm Charts   |
| --------------- | ---------------------------------------------------------- | --------------- | ------ | -------- | ----------------------- | ------------- |
| 4.x             | :x: (deprecated)                                           | 10              | 4.x    | latest-4 | (Not available)         | 3.x           |
| 5.x previous    | :x: (deprecated)                                           | 14              | 5.x    | latest-5 | (Not available)         | 4.0 - 4.18    |
| 6.x maintenance | :white_check_mark: (security fixes only, until 2027-06-25) | 22              | 6.x    | latest-6 | 6, 6.x, 6.x.x, 6.x-next | 4.19 - 4.35.x |
| 7.x current     | :white_check_mark:                                         | 24              | 7.x    | latest   | 7, 7.x, 7.x.x, 7.x-next | 7.x           |
| 8.x             | :x: (skipped)                                              | 18              | 8.x    | next-8   | (none)                  | n/a           |
| 9.x next        | :white_check_mark:                                         | 24              | master | next-9   | nightly-master          | n/a           |

## Migration Guide

- **6.x (or 5.x) to 7.x**: [Migrating from Verdaccio 6 to Verdaccio 7](https://verdaccio.org/blog/2026/09/27/verdaccio-6-to-7-migration) walks through runtime, configuration, authentication, storage, plugins, validation and rollback; the list of breaking changes is kept in [docs/migrations-guide.md](https://github.com/verdaccio/verdaccio/blob/master/docs/migrations-guide.md). For the feature highlights, see [What's new in Verdaccio 7](https://verdaccio.org/blog/2026/10/25/verdaccio-7-release).
- **4.x and older to 5.x**: [Verdaccio 5 migration guide](https://verdaccio.org/blog/2021/04/14/verdaccio-5-migration-guide/).

### About 7.x

Verdaccio `7.0.0` was released on 2026-10-25 and is the current stable line: it is what `npm install -g verdaccio` and `docker pull verdaccio/verdaccio` install, it receives bug fixes, new features and expedited security fixes, and it runs on the 9.x internal modules (`@verdaccio/*`). Nightly builds of the `7.x` branch are published as `7.x-next` on Docker Hub.

### About 6.x (maintenance)

With the release of 7.0.0, 6.x moved to maintenance. It receives **security fixes only** for **8 months** after that release, until **2027-06-25**; no new features or regular bug fixes land on 6.x. Releases are published under the `latest-6` npm tag and the `6`, `6.x` and `6.x.x` Docker tags. Plan the upgrade to 7.x before that date; the [migration guide](#migration-guide) covers the breaking changes.

### About 8.x

Version 8.x has been skipped and will not have a public release. Its internal modules receive security fixes only, for as long as 6.x is in maintenance, since they are what 6.x depends on. No new features will be added to 8.x. Development continues directly on 9.x.

### Next Versions

Next versions (currently `9.x`, npm tag `next-9`) are pre-releases: not production-ready, intended for testing and early feedback. Issues found on next releases—**including security-related ones**—are treated as regular bugs, not as security vulnerabilities, and they do not follow the expedited fix timeline reserved for supported stable versions.

We still appreciate responsible disclosure for any sensitive findings on next versions through the [official security channel](./SECURITY.md), but please be aware that:

- Fixes will land on the `master` branch on a best-effort basis, with no guaranteed turnaround.
- Expedited security releases are only issued for stable majors (7.x) and, for security fixes, 6.x in maintenance.
- The recommendation is always to run the latest supported stable version in production.

### Deprecated Versions

Deprecated versions aren’t supported anymore and shouldn’t be used in production. They don’t get updates—including security fixes—and we don’t run E2E tests on them.
Once the deprecation period is over, the source code will be archived and won’t be maintained anymore.

We try to keep things as backward-compatible as possible, but sometimes deprecating old versions is necessary to keep the project moving forward.

### Node.js Support Policy

The "Minimum Node.js" column reflects the lowest Node.js version Verdaccio is **tested** against, and it is tied to the [official Node.js release schedule](https://nodejs.org/en/about/previous-releases). Once a Node.js version reaches End-of-Life on that calendar, we stop testing it—even if the corresponding Verdaccio major is still listed as supported.

What this means in practice:

- A Verdaccio major may keep working on an EOL Node.js version, but it is **not** verified by our CI and no guarantees are made.
- Dependencies may drop support for unmaintained Node.js versions at any time, often for security reasons. When that happens, Verdaccio will follow upstream and bump its minimum Node.js requirement in a patch or minor release.
- Security fixes are only validated against currently-tested Node.js versions.

We strongly recommend always running Verdaccio on an [active LTS](https://nodejs.org/en/about/previous-releases) release of Node.js.

## Npm Registry

The official Verdaccio npm packages are located at https://www.npmjs.com/package/verdaccio.

## Docker Hub

The official Verdaccio Docker Images are found at https://hub.docker.com/r/verdaccio/verdaccio.

Deprecated Docker images will be removed from Docker Hub after one year of their deprecation. We cannot guarantee their availability after this period. This applies to versions 2.x, 3.x, and 4.x, which are no longer available

## Helms Charts

The official Verdaccio Helm Charts are found at https://artifacthub.io/packages/helm/verdaccio/verdaccio.

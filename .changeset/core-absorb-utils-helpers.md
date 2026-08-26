---
'@verdaccio/core': minor
---

Move the remaining `@verdaccio/utils` helpers into `@verdaccio/core`

The author/gravatar helpers (`formatAuthor`, `addGravatarSupport`,
`generateGravatarUrl`, `normalizeContributors`, `GENERIC_AVATAR`) now live in
`@verdaccio/core` under a new `authorUtils` export, and `getLatestVersion` is
available from `pkgUtils`. This lets the deprecated `@verdaccio/utils` package be
retired, since every symbol it exposed now has a home in `@verdaccio/core`.

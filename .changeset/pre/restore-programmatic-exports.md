---
'verdaccio': minor
---

restore the programmatic exports dropped between lines

The `verdaccio` package exported only `runServer`, while 6.x and 7.x also exported a default
and the configuration helpers. Upgrading from 7.x turned `require('verdaccio').default` into
`undefined` with no warning, and `ConfigBuilder`, `parseConfigFile`, `getDefaultConfig` and
`Config` had to be imported from `@verdaccio/config` instead.

Adds back `initServer`, the four configuration exports and a default export pointing at
`runServer`, matching 7.x. A test now pins the surface so the three lines cannot drift apart
again.

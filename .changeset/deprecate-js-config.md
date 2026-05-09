---
'@verdaccio/config': minor
---

Deprecate JavaScript config files. Loading a `.js` config now emits a `DeprecationWarning` — JS config support will be removed in the next major version. Migrate to YAML or use the `ConfigBuilder`.

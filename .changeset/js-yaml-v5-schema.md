---
'@verdaccio/config': patch
---

fix: adapt config parsing to js-yaml v5

js-yaml v5 dropped its default export and switched the default schema to the
YAML 1.2 `CORE_SCHEMA`, which no longer resolves merge keys (`<<`). Config
parsing now uses the named `load`/`dump` exports and extends `CORE_SCHEMA` with
the merge tag, so anchors and merge keys used to share settings across
`config.yaml` sections keep working as they did before.

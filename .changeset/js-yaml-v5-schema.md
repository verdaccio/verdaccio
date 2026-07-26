---
'@verdaccio/config': patch
---

fix: adapt config parsing to js-yaml v5

js-yaml v5 dropped its default export, switched the default schema to the
YAML 1.2 `CORE_SCHEMA` (which no longer resolves merge keys), and now throws on
an empty document. Config parsing now:

- uses the named `load`/`dump` exports instead of the removed default export;
- extends `CORE_SCHEMA` with the merge tag, so anchors and `<<` merge keys used
  to share settings across `config.yaml` sections keep working as before;
- treats an empty, whitespace-only, or comment-only config file as an empty
  config, matching the previous v4 behavior.

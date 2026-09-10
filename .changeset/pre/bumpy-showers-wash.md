---
'@verdaccio/package-filter': minor
---

Added `excludeDeprecated` config filter option. It filters deprecated package versions. By default the feature is disabled.
The option is enabled by:

```yaml
filters:
  '@verdaccio/package-filter':
    excludeDeprecated: true
```

This way Verdaccio will filter out package versions that are marked as "deprecated" (unless they are allow-listed).

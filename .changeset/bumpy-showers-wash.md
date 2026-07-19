---
"@verdaccio/package-filter": minor
---

Added `excludeDeprecated` config filter option. It filters deprecated package versions. By default the feature is disabled.
The option is enabled by:

```yaml
filters:
  '@verdaccio/package-filter':
    excludeDeprecated: true
```

This way verdaccio will completely block package versions that were marked as "deprecated".

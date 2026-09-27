---
---

Stop building and publishing the unused standalone search indexing package in the
9.x workspace. Remove its project configuration, dependencies, test fixtures and
release metadata references.

The registry uses the existing storage and uplink search implementation, so this
cleanup requires no configuration changes or version bumps for remaining packages.

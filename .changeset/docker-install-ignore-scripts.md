---
verdaccio: patch
---

Disable dependency lifecycle scripts when installing Verdaccio in the final Docker image stage.

The production installation now uses npm's `--ignore-scripts` option, matching the build stage's existing policy. This limits the code executed during image construction without changing the runtime configuration. No configuration changes are required for operators.

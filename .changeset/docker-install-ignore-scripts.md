---
verdaccio: patch
---

Disable dependency lifecycle scripts and require dependencies to be at least three days old when installing Verdaccio in the final Docker image stage.

The production installation now uses npm's `--ignore-scripts` and `--min-release-age=3` options. This limits the code executed during image construction and prevents installing newly published dependency versions. Image builds fail if a required dependency has no eligible version, including recently published Verdaccio modules. No configuration changes are required for operators.

---
verdaccio: patch
---

Disable dependency lifecycle scripts and require third-party dependencies to be at least three days old when installing Verdaccio in the final Docker image stage.

The production installation now uses npm's `--ignore-scripts` and `--min-release-age=3` options. Verdaccio and packages matching `@verdaccio/*` or `verdaccio-*` are excluded from the age restriction so new Verdaccio releases can be built immediately. The final stage updates npm to support these exclusions and disables installation audit and funding output. Image builds still fail if another required dependency has no eligible version. No configuration changes are required for operators.

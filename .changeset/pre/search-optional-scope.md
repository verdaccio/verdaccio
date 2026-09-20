---
'@verdaccio/store': patch
'@verdaccio/types': minor
'@verdaccio/core': patch
---

fix: stop synthesizing scope in local npm search results

Local `/-/v1/search` results no longer include the undocumented `package.scope` field. Scoped
package names remain complete in `package.name` (for example, `@scope/package`), while optional
fields received from uplink registries continue to pass through unchanged. `scope` is now optional
in `SearchPackageBody` for compatibility with remote result shapes and existing integrations.

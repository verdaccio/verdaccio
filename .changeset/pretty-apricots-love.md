---
'@verdaccio/types': minor
'@verdaccio/config': minor
'@verdaccio/store': minor
---

- Added a deniedVersions list to package ACLs so admins can block exact versions in config.yaml, merged the types/normalization logic to accept either string or array values, and documented the behavior through new parsing tests and fixtures.
- Introduced DeniedVersionFilter, injected it into storage flows, and expanded unit/integration coverage so manifests, search results, stats, and tarball downloads automatically hide blocked versions and retag latest to the highest allowed build
- Ensured the same filtering protects real installs by preventing npm install pkg@denied and tarball fetches for forbidden versions, with tests covering “latest is denied” scenarios to verify tags and timestamps update as expected

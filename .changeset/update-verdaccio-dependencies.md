---
'verdaccio': patch
---

Update verdaccio dependencies to the `latest` npm dist-tag (`@verdaccio/ui-theme` tracks `next-9`):

- `@verdaccio/auth`: `8.1.4` → `8.1.5`
- `@verdaccio/config`: `8.3.1` → `8.3.2`
- `@verdaccio/core`: `8.3.1` → `8.3.2`
- `@verdaccio/hooks`: `8.1.5` → `8.1.6`
- `@verdaccio/loaders`: `8.1.4` → `8.1.5`
- `@verdaccio/local-storage-legacy`: `11.4.4` → `11.4.5`
- `@verdaccio/logger`: `8.1.4` → `8.1.5`
- `@verdaccio/middleware`: `8.1.5` → `8.1.6`
- `@verdaccio/package-filter`: `13.2.2` → `13.2.3`
- `@verdaccio/signature`: `8.1.4` → `8.1.5`
- `@verdaccio/tarball`: `13.1.4` → `13.1.5`
- `@verdaccio/ui-theme`: `9.0.0-next-9.31` → `9.0.0-next-9.33`
- `@verdaccio/url`: `13.1.4` → `13.1.5`
- `verdaccio-audit`: `13.1.5` → `13.1.6`
- `verdaccio-htpasswd`: `13.1.4` → `13.1.5`

Package name validation now follows the npm rules for existing packages: names that start with an underscore, use `@` without a scope, or contain characters that are not URL-friendly are rejected with HTTP 400 instead of being looked up. Packages whose names cannot be stored as a directory of the same name on every platform (for example `nul` or `aux.js`) are still served from uplinks, but are not cached locally and cannot be published to local storage; a warning is logged when one is requested. Rename any private package with such a name before upgrading. Registry configuration does not need to change.

---
'@verdaccio/store': patch
---

fix: npm search compatible maintainers in search results

Search results for local and cached packages emitted maintainers as `{ name, email }` (or omitted the field entirely), while the npm search API contract uses `{ username, email }`. npm 11 on Node 24 crashes rendering such results (`The "str" argument must be of type string. Received undefined`), making `npm search` fail against verdaccio. Maintainers now include `username` (keeping `name` for backwards compatibility) and default to an empty list when the manifest has none.

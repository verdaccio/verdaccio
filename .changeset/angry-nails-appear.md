---
'@verdaccio/api': major
'@verdaccio/auth': major
'@verdaccio/cli': major
'@verdaccio/config': major
'@verdaccio/core': major
'@verdaccio/file-locking': major
'@verdaccio/readme': major
'@verdaccio/tarball': major
'@verdaccio/types': major
'@verdaccio/url': major
'@verdaccio/hooks': major
'@verdaccio/loaders': major
'@verdaccio/logger': major
'@verdaccio/logger-prettify': major
'@verdaccio/middleware': major
'@verdaccio/node-api': major
'verdaccio-audit': major
'verdaccio-auth-memory': major
'verdaccio-htpasswd': major
'@verdaccio/local-storage': major
'verdaccio-memory': major
'@verdaccio/ui-theme': major
'@verdaccio/proxy': major
'@verdaccio/server': major
'@verdaccio/store': major
'@verdaccio/utils': major
'verdaccio': major
'@verdaccio/web': major
---

feat!: replace deprecated request dependency by got

This is a big refactoring of the core, fetching dependencies, improve code, more tests and better stability. This is essential for the next release, will take some time but would allow modularize more the core.

## Notes

- Remove deprecated `request` by other `got`, retry improved, custom Agent ( got does not include it built-in)
- Remove `async` dependency from storage (used by core) it was linked with proxy somehow safe to remove now
- Refactor with promises instead callback wherever is possible
- ~Document the API~
- Improve testing, integration tests
- Bugfix
- Clean up old validations
- Improve performance

## 💥 Breaking changes

- Plugin API methods were callbacks based are returning promises, this will break current storage plugins, check documentation for upgrade.
- Write Tarball, Read Tarball methods parameters change, a new set of options like `AbortController` signals are being provided to the `addAbortSignal` can be internally used with Streams when a request is aborted. eg: `addAbortSignal(signal, fs.createReadStream(pathName));`
- `@verdaccio/streams` stream abort support is legacy is being deprecated removed
- Remove AWS and Google Cloud packages for future refactoring [#2574](https://github.com/verdaccio/verdaccio/pull/2574).

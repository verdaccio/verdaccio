# @verdaccio/e2e-ui

## 2.0.0

### Major Changes

- 000d43746: feat: upgrade to material ui 5

### Minor Changes

- 1b217fd34: Some verdaccio modules depend on 'mkdirp' library which provides recursive directory creation functionality.
  NodeJS can do this out of the box since v.10.12. The last commit in 'mkdirp' was made in early 2016, and it's mid 2021 now.
  Time to stick with a built-in library solution!

  - All 'mkdirp' calls are replaced with appropriate 'fs' calls.

- 154b2ecd3: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

### Patch Changes

- c383eb68c: fix: get-port missing dep

## 2.0.0-6-next.4

### Patch Changes

- c383eb68: fix: get-port missing dep

# @verdaccio/e2e-ui

## 2.0.0-6-next.3

### Major Changes

- 000d4374: feat: upgrade to material ui 5

## 1.1.0-6-next.2

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

## 1.1.0-6-next.1

### Minor Changes

- 1b217fd3: Some verdaccio modules depend on 'mkdirp' library which provides recursive directory creation functionality.
  NodeJS can do this out of the box since v.10.12. The last commit in 'mkdirp' was made in early 2016, and it's mid 2021 now.
  Time to stick with a built-in library solution!

  - All 'mkdirp' calls are replaced with appropriate 'fs' calls.

## 1.0.1-alpha.0

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr

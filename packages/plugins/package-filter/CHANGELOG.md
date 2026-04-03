# Change Log

## 13.0.0-next-8.3

### Patch Changes

- 4296efb: fix: update dependencies
- Updated dependencies [4296efb]
  - @verdaccio/core@8.0.0-next-8.36

## 13.0.0-next-8.2

### Minor Changes

- 641b38c: feat: add package-filter plugin

  Backport the package-filter plugin from next-9 to the 8.x branch. This plugin implements the ManifestFilter interface to control which package versions are visible to consumers, supporting block/allow rules by scope, package name, version range, publish date, and minimum age.

### Patch Changes

- @verdaccio/core@8.0.0-next-8.35

## 14.0.0-next-9.32

### Patch Changes

- @verdaccio/core@9.0.0-next-9.8

## 14.0.0-next-9.31

### Patch Changes

- @verdaccio/core@9.0.0-next-9.7

## 14.0.0-next-9.30

### Patch Changes

- 8fb8763: - Add @verdaccio/package-filter plugin.
  - Fix filter plugin invocations in Storage.
    - Fix local manifest not filtered when no uplinks configured (e.g. they were removed at some point).
    - Fix only one filter plugin is applied (last).
- Updated dependencies [1905990]
  - @verdaccio/core@9.0.0-next-9.6

## 13.0.0-next-8.28

### Patch Changes

- Plugin moved to Verdaccio monorepo.
  Previously it was hosted independently as verdaccio-plugin-delay-filter package.

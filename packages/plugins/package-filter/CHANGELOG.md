# Change Log

## 13.0.1

### Patch Changes

- @verdaccio/core@8.1.0

## 13.0.0

### Minor Changes

- 641b38c: feat: add package-filter plugin

  Backport the package-filter plugin from next-9 to the 8.x branch. This plugin implements the ManifestFilter interface to control which package versions are visible to consumers, supporting block/allow rules by scope, package name, version range, publish date, and minimum age.

### Patch Changes

- f44ddfc: fix(package-filter): fix O(n²) complexity in cleanupDistFiles
- 4296efb: fix: update dependencies
- Updated dependencies [64a7fc0]
- Updated dependencies [184632c]
- Updated dependencies [6a4d6dd]
- Updated dependencies [9509b63]
- Updated dependencies [f8a321f]
- Updated dependencies [13ff0d4]
- Updated dependencies [9350431]
- Updated dependencies [4296efb]
- Updated dependencies [df612fa]
- Updated dependencies [acb8a99]
- Updated dependencies [96d2f0f]
  - @verdaccio/core@8.0.0

## 13.0.0-next-8.6

### Patch Changes

- @verdaccio/core@8.0.0-next-8.38

## 13.0.0-next-8.5

### Patch Changes

- f44ddfc: fix(package-filter): fix O(n²) complexity in cleanupDistFiles

## 13.0.0-next-8.4

### Patch Changes

- Updated dependencies [df612fa]
  - @verdaccio/core@8.0.0-next-8.37

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

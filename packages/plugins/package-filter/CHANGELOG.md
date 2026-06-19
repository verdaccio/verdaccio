# Change Log

## 13.0.3

### Patch Changes

- dfa2903: perf(package-filter): skip manifest cleanup for packages that are not filtered

  `npm search` invokes `filter_metadata` once for every matched package, which made
  search disproportionately slow when the package-filter plugin was enabled
  ([#5837](https://github.com/verdaccio/verdaccio/issues/5837)). For a package that
  no rule applies to, the plugin still cloned the whole manifest and ran every
  cleanup pass (dist-tags, time, `_distfiles`, latest tag) even though nothing was
  removed.

  The filter now:

  - returns the manifest untouched, without cloning, when neither block rules nor a
    date threshold are configured;
  - runs the cleanup passes only when filtering actually removed or replaced a
    version (the manifest is already consistent otherwise);
  - computes `created`/`modified` in a single O(n) pass instead of sorting.

  Benchmark — `filter_metadata` on a 6000-version manifest (200 iterations each):

  | scenario                                  |  before |   after | speedup |
  | ----------------------------------------- | ------: | ------: | ------: |
  | package matches no rule (search hot path) | 22.6 ms |  6.7 ms |    3.4x |
  | block rule removes ~half the versions     | 26.3 ms | 20.3 ms |    1.3x |
  | no block rule / date threshold configured | 21.0 ms |  0.4 ms |     52x |

  Since `filter_metadata` runs once per matched package during search, this removes
  the per-package overhead that made search slow with many cached packages.

  Note: as a consequence the cleanup passes no longer rewrite metadata for manifests
  the plugin did not filter. Manifests served from storage are already consistent, so
  this is not observable in practice.

- Updated dependencies [589dd52]
  - @verdaccio/core@8.1.2

## 13.0.2

### Patch Changes

- f33d1d6: chore: trusted publisher release
- Updated dependencies [f33d1d6]
  - @verdaccio/core@8.1.1

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

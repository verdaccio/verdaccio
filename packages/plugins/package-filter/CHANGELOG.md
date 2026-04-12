# Change Log

## 14.0.0-next-9.35

### Patch Changes

- @verdaccio/core@9.0.0-next-9.11

## 14.0.0-next-9.34

### Patch Changes

- f777142: fix(package-filter): fix O(n²) complexity in cleanupDistFiles
  - @verdaccio/core@9.0.0-next-9.10

## 14.0.0-next-9.33

### Patch Changes

- @verdaccio/core@9.0.0-next-9.9

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

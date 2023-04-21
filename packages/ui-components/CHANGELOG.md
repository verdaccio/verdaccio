# @verdaccio/ui-components

## 2.0.0-6-next.9

### Patch Changes

- 0dafa982: fix: undefined field on missing count

## 2.0.0-6-next.8

### Patch Changes

- Updated dependencies [16e38df8]
  - @verdaccio/types@11.0.0-6-next.25

## 2.0.0-6-next.7

### Patch Changes

- 7ef599cc: fix: missing version on footer
- Updated dependencies [7ef599cc]
  - @verdaccio/types@11.0.0-6-next.24

## 2.0.0-6-next.6

### Minor Changes

- 974cd8c1: fix: startup messages improved and logs support on types

### Patch Changes

- Updated dependencies [974cd8c1]
  - @verdaccio/types@11.0.0-6-next.23

## 2.0.0-6-next.5

### Minor Changes

- ddb6a223: feat: signature package

### Patch Changes

- Updated dependencies [dc571aab]
  - @verdaccio/types@11.0.0-6-next.22

## 2.0.0-6-next.4

### Major Changes

- 781ac9ac: fix package configuration issues

### Patch Changes

- Updated dependencies [4fc21146]
  - @verdaccio/types@11.0.0-6-next.21

## 2.0.0-6-next.3

### Patch Changes

- Updated dependencies [45c03819]
  - @verdaccio/types@11.0.0-6-next.20

## 2.0.0-6-next.2

### Patch Changes

- Updated dependencies [ef88da3b]
  - @verdaccio/types@11.0.0-6-next.19

## 2.0.0-6-next.1

### Major Changes

- 99978797: feat(web): components for custom user interfaces

  Provides a package that includes all components from the user interface, instead being embedded at the `@verdaccio/ui-theme` package.

  ```
  npm i -D @verdaccio/ui-components
  ```

  The package contains

  - Components
  - Providers
  - Redux Storage
  - Layouts (precomposed layouts ready to use)
  - Custom Material Theme

  The `@verdaccio/ui-theme` will consume this package and will use only those are need it.

  > Prerequisites are using Redux, Material-UI and Translations with `i18next`.

  Users could have their own Material UI theme and build custom layouts, adding new features without the need to modify the default project.

### Patch Changes

- Updated dependencies [99978797]
  - @verdaccio/types@11.0.0-6-next.18

# @verdaccio/website

## 1.0.0-alpha.0
### Major Changes

- d87fa0268: feat!: experiments config renamed to flags
  
  - The `experiments` configuration is renamed to `flags`. The functionality is exactly the same.
  
  ```js
  flags: token: false;
  search: false;
  ```
  
  - The `self_path` property from the config file is being removed in favor of `config_file` full path.
  - Refactor `config` module, better types and utilities

### Minor Changes

- 26b494cbd: feat: add typescript project references settings
  
  Reading https://ebaytech.berlin/optimizing-multi-package-apps-with-typescript-project-references-d5c57a3b4440 I realized I can use project references to solve the issue to pre-compile modules on develop mode.
  
  It allows to navigate (IDE) trough the packages without need compile the packages.
  
  Add two `tsconfig`, one using the previous existing configuration that is able to produce declaration files (`tsconfig.build`) and a new one `tsconfig` which is enables [_projects references_](https://www.typescriptlang.org/docs/handbook/project-references.html).

---
'@verdaccio/api': minor
'@verdaccio/auth': minor
'@verdaccio/cli': minor
'@verdaccio/dev-commons': minor
'@verdaccio/config': minor
'@verdaccio/commons-api': minor
'@verdaccio/file-locking': minor
'@verdaccio/htpasswd': minor
'@verdaccio/local-storage': minor
'@verdaccio/readme': minor
'@verdaccio/streams': minor
'@verdaccio/types': minor
'@verdaccio/hooks': minor
'@verdaccio/loaders': minor
'@verdaccio/logger': minor
'@verdaccio/logger-prettify': minor
'@verdaccio/middleware': minor
'@verdaccio/mock': minor
'@verdaccio/node-api': minor
'@verdaccio/proxy': minor
'@verdaccio/server': minor
'@verdaccio/store': minor
'@verdaccio/dev-types': minor
'@verdaccio/utils': minor
'verdaccio': minor
'@verdaccio/web': minor
'@verdaccio/website': minor
---

feat: add typescript project references settings

Reading https://ebaytech.berlin/optimizing-multi-package-apps-with-typescript-project-references-d5c57a3b4440 I realized I can use project references to solve the issue to pre-compile modules on develop mode.

It allows to navigate (IDE) trough the packages without need compile the packages.

Add two `tsconfig`, one using the previous existing configuration that is able to produce declaration files (`tsconfig.build`) and a new one `tsconfig` which is enables [_projects references_](https://www.typescriptlang.org/docs/handbook/project-references.html).

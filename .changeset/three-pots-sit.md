---
'@verdaccio/api': patch
'@verdaccio/auth': patch
'@verdaccio/cli': patch
'@verdaccio/dev-commons': patch
'@verdaccio/config': patch
'@verdaccio/commons-api': patch
'@verdaccio/file-locking': patch
'verdaccio-htpasswd': patch
'@verdaccio/local-storage': patch
'@verdaccio/readme': patch
'@verdaccio/types': patch
'@verdaccio/hooks': patch
'@verdaccio/loaders': patch
'@verdaccio/logger': patch
'@verdaccio/logger-prettify': patch
'@verdaccio/middleware': patch
'@verdaccio/mock': patch
'@verdaccio/node-api': patch
'@verdaccio/proxy': patch
'@verdaccio/server': patch
'@verdaccio/store': patch
'@verdaccio/dev-types': patch
'@verdaccio/utils': patch
'verdaccio': patch
---

ESLint Warnings Fixed

Related to issue #1461

- max-len: most of the sensible max-len errors are fixed
- no-unused-vars: most of these types of errors are fixed by deleting not needed declarations
- @typescript-eslint/no-unused-vars: same as above

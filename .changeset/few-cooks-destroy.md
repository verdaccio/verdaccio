---
'@verdaccio/api': major
'@verdaccio/auth': major
'@verdaccio/cli': major
'@verdaccio/dev-commons': major
'@verdaccio/config': major
'@verdaccio/commons-api': major
'@verdaccio/file-locking': major
'verdaccio-htpasswd': major
'@verdaccio/local-storage': major
'@verdaccio/readme': major
'@verdaccio/streams': major
'@verdaccio/types': major
'@verdaccio/hooks': major
'@verdaccio/loaders': major
'@verdaccio/logger': major
'@verdaccio/logger-prettify': major
'@verdaccio/middleware': major
'@verdaccio/mock': major
'@verdaccio/node-api': major
'@verdaccio/active-directory': major
'verdaccio-audit': major
'verdaccio-auth-memory': major
'verdaccio-aws-s3-storage': major
'verdaccio-google-cloud': major
'verdaccio-memory': major
'@verdaccio/proxy': major
'@verdaccio/server': major
'@verdaccio/store': major
'@verdaccio/dev-types': major
'@verdaccio/utils': major
'verdaccio': major
'@verdaccio/web': major
'@verdaccio/website': major
---

feat!: experiments config renamed to flags

- The `experiments` configuration is renamed to `flags`. The functionality is exactly the same.

```js
flags: token: false;
search: false;
```

- The `self_path` property from the config file is being removed in favor of `config_file` full path.
- Refactor `config` module, better types and utilities

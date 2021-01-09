---
'@verdaccio/api': minor
'@verdaccio/auth': minor
'@verdaccio/cli': minor
'@verdaccio/config': minor
'@verdaccio/commons-api': minor
'@verdaccio/file-locking': minor
'verdaccio-htpasswd': minor
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
'@verdaccio/active-directory': minor
'verdaccio-audit': minor
'verdaccio-auth-memory': minor
'verdaccio-aws-s3-storage': minor
'verdaccio-google-cloud': minor
'verdaccio-memory': minor
'@verdaccio/ui-theme': minor
'@verdaccio/proxy': minor
'@verdaccio/server': minor
'@verdaccio/store': minor
'@verdaccio/dev-types': minor
'@verdaccio/utils': minor
'verdaccio': minor
'@verdaccio/web': minor
---

feat: add server rate limit protection to all request

To modify custom values, use the server settings property.

```markdown
server:

## https://www.npmjs.com/package/express-rate-limit#configuration-options

rateLimit:
windowMs: 1000
max: 10000
```

The values are intended to be high, if you want to improve security of your server consider
using different values.

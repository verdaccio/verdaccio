---
'@verdaccio/logger': major
---

logging prettifier only in development mode

- Verdaccio prettify `@verdaccio/logger-prettify` the logging which looks beautiful. But there are scenarios which does not make sense in production. This feature enables disable by default the prettifies if production `NODE_ENV` is enabled.
- Updates pino.js to `^6.7.0`.
- Suppress the warning when prettifier is enabled `suppressFlushSyncWarning`

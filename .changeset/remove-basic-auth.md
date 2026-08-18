---
'@verdaccio/auth': major
'@verdaccio/api': major
'@verdaccio/middleware': major
'@verdaccio/server': major
---

Remove support for incoming HTTP Basic authentication. Verdaccio now accepts Bearer tokens for API authentication and advertises only `Bearer` in `WWW-Authenticate` responses.

Web UI endpoints keep using the Web UI authentication middleware, so Web UI session tokens are not validated as npm API tokens.

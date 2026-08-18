---
'@verdaccio/auth': major
'@verdaccio/middleware': major
---

Remove support for incoming HTTP Basic authentication. Verdaccio now accepts Bearer tokens for API authentication and advertises only `Bearer` in `WWW-Authenticate` responses.

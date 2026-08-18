---
'@verdaccio/auth': major
'@verdaccio/api': major
'@verdaccio/middleware': major
'@verdaccio/server': major
---

Remove support for incoming HTTP Basic authentication. Verdaccio now accepts Bearer tokens for API authentication and advertises only `Bearer` in `WWW-Authenticate` responses.

Web UI session tokens are accepted as Bearer authentication for package API requests, so the same package access rules apply to Web UI and package manager clients.

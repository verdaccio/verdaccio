---
'@verdaccio/auth': patch
'@verdaccio/api': patch
'@verdaccio/types': patch
'@verdaccio/config': patch
---

Fix `npm login` and `npm adduser` failing with `401 need: Bearer` for a user that already exists.

When the account exists, the npm client gets `409` on `PUT /-/user/org.couchdb.user:<name>` and retries the same request with `Authorization: Basic`. Removing incoming Basic authentication dropped that retry along with the rest, so the first token for an existing user could no longer be obtained through the legacy login (`/-/v1/login` is only available behind `flags.webLogin`). Tokens already issued, `_authToken` in `.npmrc` and registering a new user were not affected.

Basic is accepted again, and only on the login route (`PUT /-/user/org.couchdb.user:*`). The password is checked behind the same rate limit and two-factor challenge as before, and every other route still answers `401` to a Basic header. Affects the versions that removed incoming Basic authentication (`7.0.0-next-7.x` and `9.0.0-next-9.x`); 6.x was never affected.

To keep rejecting Basic everywhere, including the login route, set `security.api.basicLogin: false`.

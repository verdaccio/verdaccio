---
'verdaccio': patch
---

`npm whoami` and any other request to `/-/whoami` now answer `401 Unauthorized` when the request carries no credentials or a token Verdaccio does not recognise.

Until now the endpoint answered `200` with an empty body `{}` for anonymous requests, so clients that check the status code, rather than the `username` field, treated an expired or wrong token as a valid login. The npm public registry and Verdaccio 7 answer `401` in that case, and this release aligns 6.x with them. Requests with a valid token are unchanged and still return `{ "username": "<name>" }`. No configuration change is required.

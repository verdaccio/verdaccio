---
'verdaccio': patch
---

`npm whoami` and any other request to `/-/whoami` now answer `401 Unauthorized` when the request carries no credentials or a token Verdaccio does not recognise.

Until now the endpoint answered `200` with an empty body `{}` for anonymous requests, so clients that check the status code, rather than the `username` field, treated an expired or wrong token as a valid login. The npm public registry and Verdaccio 7 answer `401` in that case, and this release aligns 6.x with them. Requests with a valid token are unchanged and still return `{ "username": "<name>" }`. No configuration change is required.

This release also updates the internal `@verdaccio/*` modules to their latest 8.x patches. `@verdaccio/core` 8.3.3 corrects the input type of the shared password validator, without changing which passwords are accepted. `@verdaccio/hooks` 8.1.7 brings `handlebars` 4.7.10, which fixes several template injection advisories in the library that renders notification templates.

`proxy-addr`, used by Express to decide which proxies are trusted when `X-Forwarded-For` is read, is pinned to 2.0.8 to fix an IP spoofing issue with IPv4-mapped IPv6 trusted subnets (GHSA-jqcg-44mw-7w3h).

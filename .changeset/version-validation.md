---
"verdaccio": patch
---

Improve version validation in `GET /<package>/<version>`.

The endpoint now resolves only versions and dist-tags that the package actually defines. A version or tag name that the package does not define now returns HTTP 404 (`version not found`) in every case, instead of an internal server error for some names. Requests for existing versions, ranges and dist-tags behave as before, and registry configuration does not need to change.

Update the internal `@verdaccio/*` modules to their latest 8.x releases (`@verdaccio/core` and `@verdaccio/config` 8.3.1, `@verdaccio/auth` 8.1.4, `@verdaccio/middleware` 8.1.5, `verdaccio-htpasswd` 13.1.4, `@verdaccio/local-storage-legacy` 11.4.4, `verdaccio-auth-memory` 13.1.4, `verdaccio-memory` 10.5.4, `verdaccio-audit` 13.1.5 and the rest of the set), which improve validation of user registration, authentication, API tokens and request parameters. When the htpasswd file is reloaded, users removed from it now stop authenticating without a restart.

Update `brace-expansion` and ignore two advisories without a published fix (`braces`, `http-cache-semantics`) that are not reachable from the registry code paths.

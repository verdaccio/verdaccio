---
verdaccio: patch
---

Fix the web UI showing "Error loading manifests" when a middleware plugin performs asynchronous work before continuing the request.

Web API routes now match the paths relative to their router mount. Package listing, search, sidebar, README, login and password changes no longer rely on request logging restoring the original URL at a particular time. Public URLs, authentication requirements and package visibility rules remain unchanged.

This corrects a regression introduced in 6.2.0 and still present in 6.11.2. The release must also include the companion @verdaccio/middleware update that preserves request URLs while logging; the route change must not ship against the old logger. Operators do not need to change their package access rules or disable asynchronous middleware plugins.

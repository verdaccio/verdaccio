---
"verdaccio": patch
---

Improve version validation in `GET /<package>/<version>`.

The endpoint now resolves only versions and dist-tags that the package actually defines. A version or tag name that the package does not define now returns HTTP 404 (`version not found`) in every case, instead of an internal server error for some names. Requests for existing versions, ranges and dist-tags behave as before, and registry configuration does not need to change.

---
verdaccio: patch
---

Improve request validation when changing passwords and signing in through the web API.

Password changes validate the supplied credential fields before invoking the authentication plugin. Existing passwords remain eligible for replacement even when they do not meet the current policy. The existing validation for new passwords and authentication plugin error handling remain unchanged. No configuration changes are required.

A web sign-in request whose JSON body is `null` is now rejected as invalid credentials (HTTP 401) instead of failing with an internal server error (HTTP 500).

This release also updates the internal `@verdaccio/*` modules and the bundled `verdaccio-htpasswd` and `verdaccio-audit` plugins to their latest 6.x-compatible versions. The shared password validator now accepts input of any type and rejects anything that is not a string, and the webhook notification templates use Handlebars 4.7.10, which includes a security fix.

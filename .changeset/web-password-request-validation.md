---
verdaccio: patch
---

Improve request validation when changing passwords and signing in through the web API.

Password changes validate the supplied credential fields before invoking the authentication plugin. Existing passwords remain eligible for replacement even when they do not meet the current policy. The existing validation for new passwords and authentication plugin error handling remain unchanged. No configuration changes are required.

Web sign-in requests now require both a username and a password as non-empty strings. Requests that omit either field, send them empty or with another type, or send a `null` body are rejected with HTTP 400 and the message `username and password is required`; a `null` body previously failed with an internal server error (HTTP 500), and the other cases reached the authentication plugin and returned HTTP 401. The web UI always sends both fields, so signing in from it is unaffected.

This release also updates the internal `@verdaccio/*` modules and the bundled `verdaccio-htpasswd` and `verdaccio-audit` plugins to their latest 6.x-compatible versions. The shared password validator now accepts input of any type and rejects anything that is not a string, and the webhook notification templates use Handlebars 4.7.10, which includes a security fix.

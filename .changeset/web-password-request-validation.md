---
verdaccio: patch
---

Improve request validation when changing passwords and signing in through the web API.

Password changes validate the supplied credential fields before invoking the authentication plugin. Existing passwords remain eligible for replacement even when they do not meet the current policy. The existing validation for new passwords and authentication plugin error handling remain unchanged. No configuration changes are required.

Web sign-in requests now validate the supplied credential fields the same way as password changes. Requests that omit the username or password, send either with a type other than a string, or send a `null` body are rejected with HTTP 400 and the message `username and password is required`; a `null` body previously failed with an internal server error (HTTP 500), and the other cases reached the authentication plugin. Empty strings are still passed to the authentication plugin, which rejects them as before. The web UI always sends both fields, so signing in from it is unaffected.

This release also updates the internal `@verdaccio/*` modules and the bundled `verdaccio-htpasswd` and `verdaccio-audit` plugins to their latest 6.x-compatible versions. The shared password validator now accepts input of any type and rejects anything that is not a string, and the webhook notification templates use Handlebars 4.7.10, which includes a security fix. `proxy-addr`, which Express uses to resolve client addresses when `server.trustProxy` is configured, is updated to 2.0.8, which includes a security fix for trusted-subnet matching of IPv4-mapped IPv6 addresses.

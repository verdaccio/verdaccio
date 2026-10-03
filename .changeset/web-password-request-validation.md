---
'@verdaccio/web': patch
---

Improve request validation when changing passwords through the web API.

Password changes validate the supplied credential fields before invoking the authentication plugin and retain the configured policy for new passwords. Existing passwords remain eligible for replacement even when they do not meet the current policy. No configuration changes are required.

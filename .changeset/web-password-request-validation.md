---
verdaccio: patch
---

Improve request validation when changing passwords through the web API.

Password changes validate the supplied credential fields before invoking the authentication plugin. Existing passwords remain eligible for replacement even when they do not meet the current policy. The existing validation for new passwords and authentication plugin error handling remain unchanged. No configuration changes are required.

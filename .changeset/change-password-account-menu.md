---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
---

Move the Change Password option from the login form to the signed-in user's account menu.

When `flags.changePassword` is enabled, users can now open the password change form from their account menu. Previously, the link appeared in the login form even though changing a password requires an authenticated session. The option remains hidden when the feature is disabled.

---
'@verdaccio/core': patch
'@verdaccio/auth': patch
'@verdaccio/web': patch
'verdaccio-htpasswd': patch
'verdaccio-auth-memory': patch
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
'@verdaccio/ui-i18n': patch
---

Move the Change Password option from the login form to the signed-in user's account menu.

When `flags.changePassword` is enabled, users can now open the password change form from their account menu. Previously, the link appeared in the login form even though changing a password requires an authenticated session. The option remains hidden when the feature is disabled.

Opening the password change URL without a session now displays a sign-in dialog explaining that authentication is required. Successful sign-in returns users to the form at the same URL. If the server rejects an expired session, the form is cleared and sign-in is requested again.

The password change form no longer asks for a username. The authenticated session determines which account is updated; users enter only their current password, new password and confirmation.

An incorrect current password now returns HTTP 400 with `invalid old password` when using the bundled htpasswd or auth-memory plugin. Previously it returned a generic HTTP 500. The form displays a translated field error and keeps the session open so the user can correct the password. Unexpected plugin and storage failures still return a generic HTTP 500.

`npm profile set password` still returns HTTP 403 for an incorrect current password, but the message is now `invalid old password` instead of `Unable to change password for user '<name>': invalid old password`.

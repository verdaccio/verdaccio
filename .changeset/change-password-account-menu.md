---
'@verdaccio/ui-components': patch
'@verdaccio/ui-theme': patch
'@verdaccio/ui-i18n': patch
---

Move the Change Password option from the login form to the signed-in user's account menu.

When `flags.changePassword` is enabled, users can now open the password change form from their account menu. Previously, the link appeared in the login form even though changing a password requires an authenticated session. The option remains hidden when the feature is disabled.

Opening the password change URL without a session now displays a sign-in dialog explaining that authentication is required. Successful sign-in returns users to the form at the same URL. If the server rejects an expired session, the form is cleared and sign-in is requested again.

The password change form no longer asks for a username. The authenticated session determines which account is updated; users enter only their current password, new password and confirmation.

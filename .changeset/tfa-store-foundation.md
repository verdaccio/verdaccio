---
'@verdaccio/auth': minor
'@verdaccio/api': patch
---

feat: two-factor (TOTP) configuration storage

Adds `TfaStore`, which persists a user's TOTP secret, recovery codes and lockout
state in the storage plugin's token store, encrypted at rest with the server
secret. Nothing reads it yet — the profile endpoints and OTP enforcement land in
follow-up changes, and the `tfa` flag stays inert.

Also closes two ways the token APIs would have exposed that state, since the
token store doubles as a per-user key-value store:

- `GET /-/npm/v1/tokens` listed the row as if it were an access token
- `DELETE /-/npm/v1/tokens/token/:tokenKey` let a user delete it, switching
  two-factor off without the password and one-time password that
  `npm profile disable-2fa` requires

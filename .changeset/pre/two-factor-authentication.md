---
'@verdaccio/types': minor
'@verdaccio/config': minor
'@verdaccio/auth': minor
'@verdaccio/api': minor
---

feat: two-factor authentication (TOTP) behind the `tfa` flag

Adds time-based one-time passwords, gated by the new `tfa` feature flag, which
defaults to `false`.

```yaml
flags:
  tfa: true
```

Users enrol with the standard `npm profile enable-2fa`, in either `auth-only`
mode (logins and token creation) or `auth-and-writes` (those plus publishing,
unpublishing, dist-tag changes and `npm stage approve`/`reject`). Enabling,
disabling and switching mode all re-check the account password, so holding a
token is not enough to remove somebody's second factor.

The challenge answers `401` with `WWW-Authenticate: otp`, which is the only shape
npm and Yarn recognise — anything else, including the `Bearer` that every other
401 carries, is read as a plain authentication failure and never retried.
Verified against npm 11.17 and Yarn 4.18.

Six digits are trivially brute-forceable, so failed verifications are counted and
the account is locked out for five minutes after five of them. Recovery codes are
hashed and consumed on first use.

Secrets, recovery codes and lockout state live in the storage plugin's token
store, encrypted at rest with the server secret, so any plugin implementing the
token interface works unchanged. With the flag on, a plugin that does not now
fails at startup rather than answering `503` on every write.

Two ways the token APIs would have exposed that state are closed: the row is no
longer listed by `GET /-/npm/v1/tokens`, and `DELETE
/-/npm/v1/tokens/token/:tokenKey` refuses to remove it, which would otherwise
have switched two-factor off without the password and one-time password that
`npm profile disable-2fa` requires.

Rotating the server secret makes existing records undecryptable. Rather than
reading that as "this user has no two-factor" and silently dropping everybody's
protection, it raises and names the likely cause.

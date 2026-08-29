---
'@verdaccio/api': minor
---

feat: enforce one-time passwords on writes and logins

Adds the `requireOtp` guard, which challenges users with two-factor enabled on
publish, unpublish, dist-tag changes, `npm stage approve`/`reject`, token
creation and login. `auth-only` covers logins and token creation; writes need
`auth-and-writes`. `npm stage publish` is deliberately never guarded — publishing
without a one-time password and proving presence at approval time is the point
of the staged flow.

The challenge answers 401 with `WWW-Authenticate: otp`, which is the only shape
npm and Yarn recognise. Verified against npm 11.17 (`npm error code EOTP`, then
publishing with `--otp`) and Yarn 4.18 (challenge detected, then publishing with
an injected code).

With `flags.tfa` on, a storage plugin missing the token interface now fails at
startup rather than answering 503 on every write.

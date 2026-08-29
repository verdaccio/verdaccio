---
'@verdaccio/api': minor
'@verdaccio/auth': patch
'@verdaccio/ui-components': patch
---

feat: enable and disable two-factor authentication from `npm profile`

With `flags.tfa` on, `GET /-/npm/v1/user` reports the two-factor mode and
whether enrolment is half-finished, and `POST /-/npm/v1/user` implements the
three-step exchange `npm profile enable-2fa` performs, plus `disable-2fa`.
Both require the account password to be re-entered.

Verified against npm 11.17: `npm profile get` renders the mode, and
`npm profile enable-2fa <same-mode>` short-circuits with "already enabled".

Nothing enforces a one-time password yet — that lands with the `requireOtp`
middleware in a follow-up change. With the flag off the endpoint keeps
answering that two-factor is not supported.

# Staged publishing and two-factor authentication (v9)

Runs `verdaccio/verdaccio:nightly-master` with the two experimental flags turned
on and nothing else changed:

```yaml
flags:
  stage: true
  tfa: true
```

> **Experimental.** 9.x is the experimental line, where both features land
> first, and neither is recommended for production yet. Feedback is what decides
> whether they graduate — see
> [staged publishing](https://verdaccio.org/docs/staged-publishing) and
> [two-factor authentication](https://verdaccio.org/docs/two-factor-authentication).

```bash
docker compose up
```

The registry is on <http://localhost:4873/>. Log in with **dummyuser** /
**dummyuser**.

## Requirements

`npm stage` needs **npm 11.17 or newer**. Check with `npm --version`; older
clients do not have the command at all, and there is no Yarn or pnpm equivalent.

## Try staged publishing

A version is uploaded for review and only becomes installable once somebody
approves it.

```bash
npm adduser --registry http://localhost:4873
cd $(mktemp -d) && npm init -y --scope=@demo

npm stage publish --registry http://localhost:4873
npm view @demo/... --registry http://localhost:4873   # 404, not installable yet

npm stage list --registry http://localhost:4873       # what is waiting
npm stage download <id> --registry http://localhost:4873   # inspect the tarball
npm stage approve <id> --registry http://localhost:4873     # publish it for real
```

`npm stage reject <id>` discards it instead, and the version never existed.

## Try the review gate

The `packages` block grants `stage` and `publish` to different people for
`gated-*`:

```yaml
'gated-*':
  access: $all
  stage: $authenticated
  publish: dummyuser
```

Register a second user and publish a package named `gated-something` with it:

- `npm stage publish` works — they may propose a release
- `npm publish` is refused — they may not make one
- `npm stage approve` is refused — they may not approve their own submission

Only `dummyuser` can approve. Without the `stage` entry it falls back to
`publish`, in which case the same person can stage and approve, which is
convenient but enforces nothing.

## Try two-factor

```bash
npm profile enable-2fa auth-and-writes --registry http://localhost:4873
```

npm asks for the account password, draws a QR code in the terminal, and asks for
the first code from your authenticator app. **Save the recovery codes it prints:
they are shown once.**

After that, publishing asks for a code:

```bash
npm publish --registry http://localhost:4873
# This operation requires a one-time password.
# Enter OTP:
```

Non-interactively, pass `--otp=123456`. Codes are single use, so if you enrol and
publish inside the same 30 seconds you have to wait for the next one.

`auth-only` mode asks only on login and token creation, not on writes. Turn it
off with `npm profile disable-2fa`.

## Publishing from CI

A pipeline cannot type a one-time password, so with `auth-and-writes` it simply
fails — npm does not even prompt without a TTY:

```
$ CI=true npm publish
npm error code EOTP
npm error This operation requires a one-time password from your authenticator.
```

There are two ways out, and no `bypass_2fa` automation token like npmjs has.

**Stage from CI, approve by hand.** `npm stage publish` never asks for a code, so
it works unchanged in a pipeline:

```
$ CI=true npm stage publish
+ my-package@1.0.0 (staged with id 32334c34-...)
```

A maintainer then runs `npm stage approve <id>` with their own code. The release
is prepared automatically and a human still signs off on it — which is the
combination these two features exist for.

**Or give the CI account `auth-only`.** That mode only asks on login and token
creation, so writes go through:

```
$ CI=true npm publish     # ciuser is in auth-only mode
+ my-package@1.0.0
```

Weaker, though: the pipeline holds a long-lived token and that token alone can
publish. If that is acceptable, restrict what it may publish with
[package access](https://verdaccio.org/docs/packages) rather than relying on the
second factor.

## How they fit together

`npm stage publish` never asks for a one-time password, while `npm stage approve`
does. That is the combination worth having: a pipeline can prepare a release
without holding a second factor, and a maintainer approves it with theirs.

## Notes

- Both flags default to `false`. Turning one on changes nothing for users who do
  not opt in, and with the flag off `npm stage` answers `404`.
- `./storage` and `./conf` are bind-mounted, so packages, staged items and
  two-factor records survive restarts.
- **Do not rotate `config.secret` while anyone has two-factor enabled.** The
  records are encrypted with it and there is no self-service recovery.

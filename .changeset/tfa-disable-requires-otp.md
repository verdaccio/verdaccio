---
'@verdaccio/api': patch
'@verdaccio/store': patch
---

fix: prove presence before two-factor can be switched off

Three problems found while reviewing the staged publishing and two-factor work.

Turning two-factor off only re-checked the account password. A password is
exactly what an attacker holding a stolen session already has, so the second
factor could be removed without ever proving presence — the one thing it exists
to require. `POST /-/npm/v1/user` now answers the standard `401` challenge when
two-factor is already active, which is what `otplease` in the npm CLI expects, so
`npm profile disable-2fa` and mode switches keep working unchanged. Enrolment is
untouched: the challenge stays quiet while a record is pending, so the three
steps of `npm profile enable-2fa` still run without a code.

Staging a tarball waited for the write stream to emit `open` before piping into
it. The storage plugin interface only promises a Writable, and the event is a
detail of the two bundled plugins, so a plugin that never emits it would have
hung staging forever with nothing written. The payload is now piped straight
away, which is correct either way because a stream that is not ready yet buffers
the writes.

Approving a staged version created an abort signal but never fired it when the
client disconnected, unlike the two sibling routes in the same file, so reading
the staged tarball carried on after the caller had gone.

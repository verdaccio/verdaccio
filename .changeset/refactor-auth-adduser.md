---
'@verdaccio/auth': patch
'verdaccio-htpasswd': patch
'@verdaccio/plugin-verifier': patch
'verdaccio-auth-memory': patch
---

Align user registration with the authentication plugin callback contract.

The htpasswd plugin's `adduser` method now returns `void` and reports registration
results and internal asynchronous errors through its callback. Registration retains
the checks performed after acquiring the file lock and releases the lock before
reporting completion, and invokes the callback exactly once even if the callback
itself throws.

The htpasswd and in-memory plugins now consider only stored user entries, so
usernames such as `constructor` or `toString` can be registered and authenticated.
When htpasswd reloads its file, users removed from it are now forgotten: before,
a user deleted from the `.htpasswd` file could keep authenticating until Verdaccio
restarted. If reading the `.htpasswd` file fails after its lock is taken, the lock is
now released instead of blocking later registrations until it goes stale.

These htpasswd issues affect every published `verdaccio-htpasswd` up to
`14.0.0-next-9.33` (shipped by `verdaccio@9.0.0-next-9.33` and `7.0.0-next-7.29`) and
`13.1.3` (shipped by the stable `verdaccio@6.10.4`). This change fixes the next line;
the port to the stable 6.x line is pending.

Authentication reports invalid plugin group results through the error callback,
checking the type before the length so values such as `{ length: 0 }` are rejected.
The plugin verifier also rejects native `async` implementations and non-function
values for `adduser` and legacy `add_user`, with a diagnostic explaining the callback
contract. This additional validation applies to the verifier, not the production
plugin loader.

Plugin authors should keep registration methods callback-based, handle internal
asynchronous errors, and return `void`. The verifier does not invoke registration,
so ordinary functions that return promises still require tests in the plugin's own
suite. Registry configuration does not need to change.

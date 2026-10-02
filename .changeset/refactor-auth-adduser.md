---
'@verdaccio/auth': patch
'verdaccio-htpasswd': patch
'@verdaccio/plugin-verifier': patch
---

Align user registration with the authentication plugin callback contract.

The htpasswd plugin's `adduser` method now returns `void` and reports registration
results and internal asynchronous errors through its callback. Registration retains
the checks performed after acquiring the file lock and releases the lock before
reporting completion. User lookups now consider only stored user entries.

Authentication reports invalid plugin group results through the error callback.
The plugin verifier also rejects native `async` implementations and non-function
values for `adduser` and legacy `add_user`, with a diagnostic explaining the callback
contract. This additional validation applies to the verifier, not the production
plugin loader.

Plugin authors should keep registration methods callback-based, handle internal
asynchronous errors, and return `void`. The verifier does not invoke registration,
so ordinary functions that return promises still require tests in the plugin's own
suite. Registry configuration does not need to change.

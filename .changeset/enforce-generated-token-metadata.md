---
'verdaccio': patch
---

fix: enforce generated npm token metadata

Generated npm tokens (`POST /-/npm/v1/tokens`) stored their `readonly` and
`cidr_whitelist` restrictions but never enforced them, and deleting a token did
not revoke it for the package APIs. A token marked read-only or pinned to a CIDR
range could still publish packages and change dist-tags, and a deleted token
remained usable.

Generated tokens now embed a server-issued key (in the JWT claim, or in the
encrypted legacy AES payload) and a new `enforceGeneratedTokenMetadata`
middleware looks that key up on each request, rejecting the token when it is
missing/revoked, used outside its CIDR whitelist, or used for a write while
read-only. Enforcement applies to both AES and JWT API-token modes.

Note: tokens issued before upgrading carry no key and are not retroactively
constrained — regenerate them to apply the restrictions.

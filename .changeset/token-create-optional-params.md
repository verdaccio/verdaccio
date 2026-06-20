---
'verdaccio': patch
---

fix: allow npm token create without readonly/cidr_whitelist

`npm token create` in npm >= 11 (and the npm 12 prereleases) rewrote the
request body: it no longer sends `readonly` and only sends `cidr_whitelist`
when `--cidr` is passed. The `POST /-/npm/v1/tokens` endpoint required both,
so modern npm clients failed with `422 the parameters are not valid`.

The endpoint now defaults `readonly` to `false` and `cidr_whitelist` to `[]`
when they are absent, while still rejecting values of the wrong type.

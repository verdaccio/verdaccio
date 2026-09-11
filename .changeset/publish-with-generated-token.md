---
'verdaccio': patch
---

Fix `npm publish` failing with `request size did not match content length` when authenticating with a token created by `npm token create`.

The JSON body parser was registered by the API router, which runs after `apiJWTmiddleware()` and after `enforceGeneratedTokenMetadata()`. The latter awaits a storage lookup for tokens that carry a server-issued key, so the request body was partially consumed before the parser attached. It is now registered before both, as it already is on `master`.

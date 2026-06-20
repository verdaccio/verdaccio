---
'@verdaccio/middleware': patch
---

fix: tie generated token CIDR enforcement to trust proxy

The `enforceGeneratedTokenMetadata` middleware resolved the client address by
reading the `X-Forwarded-For` header directly (and taking its left-most,
client-most entry), regardless of the application's `trust proxy` setting. Any
client could therefore satisfy a generated token's `cidr_whitelist` by sending a
forged `X-Forwarded-For` header, defeating the CIDR restriction.

The middleware now derives the client address from Express' `req.ip`, which
already honors `config.server.trustProxy`: forwarded headers are trusted only
for operator-configured proxies, otherwise the direct socket address is used and
`X-Forwarded-For` is ignored.

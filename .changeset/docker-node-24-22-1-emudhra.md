---
'verdaccio': patch
---

The Docker image no longer trusts certificates issued through the compromised eMudhra (emSign) intermediate CAs.

In October 2026, eMudhra disclosed that the private keys of several of its intermediate certificate authorities had been compromised. Anyone holding those keys can issue a TLS certificate that a client trusting the eMudhra chain accepts as valid, for any host. Verdaccio connects to its uplinks (such as registry.npmjs.org) over HTTPS, so an attacker able to intercept that traffic could impersonate an uplink and serve tampered metadata or tarballs, which Verdaccio would then cache.

The image is now built on `node:24.22.1-alpine` instead of `node:24.15.0-alpine`. Node.js 24.22.1 updates its bundled root certificates to NSS 3.131.1, which removes `emSign ECC Root CA - G3`, and rejects chains that contain the compromised public keys. Node.js uses that bundled store for outgoing HTTPS by default. The image also upgrades Alpine's `ca-certificates` package at build time. That package matters only if you make Node.js read the system store, for example with `NODE_EXTRA_CA_CERTS` or `--use-system-ca`.

Every earlier `verdaccio/verdaccio` 6.x image is affected. To get the fix, pull the new image. If you install Verdaccio from npm instead of Docker, upgrade Node.js to 22.23.4, 24.22.1, 26.12.1 or later.

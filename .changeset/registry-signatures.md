---
'@verdaccio/api': minor
'@verdaccio/config': minor
'@verdaccio/core': minor
'@verdaccio/middleware': minor
'@verdaccio/proxy': minor
'@verdaccio/store': minor
'@verdaccio/types': minor
---

Make `npm audit signatures` work through Verdaccio for packages proxied from an uplink, behind the experimental `flags.signatures` setting.

Verdaccio already kept the `dist.signatures` and `dist.attestations` fields that registry.npmjs.org attaches to every version, but it did not serve the two routes the npm CLI reads to verify them. npm resolves signing keys by registry host, so against Verdaccio it requested `GET /-/npm/v1/keys`, received a 404 and aborted the whole command with `EMISSINGSIGNATUREKEY` on the first package coming from npmjs. Attestation bundles are fetched from the registry the package was installed from as well, so `GET /-/npm/v1/attestations/<name>@<version>` also returned 404.

Both routes now exist when `flags.signatures: true` is set in the configuration (the feature is experimental and may change). `GET /-/npm/v1/keys` returns the signing keys of every configured uplink merged by key id (refreshed hourly) and answers 404 when none publishes keys. `GET /-/npm/v1/attestations/<name>@<version>` relays the attestations from the first uplink that proxies the package, applying the package `access` rules, and answers 404 when the uplink has none. With this `npm audit signatures` verifies registry signatures and provenance attestations of proxied packages exactly as it does against registry.npmjs.org. Enable it with:

```yaml
flags:
  signatures: true
```

Packages published to Verdaccio itself are not signed yet. npm treats any registry that publishes keys as a registry whose packages should all be signed, so once the flag is on `npm audit signatures` lists every locally published package as having a missing registry signature and exits with code 1; proxied packages verify, local ones are reported. Keep the flag off if that report would break a CI gate, until Verdaccio signs local packages. `npm publish --provenance` is still rejected.

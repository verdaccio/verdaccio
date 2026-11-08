---
'verdaccio': minor
---

Update the `@verdaccio/*` modules to the `next-9` npm dist-tag.

**Minor changes**

- `@verdaccio/config`, `@verdaccio/store`, `@verdaccio/tarball`, `@verdaccio/web`: Add the experimental `flags.tarballMetadata` option, which lets the web UI show the README of the exact version being viewed and fills missing `dist.fileCount`/`dist.unpackedSize` from the tarball itself. ([#6409](https://github.com/verdaccio/verdaccio/pull/6409))

  The npm registry does not always include READMEs in package metadata: for some large packages (for example `react`) the README field is empty for every version, and Verdaccio by default keeps only the latest README for locally published packages (`publish.keep_readmes`). The web UI then showed "No README data found" or the README of a different version.

  With the flag on, a tarball is only ever unpacked in two situations: in the background right after a version is published, and when the web UI asks for a README the manifest does not have, reading the cached tarball or fetching it from the uplink. Package installs never unpack tarballs, so install performance is unaffected. The README is kept in memory, and `dist.fileCount`/`dist.unpackedSize` are written into the cached manifest when the uplink did not provide them. At most two tarballs are read at a time, and duplicate requests share one read.

  Tarballs larger than `tarball_metadata.max_size_mb` (default 20) are never unpacked; those versions keep the previous fallback to the latest README. The flag is off by default and the option may change or be removed in a later prerelease:

  ```yaml
  flags:
    tarballMetadata: true
  tarball_metadata:
    max_size_mb: 20
  ```
- `@verdaccio/middleware`, `@verdaccio/proxy`, `@verdaccio/store`, `@verdaccio/ui-theme`, `@verdaccio/web`: Show the provenance and registry signature of a version in the web UI. ([#6447](https://github.com/verdaccio/verdaccio/pull/6447))

  The package sidebar gets a "Provenance" section, under "Distribution", when the selected version carries a sigstore attestation or a registry signature, the fields registry.npmjs.org attaches to every version it signs. Its chip reads "Provenance: SLSA v1" for a version with provenance and "Registry signature" for one that only has a signature. Clicking it opens a dialog with the statement type, the signing key ids and a link to the attestation bundle. Nothing is verified in the browser: the dialog states what the registry metadata contains, and verification remains the job of `npm audit signatures`.

  The dialog also shows what the provenance statement says about the build, read from the attestation bundle by a new web endpoint, `GET /-/verdaccio/data/package/provenance/<name>?v=<version>`: the builder (GitHub Actions, self-hosted or not, or GitLab CI/CD, the two environments npm and Yarn generate provenance in), the source repository, ref and commit, the workflow file or job, the build run and the Sigstore transparency log entry, each linked to its origin. The endpoint relays the bundle from the uplink the version was synced from, applies the package access rules and answers 404 for versions without attestations. The build details therefore need an uplink that serves the npm attestation endpoint, `/-/npm/v1/attestations/<name>@<version>`, as registry.npmjs.org does; a Verdaccio upstream will only do so once it gains the registry signature routes, which are a separate change, and against such upstreams the dialog shows the summary and the bundle link alone. The request is made only when the dialog opens and only when the server announces the endpoint through the new `capabilities.provenance` UI option, so the theme keeps working against older servers without a single failing request: the chip, the dialog summary and the bundle link come from the sidebar data alone, and the build details simply stay out.
- `@verdaccio/api`, `@verdaccio/config`, `@verdaccio/core`, `@verdaccio/middleware`, `@verdaccio/proxy`, `@verdaccio/store`: Make `npm audit signatures` work through Verdaccio for packages proxied from an uplink, behind the experimental `flags.signatures` setting. ([#6450](https://github.com/verdaccio/verdaccio/pull/6450))

  Verdaccio already kept the `dist.signatures` and `dist.attestations` fields that registry.npmjs.org attaches to every version, but it did not serve the two routes the npm CLI reads to verify them. npm resolves signing keys by registry host, so against Verdaccio it requested `GET /-/npm/v1/keys`, received a 404 and aborted the whole command with `EMISSINGSIGNATUREKEY` on the first package coming from npmjs. Attestation bundles are fetched from the registry the package was installed from as well, so `GET /-/npm/v1/attestations/<name>@<version>` also returned 404.

  Both routes now exist when `flags.signatures: true` is set in the configuration (the feature is experimental and may change). `GET /-/npm/v1/keys` returns the signing keys of every configured uplink merged by key id (refreshed hourly) and answers 404 when none publishes keys. `GET /-/npm/v1/attestations/<name>@<version>` relays the attestations from the first uplink that proxies the package, applying the package `access` rules, and answers 404 when the uplink has none. With this `npm audit signatures` verifies registry signatures and provenance attestations of proxied packages exactly as it does against registry.npmjs.org. Enable it with:

  ```yaml
  flags:
    signatures: true
  ```

  Packages published to Verdaccio itself are not signed yet. npm treats any registry that publishes keys as a registry whose packages should all be signed, so once the flag is on `npm audit signatures` lists every locally published package as having a missing registry signature and exits with code 1; proxied packages verify, local ones are reported. Keep the flag off if that report would break a CI gate, until Verdaccio signs local packages. `npm publish --provenance` is still rejected.

**Patch changes**

- `@verdaccio/core`, `@verdaccio/package-filter`: Fix HTTP 500 responses for package requests when an installation forces minimatch 11. The access-rule matcher called the removed `makeRe` API. Use the supported matching API while retaining case-insensitive package access rules and first-match precedence. ([#6434](https://github.com/verdaccio/verdaccio/pull/6434))

  On the master and 7.x release lines, affected `@verdaccio/core` releases are `9.0.0-next-9.0` through `9.0.0-next-9.41`. Verdaccio releases using these modules include `9.0.0-next-9.0` through `9.0.0-next-9.41` and stable releases `7.0.0` through `7.0.2`. The affected 7.x prereleases using these modules are `7.0.0-beta.4`, `7.0.0-beta.6`, and `7.0.0-next-7.21` through `7.0.0-next-7.32`.

  The failure requires an override or resolution that replaces the declared minimatch dependency with version 11; default installations of those releases are not affected. Upgrade to a Verdaccio release containing the corrected core module before forcing minimatch 11.

  Update the package filter's direct minimatch dependency as well. Existing package access and filter configuration does not need to change.
- `@verdaccio/api`: Fix the registry closing the client connection after answering a failed tarball download, which made the next request on that keep-alive connection fail with `ECONNRESET` or "other side closed". ([#6438](https://github.com/verdaccio/verdaccio/pull/6438))

  When a tarball request fails before any data is sent, for example a 404 for a tarball that does not exist locally or on any uplink, the registry sent the JSON error response and then also passed the same error on to the HTTP framework. Because the response was already sent, the framework reacted by destroying the socket. Package managers reuse connections, so the request that followed on the same socket failed whenever the client sent it before noticing the close, which keep-alive clients under load usually do. Each of these failures also printed a raw `NotFoundError` stack trace to stderr. The download of a staged tarball (available when the `stage` flag is enabled) had the same problem.

  A failed tarball request is now answered once with its JSON error and the connection stays open for the next request. Failures after the download has started are unchanged: the connection is still terminated, because no error status can be sent at that point. No configuration change is needed.

  Affected: verdaccio 7.x (7.0.0 to 7.0.2) and the `@verdaccio/api` 9.0.0-next prereleases it ships, up to `9.0.0-next-9.42`. verdaccio 6.x is not affected.

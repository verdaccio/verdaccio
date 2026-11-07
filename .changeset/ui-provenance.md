---
'@verdaccio/middleware': minor
'@verdaccio/proxy': minor
'@verdaccio/store': minor
'@verdaccio/types': minor
'@verdaccio/ui-components': minor
'@verdaccio/web': minor
---

Show the provenance and registry signature of a version in the web UI.

The package sidebar gets a "Provenance" section, under "Distribution", when the selected version carries a sigstore attestation or a registry signature, the fields registry.npmjs.org attaches to every version it signs. Its chip reads "Provenance: SLSA v1" for a version with provenance and "Registry signature" for one that only has a signature. Clicking it opens a dialog with the statement type, the signing key ids and a link to the attestation bundle. Nothing is verified in the browser: the dialog states what the registry metadata contains, and verification remains the job of `npm audit signatures`.

The dialog also shows what the provenance statement says about the build, read from the attestation bundle by a new web endpoint, `GET /-/verdaccio/data/package/provenance/<name>?v=<version>`: the builder (GitHub Actions), the source repository, ref and commit, the workflow file, the build run and the Sigstore transparency log entry, each linked to its origin. The endpoint relays the bundle from the uplink that proxies the package, applies the package access rules and answers 404 for versions without attestations. The request is made only when the dialog opens and only when the server announces the endpoint through the new `capabilities.provenance` UI option, so the theme keeps working against older servers without a single failing request: the chip, the dialog summary and the bundle link come from the sidebar data alone, and the build details simply stay out.

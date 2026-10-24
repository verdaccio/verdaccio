---
'verdaccio': patch
---

Releases are published with npm provenance again.

verdaccio 6.10.5, 6.10.6 and 6.10.7 reached the npm registry without a provenance attestation, while every release from 6.9.0 to 6.10.4 had one. The release pipeline switched from `npm publish` to `yarn npm publish`, and yarn ignored the setting that requested provenance, so those versions were published through trusted publishing but without a signed SLSA statement. The package contents were not affected.

Package managers that compare trust evidence between versions, such as pnpm with `trustPolicy: no-downgrade`, refuse to install those three versions with `ERR_PNPM_TRUST_DOWNGRADE`. This release carries provenance again, so upgrading to it, or pinning 6.10.4 or earlier, installs cleanly; nothing else needs to change on the operator side.

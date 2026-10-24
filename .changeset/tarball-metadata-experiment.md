---
'@verdaccio/types': minor
'@verdaccio/config': minor
'@verdaccio/tarball': minor
'@verdaccio/store': minor
'@verdaccio/web': minor
'@verdaccio/test-helper': minor
---

Add the experimental `flags.tarballMetadata` option, which lets the web UI show the README of the exact version being viewed and fills missing `dist.fileCount`/`dist.unpackedSize` from the tarball itself.

The npm registry does not always include READMEs in package metadata: for some large packages (for example `react`) the README field is empty for every version, and Verdaccio by default keeps only the latest README for locally published packages (`publish.keep_readmes`). The web UI then showed "No README data found" or the README of a different version.

With the flag on, a tarball is only ever unpacked in two situations: in the background right after a version is published, and when the web UI asks for a README the manifest does not have, reading the cached tarball or fetching it from the uplink. Package installs never unpack tarballs, so install performance is unaffected. The README is kept in memory, and `dist.fileCount`/`dist.unpackedSize` are written into the cached manifest when the uplink did not provide them. At most two tarballs are read at a time, and duplicate requests share one read.

Tarballs larger than `tarball_metadata.max_size_mb` (default 20) are never unpacked; those versions keep the previous fallback to the latest README. The flag is off by default and the option may change or be removed in a later prerelease:

```yaml
flags:
  tarballMetadata: true
tarball_metadata:
  max_size_mb: 20
```

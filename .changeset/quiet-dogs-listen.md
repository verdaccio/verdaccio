---
'@verdaccio/api': patch
'@verdaccio/store': patch
'@verdaccio/types': patch
---

fix: preserve the package manifest's `access` value

Publishing a scoped package with an explicit access value now saves it in storage,
including when publishing a subsequent version. Publishing without an access value
or with `null` leaves any previously stored value unchanged.

The registry previously discarded this field during publishing and removed it when
preparing the response, even when it was present in storage. Full metadata requests
now return it unchanged at the top level. Manifests without `access` and abbreviated
install metadata responses remain unchanged. This does not change the configured
package access rules or grant additional permissions. No configuration change is needed;
republish with an explicit access value to populate metadata that was previously lost.

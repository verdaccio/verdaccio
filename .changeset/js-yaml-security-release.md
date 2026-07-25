---
'@verdaccio/config': patch
---

fix: publish the js-yaml 4.3.0 security upgrade (GHSA-52cp-r559-cp3m)

The js-yaml upgrades to 4.2.0 (#5969) and 4.3.0 (#6012) were merged without a
changeset, so they were never released: the published `@verdaccio/config@8.1.2`
still pins `js-yaml@4.1.1`, which is vulnerable to GHSA-52cp-r559-cp3m (YAML
merge-key chains forcing quadratic CPU consumption, high severity). Because the
pin is exact, downstream consumers such as the verdaccio 6.x server cannot heal
it through their own installs. This changeset releases the already-merged
upgrade.

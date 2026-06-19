---
'@verdaccio/package-filter': patch
---

perf(package-filter): skip manifest cleanup for packages that are not filtered

`npm search` invokes `filter_metadata` once for every matched package, which made
search disproportionately slow when the package-filter plugin was enabled
([#5837](https://github.com/verdaccio/verdaccio/issues/5837)). For a package that
no rule applies to, the plugin still cloned the whole manifest and ran every
cleanup pass (dist-tags, time, `_distfiles`, latest tag) even though nothing was
removed.

The filter now:

- returns the manifest untouched, without cloning, when neither block rules nor a
  date threshold are configured;
- runs the cleanup passes only when filtering actually removed or replaced a
  version (the manifest is already consistent otherwise);
- computes `created`/`modified` in a single O(n) pass instead of sorting.

Benchmark — `filter_metadata` on a 6000-version manifest (200 iterations each):

| scenario                                  |  before |   after | speedup |
| ----------------------------------------- | ------: | ------: | ------: |
| package matches no rule (search hot path) | 22.6 ms |  6.7 ms |    3.4x |
| block rule removes ~half the versions     | 26.3 ms | 20.3 ms |    1.3x |
| no block rule / date threshold configured | 21.0 ms |  0.4 ms |     52x |

Since `filter_metadata` runs once per matched package during search, this removes
the per-package overhead that made search slow with many cached packages.

Note: as a consequence the cleanup passes no longer rewrite metadata for manifests
the plugin did not filter. Manifests served from storage are already consistent, so
this is not observable in practice.

---
'verdaccio': patch
---

Update the `@verdaccio/*` modules to the `next-9` npm dist-tag.

**Patch changes**

- `@verdaccio/ui-theme`: chore(ui-theme): type clean-up ([#6456](https://github.com/verdaccio/verdaccio/pull/6456))
- `@verdaccio/store`: chore(store): type clean-up ([#6457](https://github.com/verdaccio/verdaccio/pull/6457))
- `@verdaccio/api`: Abort the storage read of a tarball download when the client disconnects before the response finishes. ([#6465](https://github.com/verdaccio/verdaccio/pull/6465))
- `@verdaccio/proxy`: Fix the `via` header sent to an uplink growing with every request when the uplink has a `headers` option in the config. ([#6463](https://github.com/verdaccio/verdaccio/pull/6463))
- `@verdaccio/store`: chore(store): skip storing secret if it's not changed ([#6458](https://github.com/verdaccio/verdaccio/pull/6458))

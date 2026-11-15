---
'@verdaccio/proxy': patch
---

Fix the `via` header sent to an uplink growing with every request when the uplink has a `headers` option in the config.

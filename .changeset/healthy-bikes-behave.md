---
'@verdaccio/cli': patch
'@verdaccio/types': patch
'@verdaccio/node-api': patch
'@verdaccio/server': patch
---

fix: restore logger on init

Enable logger after parse configuration and log the very first step on startup phase.

```bash
 warn --- experiments are enabled, it is recommended do not use experiments in production comment out this section to disable it
 info --- support for experiment [token]  is disabled
 info --- support for experiment [search]  is disabled
(node:50831) Warning: config.logs is deprecated, rename configuration to "config.log"
(Use `node --trace-warnings ...` to show where the warning was created)
 info --- http address http://localhost:4873/
 info --- version: 6.0.0-6-next.11
 info --- server started
```

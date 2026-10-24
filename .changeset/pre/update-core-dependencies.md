---
'@verdaccio/core': patch
'@verdaccio/config': patch
'@verdaccio/cli': patch
'@verdaccio/admin-cli': patch
'@verdaccio/tarball': patch
'@verdaccio/logger': patch
'@verdaccio/proxy': patch
'@verdaccio/hooks': patch
'@verdaccio/local-storage': patch
'@verdaccio/api': patch
'@verdaccio/middleware': patch
'@verdaccio/server': patch
'@verdaccio/web': patch
'@verdaccio/ui-components': patch
'@verdaccio/test-helper': patch
'verdaccio-audit': patch
'verdaccio-memory': patch
---

Update runtime dependencies across the registry and run the official Docker image on Node.js 26.

The Docker image now builds and runs on `node:26-alpine`, the Node.js line that becomes Active LTS on 28 October 2026; Node.js 24 entered maintenance on 20 October. Operators who extend the image should check that any native addons they install support Node.js 26.

The uplink, notification and audit HTTP client moves to `got` 16. Verdaccio does not use the options removed in that release (the HTTP/2 agent slot, `dnsCache` and the old `auth` stubs), so uplink configuration, `agent_options` and `https_proxy` behave as before. Uplink responses with an error status, such as a 404 for a package the uplink does not have, keep appearing in the `http` log as they did with `got` 15. The CLI moves to `chalk` 6 and the web UI's README renderer to `marked` 18.

The remaining updates are minor or patch releases: `express` 5.3.0 in every package that serves HTTP, `express-rate-limit` 8.7.1, `pino` 10.4.0, `js-yaml` 5.5.0, `tar-stream` 3.2.2, `sanitize-filename` 1.6.4, `process-warning` 5.1.1 and `memfs` 4.80.0. No configuration changes are required.

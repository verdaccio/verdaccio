---
'verdaccio-audit': minor
'@verdaccio/proxy': minor
---

feat: replace got-cjs and node-fetch with got v14

Replace `got-cjs` and `node-fetch` with the official `got` v14 package in `verdaccio-audit` and `@verdaccio/proxy`. This removes two legacy HTTP client dependencies in favor of a single, actively maintained one. Also replaces `https-proxy-agent` with `hpagent` in the audit plugin for consistency with the proxy package.

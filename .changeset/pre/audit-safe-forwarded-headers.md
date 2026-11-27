---
'verdaccio-audit': patch
---

Forward only audit-safe request headers to registry.npmjs.org, so client credentials (authorization, cookie, proxy-authorization, npm-otp and arbitrary npm-prefixed headers) are not relayed upstream.

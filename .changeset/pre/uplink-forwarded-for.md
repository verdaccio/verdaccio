---
'@verdaccio/proxy': patch
'@verdaccio/store': patch
---

Fix the `X-Forwarded-For` header sent to uplinks.

Tarball requests to an uplink carried the literal value `undefined`, because no client address is passed on that path. A reverse proxy or firewall in front of the uplink could log, rate limit or reject those requests under a bogus address. The header is now only generated when the client address is known, so tarball requests carry no `X-Forwarded-For`, as in 6.x.

Metadata requests forward the `X-Forwarded-For` chain the client request arrived with, followed by the client address. Since 7.x they sent the client address alone and dropped the incoming chain that 6.x forwarded.

An `X-Forwarded-For` value set in the `headers` option of an uplink takes precedence however the header name is capitalised. A lower-case `x-forwarded-for` lost against the generated value on tarball requests.

When the uplink goes through `http_proxy` or `https_proxy` no client-origin header is generated, as before; a value set in the uplink `headers` is still sent.

No configuration change is needed.

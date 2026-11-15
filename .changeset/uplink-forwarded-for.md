---
'@verdaccio/proxy': patch
'@verdaccio/store': patch
'@verdaccio/api': patch
---

Fix the `X-Forwarded-For` header sent to uplinks.

Tarball requests to an uplink carried the literal value `undefined`, because the client address was never passed along. A reverse proxy or firewall in front of the uplink could log, rate limit or reject those requests under a bogus address.

The header is now only sent when the client address is known, and it is built the same way for metadata and tarball requests: the `X-Forwarded-For` chain the client request arrived with, followed by the client address. Metadata requests had lost the incoming chain compared to 6.x, and tarball requests now carry it as well.

The client origin is only sent to a configured uplink. A tarball hosted on another host than the uplink is fetched without it. An `X-Forwarded-For` value set in the `headers` option of an uplink still takes precedence, and nothing is sent when the uplink goes through `http_proxy` or `https_proxy`, as before.

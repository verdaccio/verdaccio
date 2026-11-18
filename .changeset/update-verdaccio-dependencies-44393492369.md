---
'verdaccio': patch
---

Update the `@verdaccio/*` modules to the `next-9` npm dist-tag.

**Patch changes**

- `@verdaccio/middleware`: Fix requests returning 404 when Verdaccio's Express application is mounted under ([#6483](https://github.com/verdaccio/verdaccio/pull/6483))
  a path such as `/registry`. The request logger now preserves the path Express
  uses to route requests while continuing to log the complete original URL. This
  restores web package listing, search, login, and registry API requests under the
  mount path, including when middleware plugins continue asynchronously.

  The default suppression of static-file and successful ping logs also works under
  the mount path; failed pings remain visible. No configuration changes are needed.
  The problem was reproduced on the 9.x development line at
  `9.0.0-next-9.45`. The separate asynchronous web-routing failure reported in
  Verdaccio 6.x requires the fixes for that release line.
- `@verdaccio/ui-theme`: Fix the web UI failing to load parts of itself when Verdaccio is served under `url_prefix`. ([#6480](https://github.com/verdaccio/verdaccio/pull/6480))

  The UI loads some of its files on demand, such as the code and styles of the package detail page. Those requests went to `/-/static/` at the root of the host instead of below `url_prefix`, so behind a reverse proxy that only forwards the prefix they failed with 404. Package pages then showed "Something went wrong", and other pages could lose styles. The UI now requests these files relative to its own location, so they follow `url_prefix`. Registries served at the root of a host behave as before.

  This affected `@verdaccio/ui-theme` 9.0.0-next-9.2 and later, the web UI Verdaccio 6 and 7 ship. A reverse proxy rule that forwards `/-/static/` at the root to Verdaccio as a workaround is no longer needed.

  No configuration change is needed.
- `@verdaccio/proxy`, `@verdaccio/store`: Fix the `X-Forwarded-For` header sent to uplinks. ([#6476](https://github.com/verdaccio/verdaccio/pull/6476))

  Tarball requests to an uplink carried the literal value `undefined`, because no client address is passed on that path. A reverse proxy or firewall in front of the uplink could log, rate limit or reject those requests under a bogus address. The header is now only generated when the client address is known, so tarball requests carry no `X-Forwarded-For`, as in 6.x.

  Metadata requests forward the `X-Forwarded-For` chain the client request arrived with, followed by the client address. Since 7.x they sent the client address alone and dropped the incoming chain that 6.x forwarded.

  An `X-Forwarded-For` value set in the `headers` option of an uplink takes precedence however the header name is capitalised. A lower-case `x-forwarded-for` lost against the generated value on tarball requests.

  When the uplink goes through `http_proxy` or `https_proxy` no client-origin header is generated, as before; a value set in the uplink `headers` is still sent.

  No configuration change is needed.

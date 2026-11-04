---
'@verdaccio/api': patch
---

Fix the registry closing the client connection after answering a failed tarball download, which made the next request on that keep-alive connection fail with `ECONNRESET` or "other side closed".

When a tarball request fails before any data is sent, for example a 404 for a tarball that does not exist locally or on any uplink, the registry sent the JSON error response and then also passed the same error on to the HTTP framework. Because the response was already sent, the framework reacted by destroying the socket. Package managers reuse connections, so the request that followed on the same socket failed whenever the client sent it before noticing the close, which keep-alive clients under load usually do. Each of these failures also printed a raw `NotFoundError` stack trace to stderr. The download of a staged tarball (available when the `stage` flag is enabled) had the same problem.

A failed tarball request is now answered once with its JSON error and the connection stays open for the next request. Failures after the download has started are unchanged: the connection is still terminated, because no error status can be sent at that point. No configuration change is needed.

Affected: verdaccio 7.x (7.0.0 to 7.0.2) and the `@verdaccio/api` 9.0.0-next prereleases it ships, up to `9.0.0-next-9.42`. verdaccio 6.x is not affected.

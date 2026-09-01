---
'@verdaccio/store': patch
'@verdaccio/server': patch
'@verdaccio/api': patch
'@verdaccio/core': patch
---

fix tarball responses: send Content-Length and stop re-compressing tarballs

- store: `getTarball` now forwards the `content-length` event from the local
  fs stream and from uplink streams to the wrapping PassThrough — the API
  listened for it on the wrapper, so tarball responses never carried a
  `Content-Length` header and were always streamed chunked.
- server: the compression middleware no longer gzips
  `application/octet-stream` responses. mime-db marks octet-stream as
  compressible, so every (already gzipped) `.tgz` download was re-compressed
  on the fly for clients that accept gzip — npm and undici do by default —
  wasting CPU on every download and stripping the Content-Length header.
  JSON metadata responses stay compressed.
- api: when a tarball stream fails before headers are sent, the optimistic
  octet-stream content type is dropped so the JSON error body is served with
  the JSON content type, matching registry.npmjs.org.
- core: the `application/octet-stream` constant no longer carries a spurious
  `charset=utf-8`, matching what registry.npmjs.org sends.

# Verdaccio 7 behind a reverse proxy

Running Verdaccio behind a reverse proxy is a common practice. This folder
collects the available examples:

- **[Nginx](nginx/README.md)** — serve at root (`/`) or under a subpath
  (`/verdaccio/`), including a self-signed **SSL + HTTP/2** variant.
- **[Apache (httpd:2.4)](apache/README.md)** — `mod_proxy` reverse proxy.
- **[HTTPS Portal](https-portal/README.md)** — automated HTTPS (Let's Encrypt /
  self-signed) powered by nginx + Let's Encrypt.

## Common notes

All examples:

- forward `Host` and `X-Forwarded-Proto` so Verdaccio builds correct absolute
  URLs (tarball links, UI assets);
- raise the upload limit (`client_max_body_size 0;` for nginx,
  `LimitRequestBody 0` for Apache) so `npm publish` of large tarballs does not
  fail with HTTP `413`;
- reach the registry by its Compose service name over the default network.

See the [reverse proxy documentation](https://verdaccio.org/docs/reverse-proxy)
for the full reference.

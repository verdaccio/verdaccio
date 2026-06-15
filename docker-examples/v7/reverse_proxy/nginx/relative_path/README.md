# Nginx relative path with Verdaccio 7

This example runs **two** Verdaccio 7 (`7.x-next`) instances behind nginx:

- a root instance served at `http://localhost/`
- a relative-path instance (configured with `url_prefix: /verdaccio`) served at
  `http://localhost/verdaccio/`

The nginx config (`nginx/default.conf`) routes `/` to the root instance and
`/verdaccio/` to the relative-path instance. Configuration for each instance
lives in `conf/v7/` and `conf/v7_root/`.

## HTTP

```bash
docker compose up --build --force-recreate
```

Open <http://localhost/verdaccio/> (relative) and <http://localhost/> (root).

## SSL (self-signed)

```bash
docker compose -f docker-compose_ssl.yml up --build --force-recreate
```

Open <https://localhost/verdaccio/>. The certificate is self-signed
(see `nginx_ssl/`), so your browser/npm will warn about it.

> The TLS server uses `listen 443 ssl;` + `http2 on;` (the standalone `ssl on;`
> directive was removed in nginx 1.25.1).

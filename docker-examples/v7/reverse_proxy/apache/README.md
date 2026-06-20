# Verdaccio 7 behind Apache (httpd)

Run Verdaccio behind an **Apache httpd 2.4** reverse proxy. This is a common
setup when you already serve other sites through Apache.

## What's in here

- `docker-compose.yaml` — two services:
  - `verdaccio` — the registry (`verdaccio/verdaccio:7.x-next`) on port `4873`.
  - `apacheproxy` — `httpd:2.4` built from `apache_proxy/`, published on port `80`.
- `apache_proxy/Dockerfile` — enables `mod_proxy` / `mod_proxy_http` and includes the vhost.
- `apache_proxy/conf/verdaccio.conf` — the reverse-proxy virtual host.

The proxy reaches the registry over Compose's default network using the
service name `verdaccio`, so no `links` are required.

## Run it

```bash
docker compose up -d --build
```

Open <http://localhost/> — the proxy forwards every request to Verdaccio on
`http://verdaccio:4873/`.

## Useful commands

```bash
docker compose logs -f        # follow logs (Apache logs to stdout/stderr)
docker compose ps             # list running containers
docker compose down           # stop and remove the containers
```

## Notes

- `ProxyPreserveHost On` forwards the original `Host` header; `mod_proxy`
  automatically adds the `X-Forwarded-For` / `X-Forwarded-Host` headers.
- `AllowEncodedSlashes NoDecode` together with `nocanon` keeps encoded slashes
  intact, which matters for scoped packages (e.g. `@scope%2fpkg`).
- This example terminates plain HTTP. For TLS, add `mod_ssl` and an
  `https` virtual host, or front it with a dedicated TLS terminator.

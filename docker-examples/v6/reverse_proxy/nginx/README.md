# Verdaccio 6 behind Nginx

Run Verdaccio behind an **nginx** reverse proxy. This folder has two variants:

- [`root_path/`](root_path/docker-compose.yaml) — serve the registry at `/`.
- [`relative_path/`](relative_path/README.md) — serve it under a subpath
  (`/verdaccio/`), including an SSL example.

Both use the official `nginx:stable-alpine` image and reach the registry by its
Compose service name over the default network.

## Root path

```bash
cd root_path
docker compose up -d --build
```

Open <http://localhost/>.

## Relative path

See [`relative_path/README.md`](relative_path/README.md) for the HTTP and SSL
variants.

## Useful commands

```bash
docker compose logs -f     # follow logs
docker compose ps          # list containers
docker compose down        # stop and remove containers
```

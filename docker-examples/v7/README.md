# Verdaccio 7 Examples

> These examples target the Verdaccio 7 Docker image (`verdaccio/verdaccio:7.x-next`). We recommend using a recent Docker Engine with the Compose v2 plugin (`docker compose`).

## Mapping Volumes

- [Docker + Local Storage Volume + Verdaccio](docker-local-storage-volume/README.md) — persist storage and config with bind mounts.

## Reverse proxy

Run Verdaccio behind a reverse proxy (all under [`reverse_proxy/`](reverse_proxy/)):

- [Nginx](reverse_proxy/nginx/README.md) — root path and relative path (incl. SSL / HTTP/2).
- [Apache (httpd:2.4)](reverse_proxy/apache/README.md) — `mod_proxy` reverse proxy.
- [HTTPS Portal](reverse_proxy/https-portal/README.md) — automated HTTPS with Let's Encrypt / self-signed.

## Plugins

These examples use **legacy plugins** (the classic `@verdaccio/types` plugin API), which are still fully supported on Verdaccio 7. Plugins live in the image's `plugins` folder and are wired up in the `Dockerfile`.

- [Docker + Auth Plugin from a registry](plugins/docker-build-install-plugin/README.md) — install a published plugin (`verdaccio-auth-memory@next-7`) in a builder stage.
- [Docker + Local plugin](plugins/docker-local-plugin/README.md) — copy a local, dependency-free dummy auth plugin into the image.

## Kubernetes

- [Verdaccio 7 on Kubernetes with Helm](kubernetes/helm/README.md) — deploy with the official Verdaccio Helm chart.

## Amazon S3 storage

The S3 storage plugin is no longer bundled with these examples. Use the dedicated AWS plugin repository instead:

- [verdaccio/verdaccio-aws-s3-storage — `@verdaccio/aws-s3-storage`](https://github.com/verdaccio/verdaccio-aws-s3-storage)

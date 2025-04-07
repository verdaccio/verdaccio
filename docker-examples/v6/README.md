# Verdaccio 6 Examples

> We recommend to have installed the latest docker-compose

## Mapping Volumes

- [Docker + Local Storage Volume + Verdaccio](docker-local-storage-volume/README.md)

## Proxy

- [Docker + Nginx + Verdaccio](proxy/reverse_proxy/nginx/README.md)
- [Docker + Apache + Verdaccio](proxy/apache-verdaccio/README.md)
- [Docker + HTTPS Portal + Verdaccio](proxy/https-portal-example/README.md)

> Looking forward more examples with proxies.

## Plugins

Using plugins without `docker-compose` mapping volumes, all withing the `Dockerfile`.

- [Docker + Local Build Auth Plugin (local development)](plugins/docker-build-install-plugin/README.md)
- [Docker + Auth Plugin (from a registry)](plugins/docker-local-plugin/README.md)
- [Docker + Localstack S3 + Verdaccio](amazon-s3-docker-example/README.md)
- [Docker + GitHub OAuth + verdaccio-github-oauth-ui + Verdaccio](verdaccio-github-oauth-ui/README.md)

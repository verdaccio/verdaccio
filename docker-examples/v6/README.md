# Verdaccio 6 Examples

> We recommend to have installed [docker-compose >= 1.29.0](https://github.com/docker/compose/releases/tag/1.29.2)

## Mapping Volumes

- [Docker + Local Storage Volume + Verdaccio](docker-local-storage-volume/README.md)

## Proxy

- [Docker + Nginx + Verdaccio](proxy/reverse_proxy/nginx/README.md)
- [Docker + Apache + Verdaccio](proxy/apache-verdaccio/README.md)
- [Docker + HTTPS Portal + Verdaccio](proxy/https-portal-example/README.md)
- [Docker + Localstack S3 + Verdaccio](proxy/amazon-s3-docker-example/README.md)

> Looking forward more examples with proxies.

## Plugins

Using plugins without `docker-compose` mapping volumes, all withing the `Dockerfile`.

- [Docker + Local Build Auth Plugin (local development)](plugins/docker-build-install-plugin/README.md)
- [Docker + Auth Plugin (from a registry)](plugins/docker-local-plugin/README.md)

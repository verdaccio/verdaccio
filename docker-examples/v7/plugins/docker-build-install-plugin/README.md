# Installing a plugin with Docker build

On this small tutorial (based on [`verdaccio-prometheus-middleware`](https://github.com/xlts-dev/verdaccio-prometheus-middleware) example) you will be able to use a published package in any random registry (npmjs by default) and use it withing a docker image without mapping need it.

> This example uses a **legacy plugin** (the classic `@verdaccio/types` plugin API), which is still fully supported on Verdaccio 7 (the `7.x-next` Docker tag). The plugin is installed into the `verdaccio/plugins` folder so it is auto-discovered at runtime.

There are two main steps to highlight:

- `docker.yaml`: This is a copy of the original configuration file for docker and with small modifications to use the plugin [`verdaccio-auth-memory`](https://www.npmjs.com/package/verdaccio-auth-memory) and custom web title for demonstration.
- The `Dockerfile` take advance of the docker multi-stage build to install the plugin into the `verdaccio/plugins` folder withing the image, then we apply the right permissions `--chown=$VERDACCIO_USER_UID:root` so the plugin is recognized.

## Run it

Build this image.

```bash
docker build -t verdaccio/verdaccio:local .
```

and to run it

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio:local
```

## Usage

```dockerfile
# Docker multi-stage build - https://docs.docker.com/develop/develop-images/multistage-build/
# Use an alpine node image to install the plugin
FROM node:lts-alpine as builder

RUN mkdir -p /verdaccio/plugins \
  && cd /verdaccio/plugins \
  && npm install --global-style --no-bin-links --omit=optional verdaccio-auth-memory@next-7

FROM verdaccio/verdaccio:7.x-next

# copy your modified config.yaml into the image
ADD docker.yaml /verdaccio/conf/config.yaml

COPY --chown=$VERDACCIO_USER_UID:root --from=builder \
  /verdaccio/plugins/node_modules/verdaccio-auth-memory \
  /verdaccio/plugins/verdaccio-auth-memory

```

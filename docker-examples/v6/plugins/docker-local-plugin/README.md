# Installing a local plugin with Docker build

On this small tutorial (based on [`verdaccio-prometheus-middleware`](https://github.com/xlts-dev/verdaccio-prometheus-middleware) example) you will be able to use a published package in any random registry (npmjs by default) and use it withing a docker image without mapping need it.

> Since verdaccio:5 uses `yarn@2` to run the application, this tutorial is a workaround but future prove since verdaccio 6 uses `pnpm` to build the docker image.

There are three main steps to highlight:

- Note the custom plugin at `plugins/verdaccio-docker-memory` under the name `verdaccio-docker-memory`.
- Install the _production_ dependencies for the plugin `verdaccio-docker-memory`
- `docker.yaml`: This is a copy of the original configuration file for docker and with small modifications to use the local plugin `verdaccio-docker-memory`.
- The `Dockerfile` take advance of the docker multi-stage build to copy the local plugin into the `verdaccio/plugins` folder withing the image, then we apply the right permissions `--chown=$VERDACCIO_USER_UID:root` so the plugin is recognized.

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
FROM node:lts-alpine as builder
RUN mkdir -p /verdaccio/plugins
ADD plugins/verdaccio-docker-memory /verdaccio/plugins/verdaccio-docker-memory
RUN cd /verdaccio/plugins/verdaccio-docker-memory \
  && ls -ls \
  && npm install --production
FROM verdaccio/verdaccio:5
ADD docker.yaml /verdaccio/conf/config.yaml
COPY --chown=$VERDACCIO_USER_UID:root --from=builder \
  /verdaccio/plugins/verdaccio-docker-memory \
  /verdaccio/plugins/verdaccio-docker-memory
```

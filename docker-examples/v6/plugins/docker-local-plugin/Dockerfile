# Docs based on https://github.com/xlts-dev/verdaccio-prometheus-middleware#installation
# Docker multi-stage build - https://docs.docker.com/develop/develop-images/multistage-build/
# Use an alpine node image to install the plugin
FROM node:lts-alpine AS builder

RUN mkdir -p /verdaccio/plugins

# Copy the local plugin into the docker image
ADD plugins/verdaccio-docker-memory /verdaccio/plugins/verdaccio-docker-memory
# Install the production dependencies (be careful install devDependencies here)
RUN cd /verdaccio/plugins/verdaccio-docker-memory \
  && npm install --production

# The final built image will be based on the standard Verdaccio docker image.
FROM verdaccio/verdaccio:nightly-master

# Copy the plugin files over from the 'builder' node image.
# The `$VERDACCIO_USER_UID` env variable is defined in the base `verdaccio/verdaccio` image.
# Refer to: https://github.com/verdaccio/verdaccio/blob/v5.2.0/Dockerfile#L32
# The local verdaccio-docker-memory is setup as storage
ADD docker.yaml /verdaccio/conf/config.yaml  

# Copy the plugin into the /verdaccio/plugins 
COPY --chown=$VERDACCIO_USER_UID:root --from=builder \
  /verdaccio/plugins/verdaccio-docker-memory \
  /verdaccio/plugins/verdaccio-docker-memory

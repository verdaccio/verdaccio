# Docs based on https://github.com/xlts-dev/verdaccio-prometheus-middleware#installation

# Docker multi-stage build - https://docs.docker.com/develop/develop-images/multistage-build/
# Use an alpine node image to install the plugin
FROM node:lts-alpine AS builder

# Install the metrics middleware plugin
# npm docs
# --global-style https://docs.npmjs.com/cli/v7/commands/npm-install#global-style
# --no-bin-links https://docs.npmjs.com/cli/v7/commands/npm-install#bin-links
# --omit=optional 
RUN mkdir -p /verdaccio/plugins \
  && cd /verdaccio/plugins \
  && npm install --global-style --no-bin-links --omit=optional verdaccio-auth-memory@latest

# The final built image will be based on the standard Verdaccio docker image.
FROM verdaccio/verdaccio:nightly-master

# Copy the plugin files over from the 'builder' node image.
# The `$VERDACCIO_USER_UID` env variable is defined in the base `verdaccio/verdaccio` image.
# Refer to: https://github.com/verdaccio/verdaccio/blob/v5.2.0/Dockerfile#L32
ADD docker.yaml /verdaccio/conf/config.yaml  
COPY --chown=$VERDACCIO_USER_UID:root --from=builder \
  /verdaccio/plugins/node_modules/verdaccio-auth-memory \
  /verdaccio/plugins/verdaccio-auth-memory

# Example: load a LOCAL plugin into a Verdaccio image.
#
# The plugin `verdaccio-docker-dummy` (see ./plugins) is dependency-free, so it
# only needs to be copied into the image's `plugins` folder — no build step.
# If your plugin has dependencies, install them in a builder stage first; see
# the ../docker-build-install-plugin example.

FROM verdaccio/verdaccio:7.x-next

# Switch to root to copy files and set ownership.
# The `$VERDACCIO_USER_UID` env variable is defined in the base verdaccio image.
# Refer to: https://github.com/verdaccio/verdaccio/blob/master/Dockerfile
USER root

# Use the modified config that enables the local `docker-dummy` auth plugin.
COPY docker.yaml /verdaccio/conf/config.yaml

# Copy the local plugin into /verdaccio/plugins so Verdaccio auto-discovers it.
COPY --chown=$VERDACCIO_USER_UID:root \
  plugins/verdaccio-docker-dummy \
  /verdaccio/plugins/verdaccio-docker-dummy

USER $VERDACCIO_USER_UID

FROM --platform=${BUILDPLATFORM:-linux/amd64} node:22.21.1-alpine as builder

ENV NODE_ENV=production \
    VERDACCIO_BUILD_REGISTRY=https://registry.npmjs.org  \
    HUSKY_SKIP_INSTALL=1 \
    CI=true \
    HUSKY_DEBUG=1

RUN apk add --force-overwrite && \
    apk --no-cache add openssl ca-certificates wget && \
    apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python3 && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget -q https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.35-r0/glibc-2.35-r0.apk && \
    apk add --force-overwrite glibc-2.35-r0.apk

WORKDIR /opt/verdaccio-build
COPY . .

## build the project and create a tarball of the project for later
## global installation
RUN yarn config set npmRegistryServer $VERDACCIO_BUILD_REGISTRY && \
    yarn config set enableProgressBars true && \
    yarn config set enableScripts false && \
    yarn install --immutable && \
    yarn build
    
## pack the project
RUN yarn pack --out verdaccio.tgz \
    && mkdir -p /opt/tarball \
    && mv /opt/verdaccio-build/verdaccio.tgz /opt/tarball
## clean up and reduce bundle size
RUN rm -Rf /opt/verdaccio-build

FROM node:22.21.1-alpine
LABEL maintainer="https://github.com/verdaccio/verdaccio"

ENV VERDACCIO_APPDIR=/opt/verdaccio \
    VERDACCIO_USER_NAME=verdaccio \
    VERDACCIO_USER_UID=10001 \
    VERDACCIO_PORT=4873 \
    VERDACCIO_PROTOCOL=http
ENV PATH=$VERDACCIO_APPDIR/docker-bin:$PATH \
    HOME=$VERDACCIO_APPDIR

# yarn version included in [`node:alpine` Docker image](https://github.com/nodejs/docker-node/blob/b3d8cc15338c545a4328286b2df806b511e2b31b/22/alpine3.21/Dockerfile#L81)
ENV YARN_VERSION=1.22.22

WORKDIR $VERDACCIO_APPDIR

# https://github.com/Yelp/dumb-init
RUN apk --no-cache add openssl dumb-init

RUN mkdir -p /verdaccio/storage /verdaccio/plugins /verdaccio/conf

COPY --from=builder /opt/tarball .

USER root
# install verdaccio as a global package so is fully handled by npm
# ensure none dependency is being missing and is prod by default
RUN npm install -g $VERDACCIO_APPDIR/verdaccio.tgz \
    # copy default config file
    && cp /usr/local/lib/node_modules/verdaccio/node_modules/@verdaccio/config/build/conf/docker.yaml /verdaccio/conf/config.yaml \
    ## clean up cache
    && npm cache clean --force \
    && rm -Rf .npm/ \
    && rm $VERDACCIO_APPDIR/verdaccio.tgz \
    # yarn is not need it after this step
    # Also remove the symlinks added in the [`node:alpine` Docker image](https://github.com/nodejs/docker-node/blob/b3d8cc15338c545a4328286b2df806b511e2b31b/22/alpine3.21/Dockerfile#L99-L100).
    && rm -Rf /opt/yarn-v$YARN_VERSION/ /usr/local/bin/yarn /usr/local/bin/yarnpkg

ADD docker-bin $VERDACCIO_APPDIR/docker-bin

# Create a non-root system user for running Verdaccio securely
# - Uses custom UID from $VERDACCIO_USER_UID
# - Sets home directory to $VERDACCIO_APPDIR
# - Assigns a shell of /sbin/nologin to prevent login access
RUN adduser -u $VERDACCIO_USER_UID -S -D -h $VERDACCIO_APPDIR -g "$VERDACCIO_USER_NAME user" -s /sbin/nologin $VERDACCIO_USER_NAME && \
    # Ensure Verdaccio's CLI entry points and custom docker binaries are executable    
    chmod -R +x /usr/local/lib/node_modules/verdaccio/bin/verdaccio $VERDACCIO_APPDIR/docker-bin && \
    # Give ownership of critical runtime folders to the Verdaccio user
    chown -R $VERDACCIO_USER_UID:root /verdaccio/storage /verdaccio/conf && \
    # Allow group access to config and storage so other containers (e.g., volumes or init containers) can read/write if needed
    chmod -R g=u /verdaccio/storage /verdaccio/conf /etc/passwd

# Switch to the non-root Verdaccio user by UID for improved security
# This ensures all following operations (including `CMD`) run as an unprivileged user    
USER $VERDACCIO_USER_UID

# Expose Verdaccio's listening port (default: 4873) to the host
# This does not publish the port — that's handled at runtime with `-p` or `--publish`
EXPOSE $VERDACCIO_PORT

# Declare the storage directory as a Docker volume
# This allows data (packages, logs, etc.) to persist outside the container lifecycle
VOLUME /verdaccio/storage

# Set the entrypoint script
# - Used to adjust UID/GID dynamically in runtime (e.g. OpenShift)
# - Keeps CMD intact and allows passing custom commands
ENTRYPOINT ["uid_entrypoint"]

# Default command to start Verdaccio using the custom config
# - Uses environment variables for protocol and port binding
CMD verdaccio --config /verdaccio/conf/config.yaml --listen $VERDACCIO_PROTOCOL://0.0.0.0:$VERDACCIO_PORT

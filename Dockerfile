FROM --platform=${BUILDPLATFORM:-linux/amd64} node:24.14.1-alpine AS builder

ENV NODE_ENV=production \
    VERDACCIO_BUILD_REGISTRY=https://registry.npmjs.org

RUN apk add --no-cache \
    openssl \
    ca-certificates \
    g++ \
    gcc \
    libgcc \
    libstdc++ \
    linux-headers \
    make \
    python3 \
    libc6-compat

WORKDIR /opt/verdaccio-build

# Enable corepack for pnpm
RUN corepack enable pnpm

# Copy dependency manifests first for better layer caching
COPY package.json pnpm-lock.yaml ./

RUN pnpm config set registry $VERDACCIO_BUILD_REGISTRY && \
    pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# Pack and stage the tarball
RUN pnpm pack --pack-destination /opt/tarball

FROM --platform=${BUILDPLATFORM:-linux/amd64} node:24.14.1-alpine

LABEL maintainer="https://github.com/verdaccio/verdaccio" \
      org.opencontainers.image.title="Verdaccio" \
      org.opencontainers.image.description="A lightweight Node.js private proxy registry" \
      org.opencontainers.image.url="https://verdaccio.org" \
      org.opencontainers.image.source="https://github.com/verdaccio/verdaccio" \
      org.opencontainers.image.licenses="MIT"

ENV VERDACCIO_APPDIR=/opt/verdaccio \
    VERDACCIO_USER_NAME=verdaccio \
    VERDACCIO_USER_UID=10001 \
    VERDACCIO_PORT=4873 \
    VERDACCIO_PROTOCOL=http \
    VERDACCIO_ADDRESS=0.0.0.0
ENV PATH=$VERDACCIO_APPDIR/docker-bin:$PATH \
    HOME=$VERDACCIO_APPDIR

WORKDIR $VERDACCIO_APPDIR

# Install runtime dependencies + create directories + non-root user in a single layer
# https://github.com/Yelp/dumb-init
RUN apk --no-cache add openssl dumb-init \
    && mkdir -p /verdaccio/storage /verdaccio/plugins /verdaccio/conf \
    && adduser -u $VERDACCIO_USER_UID -S -D -h $VERDACCIO_APPDIR -g "$VERDACCIO_USER_NAME user" -s /sbin/nologin $VERDACCIO_USER_NAME

COPY --from=builder /opt/tarball .

# Install verdaccio globally, copy default config, and clean up in a single layer
RUN npm install -g $VERDACCIO_APPDIR/verdaccio-*.tgz \
    && cp /usr/local/lib/node_modules/verdaccio/node_modules/@verdaccio/config/build/conf/docker.yaml /verdaccio/conf/config.yaml \
    && npm cache clean --force \
    && rm -Rf .npm/ $VERDACCIO_APPDIR/verdaccio-*.tgz

COPY docker-bin $VERDACCIO_APPDIR/docker-bin

RUN chmod -R +x /usr/local/lib/node_modules/verdaccio/bin/verdaccio $VERDACCIO_APPDIR/docker-bin && \
    chown -R $VERDACCIO_USER_UID:root /verdaccio/storage /verdaccio/conf && \
    chmod -R g=u /verdaccio/storage /verdaccio/conf /etc/passwd

USER $VERDACCIO_USER_UID

EXPOSE $VERDACCIO_PORT

VOLUME /verdaccio/storage

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:$VERDACCIO_PORT/-/ping || exit 1

ENTRYPOINT ["uid_entrypoint"]

CMD ["/bin/sh", "-c", "verdaccio --config /verdaccio/conf/config.yaml --listen $VERDACCIO_PROTOCOL://$VERDACCIO_ADDRESS:$VERDACCIO_PORT"]

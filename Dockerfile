FROM --platform=${BUILDPLATFORM:-linux/amd64} node:24-alpine AS builder

ENV NODE_ENV=development \
    VERDACCIO_BUILD_REGISTRY=https://registry.npmjs.org

RUN apk --no-cache add \
    ca-certificates \
    g++ \
    gcc \
    libgcc \
    libstdc++ \
    linux-headers \
    make \
    python3

WORKDIR /opt/verdaccio-build
COPY . .

RUN npm -g i corepack && \
    corepack install && \
    pnpm config set registry $VERDACCIO_BUILD_REGISTRY && \
    pnpm install --frozen-lockfile --ignore-scripts && \
    pnpm run build && \
    pnpm --filter verdaccio --prod --legacy deploy /opt/verdaccio-deploy


# --------------------------------------------------
# Runtime
# --------------------------------------------------

FROM node:24-alpine

LABEL maintainer="https://github.com/verdaccio"

ARG VERDACCIO_AWS_S3_VERSION=12.1.1

ENV VERDACCIO_APPDIR=/opt/verdaccio \
    VERDACCIO_USER_NAME=verdaccio \
    VERDACCIO_USER_UID=10001 \
    VERDACCIO_PORT=4873 \
    VERDACCIO_PROTOCOL=http \
    VERDACCIO_ADDRESS=[::] \
    NODE_PATH=/usr/local/lib/node_modules

ENV PATH=$VERDACCIO_APPDIR/docker-bin:$PATH \
    HOME=$VERDACCIO_APPDIR

WORKDIR $VERDACCIO_APPDIR

RUN apk --no-cache add openssl dumb-init && \
    mkdir -p \
        /verdaccio/storage \
        /verdaccio/plugins \
        /verdaccio/conf \
        /verdaccio/conf/htpasswd-dir

COPY --from=builder /opt/verdaccio-deploy ./

RUN npm install -g verdaccio-aws-s3-storage@${VERDACCIO_AWS_S3_VERSION}

COPY docker-bin ./docker-bin
COPY packages/config/src/conf/docker.yaml /verdaccio/conf/config.yaml

RUN adduser \
      -u $VERDACCIO_USER_UID \
      -S \
      -D \
      -h $VERDACCIO_APPDIR \
      -g "$VERDACCIO_USER_NAME user" \
      -s /sbin/nologin \
      $VERDACCIO_USER_NAME && \
    chmod -R +x \
      $VERDACCIO_APPDIR/bin \
      $VERDACCIO_APPDIR/docker-bin && \
    touch /verdaccio/conf/htpasswd-dir/htpasswd && \
    chown -R \
      $VERDACCIO_USER_UID:root \
      /verdaccio/storage \
      /verdaccio/conf \
      /usr/local/lib/node_modules/verdaccio-aws-s3-storage && \
    chmod -R g=u \
      /verdaccio/storage \
      /verdaccio/conf \
      /etc/passwd

USER $VERDACCIO_USER_UID

EXPOSE 4873

VOLUME /verdaccio/storage

ENTRYPOINT ["uid_entrypoint"]

CMD ["/opt/verdaccio/bin/verdaccio", "--config", "/verdaccio/conf/config.yaml", "--listen", "http://[::]:4873"]

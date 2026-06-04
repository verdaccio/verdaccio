FROM --platform=${BUILDPLATFORM:-linux/amd64} node:24-alpine AS builder

ENV NODE_ENV=development \
    VERDACCIO_BUILD_REGISTRY=https://registry.npmjs.org

RUN apk --no-cache add ca-certificates g++ gcc libgcc libstdc++ linux-headers make python3

WORKDIR /opt/verdaccio-build
COPY . .

RUN npm -g i corepack && \
    corepack install && \
    pnpm config set registry $VERDACCIO_BUILD_REGISTRY && \
    pnpm install --frozen-lockfile --ignore-scripts && \
    pnpm run build && \
    pnpm --filter verdaccio --prod --legacy deploy /opt/verdaccio-deploy

FROM node:24-alpine
LABEL maintainer="https://github.com/verdaccio"

ENV VERDACCIO_APPDIR=/opt/verdaccio \
    VERDACCIO_USER_NAME=verdaccio \
    VERDACCIO_USER_UID=10001 \
    VERDACCIO_PORT=4873 \
    VERDACCIO_PROTOCOL=http \
    VERDACCIO_ADDRESS=[::]
ENV PATH=$VERDACCIO_APPDIR/docker-bin:$PATH \
    HOME=$VERDACCIO_APPDIR

WORKDIR $VERDACCIO_APPDIR

RUN apk --no-cache add openssl dumb-init && \
    mkdir -p /verdaccio/storage /verdaccio/plugins /verdaccio/conf

COPY --from=builder /opt/verdaccio-deploy ./
COPY docker-bin ./docker-bin
COPY packages/config/src/conf/docker.yaml /verdaccio/conf/config.yaml

RUN adduser -u $VERDACCIO_USER_UID -S -D -h $VERDACCIO_APPDIR -g "$VERDACCIO_USER_NAME user" -s /sbin/nologin $VERDACCIO_USER_NAME && \
    chmod -R +x $VERDACCIO_APPDIR/bin $VERDACCIO_APPDIR/docker-bin && \
    chown -R $VERDACCIO_USER_UID:root /verdaccio/storage /verdaccio/conf && \
    chmod -R g=u /verdaccio/storage /verdaccio/conf /etc/passwd

USER $VERDACCIO_USER_UID

EXPOSE $VERDACCIO_PORT

VOLUME /verdaccio/storage

ENTRYPOINT ["uid_entrypoint"]

CMD $VERDACCIO_APPDIR/bin/verdaccio --config /verdaccio/conf/config.yaml --listen $VERDACCIO_PROTOCOL://$VERDACCIO_ADDRESS:$VERDACCIO_PORT

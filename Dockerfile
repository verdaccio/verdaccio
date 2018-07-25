FROM node:10.3-alpine as builder

RUN apk --no-cache add openssl ca-certificates wget && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub && \
    wget -q https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.25-r0/glibc-2.25-r0.apk && \
    apk add glibc-2.25-r0.apk

WORKDIR /opt/verdaccio-build
COPY . .

ENV NODE_ENV=production \
    VERDACCIO_BUILD_REGISTRY=https://registry.npmjs.org/

RUN yarn config set registry $VERDACCIO_BUILD_REGISTRY && \
    yarn install --production=false && \
    yarn lint && \
    yarn code:docker-build && \
    yarn build:webui && \
    yarn cache clean && \
    yarn install --production=true --pure-lockfile



FROM node:10.3-alpine
LABEL maintainer="https://github.com/verdaccio/verdaccio"

RUN apk --no-cache add openssl dumb-init

RUN mkdir -p /verdaccio/storage /verdaccio/plugins /verdaccio/conf

ENV VERDACCIO_APPDIR=/opt/verdaccio
WORKDIR $VERDACCIO_APPDIR

COPY --from=builder /opt/verdaccio-build .

ADD conf/docker.yaml /verdaccio/conf/config.yaml

ENV PATH=${VERDACCIO_APPDIR}/bin:${PATH} \
    HOME=${VERDACCIO_APPDIR} \
    VERDACCIO_USER_NAME=verdaccio \
    VERDACCIO_USER_UID=10001

RUN adduser -u ${VERDACCIO_USER_UID} -S -D -h ${VERDACCIO_APPDIR} -g "${VERDACCIO_USER_NAME} user" -s /sbin/nologin ${VERDACCIO_USER_NAME} && \
    chmod -R +x ${VERDACCIO_APPDIR}/bin && \
    chown -R ${VERDACCIO_USER_UID}:root /verdaccio/storage && \
    chmod -R g=u /verdaccio/storage /etc/passwd

USER $VERDACCIO_USER_UID

ENV VERDACCIO_PORT 4873
ENV VERDACCIO_PROTOCOL http

EXPOSE $VERDACCIO_PORT

VOLUME /verdaccio/storage

ENTRYPOINT ["uid_entrypoint"]

CMD $VERDACCIO_APPDIR/bin/verdaccio --config /verdaccio/conf/config.yaml --listen $VERDACCIO_PROTOCOL://0.0.0.0:${VERDACCIO_PORT}

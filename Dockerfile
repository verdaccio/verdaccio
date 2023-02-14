FROM --platform=${BUILDPLATFORM:-linux/amd64} node:18.14.0-alpine as builder

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

FROM node:18.14.0-alpine
LABEL maintainer="https://github.com/verdaccio/verdaccio"

ENV VERDACCIO_APPDIR=/opt/verdaccio \
    VERDACCIO_USER_NAME=verdaccio \
    VERDACCIO_USER_UID=10001 \
    VERDACCIO_PORT=4873 \
    VERDACCIO_PROTOCOL=http
ENV PATH=$VERDACCIO_APPDIR/docker-bin:$PATH \
    HOME=$VERDACCIO_APPDIR

WORKDIR $VERDACCIO_APPDIR

# https://github.com/Yelp/dumb-init
RUN apk --no-cache add openssl dumb-init

RUN mkdir -p /verdaccio/storage /verdaccio/plugins /verdaccio/conf

COPY --from=builder /opt/tarball .

USER root
# install verdaccio as a global package so is fully handled by npm
# ensure none dependency is being missing and is prod by default
RUN npm install -g $VERDACCIO_APPDIR/verdaccio.tgz \ 
    ## clean up cache
    && npm cache clean --force \
    && rm -Rf .npm/ \
    && rm $VERDACCIO_APPDIR/verdaccio.tgz \
    # yarn is not need it after this step
    && rm -Rf /opt/yarn-v1.22.19/

ADD conf/docker.yaml /verdaccio/conf/config.yaml
ADD docker-bin $VERDACCIO_APPDIR/docker-bin

RUN adduser -u $VERDACCIO_USER_UID -S -D -h $VERDACCIO_APPDIR -g "$VERDACCIO_USER_NAME user" -s /sbin/nologin $VERDACCIO_USER_NAME && \
    chmod -R +x /usr/local/lib/node_modules/verdaccio/bin/verdaccio $VERDACCIO_APPDIR/docker-bin && \
    chown -R $VERDACCIO_USER_UID:root /verdaccio/storage && \
    chmod -R g=u /verdaccio/storage /etc/passwd

USER $VERDACCIO_USER_UID

EXPOSE $VERDACCIO_PORT

VOLUME /verdaccio/storage

ENTRYPOINT ["uid_entrypoint"]

CMD verdaccio --config /verdaccio/conf/config.yaml --listen $VERDACCIO_PROTOCOL://0.0.0.0:$VERDACCIO_PORT

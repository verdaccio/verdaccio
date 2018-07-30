FROM node:10.3-alpine
LABEL maintainer="https://github.com/verdaccio/verdaccio"

RUN apk --no-cache add wget openssl && \
    wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 && \
    chmod +x /usr/local/bin/dumb-init && \
    apk del openssl && \
    apk --no-cache add ca-certificates wget && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.25-r0/glibc-2.25-r0.apk && \
    apk add glibc-2.25-r0.apk

ENV APPDIR /usr/local/app

WORKDIR $APPDIR

ADD . $APPDIR

ENV NODE_ENV=production

RUN npm config set registry http://registry.npmjs.org/ && \
    yarn global add -s flow-bin@0.69.0 && \
    yarn install --production=false && \
    yarn lint && \
    yarn code:docker-build && \
    yarn build:webui && \
    yarn cache clean && \
    yarn install --production=true --pure-lockfile

RUN mkdir -p /verdaccio/storage /verdaccio/plugins /verdaccio/conf

ADD conf/docker.yaml /verdaccio/conf/config.yaml

RUN addgroup -S verdaccio && adduser -S -G verdaccio verdaccio && \
    chown -R verdaccio:verdaccio "$APPDIR" && \
    chown -R verdaccio:verdaccio /verdaccio

USER verdaccio

ENV VERDACCIO_PORT 4873
ENV VERDACCIO_LISTEN 0.0.0.0
ENV VERDACCIO_PROTOCOL http

EXPOSE $VERDACCIO_PORT

VOLUME ["/verdaccio"]

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]

CMD $APPDIR/bin/verdaccio --config /verdaccio/conf/config.yaml --listen $VERDACCIO_PROTOCOL://$VERDACCIO_LISTEN:$VERDACCIO_PORT

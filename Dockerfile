FROM node:8.1.4-alpine
LABEL maintainer="https://github.com/verdaccio/verdaccio"

RUN apk --no-cache add openssl && \
    wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 && \
    chmod +x /usr/local/bin/dumb-init && \
    apk del openssl

ENV APPDIR /usr/local/app

WORKDIR $APPDIR

ADD . $APPDIR

RUN npm config set registry http://registry.npmjs.org/

RUN npm install -g -s --no-progress yarn --pure-lockfile && \
    yarn

ENV NODE_ENV=production

RUN yarn run build:webui && \
        yarn cache clean && \
        yarn install --production --pure-lockfile

RUN mkdir -p /verdaccio/storage /verdaccio/conf
ADD conf/docker.yaml /verdaccio/conf/config.yaml

RUN addgroup -S verdaccio && adduser -S -G verdaccio verdaccio && \
    chown -R verdaccio:verdaccio "$APPDIR" && \
    chown -R verdaccio:verdaccio /verdaccio

USER verdaccio

ENV PORT 4873
ENV PROTOCOL http

EXPOSE $PORT

VOLUME ["/verdaccio"]

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]

CMD $APPDIR/bin/verdaccio --config /verdaccio/conf/config.yaml --listen $PROTOCOL://0.0.0.0:${PORT}

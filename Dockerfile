FROM node:6-alpine
LABEL maintainer="https://github.com/verdaccio/verdaccio"

ENV APPDIR /usr/local/app

RUN mkdir -p "$APPDIR"
WORKDIR $APPDIR
ADD . $APPDIR
RUN npm install

RUN mkdir -p /verdaccio/storage /verdaccio/conf
ADD conf/docker.yaml /verdaccio/conf/config.yaml

RUN addgroup -S verdaccio && adduser -S -g verdaccio verdaccio && \
    chown -R verdaccio:verdaccio "$APPDIR" && \
    chown -R verdaccio:verdaccio /verdaccio

USER verdaccio

ENV PORT 4873
EXPOSE $PORT

VOLUME ["/verdaccio"]

CMD ["sh", "-c", "${APPDIR}/bin/verdaccio --config /verdaccio/conf/config.yaml --listen 0.0.0.0:${PORT}"]

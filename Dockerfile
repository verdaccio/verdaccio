FROM node:alpine

ENV appdir /usr/local/app

RUN mkdir -p $appdir
WORKDIR  $appdir
COPY . $appdir
RUN npm install

RUN mkdir -p /verdaccio/storage /verdaccio/conf
ADD conf/docker.yaml /verdaccio/conf/config.yaml

RUN addgroup -S verdaccio && adduser -S -g verdaccio verdaccio && \
chown -R verdaccio:verdaccio $appdir && \
chown -R verdaccio:verdaccio /verdaccio

USER verdaccio

EXPOSE 4873

VOLUME ["/verdaccio"]

CMD ["sh", "-c", "${appdir}/bin/verdaccio --config /verdaccio/conf/config.yaml --listen 0.0.0.0:4873"]

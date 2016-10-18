FROM node:6.1.0-onbuild

RUN mkdir -p /verdaccio/storage /verdaccio/conf

WORKDIR /verdaccio

ADD conf/docker.yaml /verdaccio/conf/config.yaml

EXPOSE 4873

VOLUME ["/verdaccio/conf", "/verdaccio/storage"]

CMD ["/usr/src/app/bin/verdaccio", "--config", "/verdaccio/conf/config.yaml", "--listen", "0.0.0.0:4873"]

FROM node:6.1.0-onbuild

RUN adduser --disabled-password --gecos "" verdaccio && \
  mkdir -p /verdaccio/storage /verdaccio/conf && \
  chown -R verdaccio.verdaccio /verdaccio

USER verdaccio
WORKDIR /verdaccio

ADD conf/docker.yaml /verdaccio/conf/config.yaml

EXPOSE 4873

VOLUME ["/verdaccio/conf", "/verdaccio/storage"]

CMD ["/usr/src/app/bin/sinopia", "--config", "/verdaccio/conf/config.yaml", "--listen", "0.0.0.0:4873"]

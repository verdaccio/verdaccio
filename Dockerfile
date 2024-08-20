FROM node:21-alpine AS builder

LABEL maintainer="DevOps"

ARG TOKEN

USER root

RUN apk add bash

# Setup Artifact Registry Buildtime authentication
ADD --chmod=0744 https://artifacts.alcfd.com/latest?prefix=artifact_registry_setup artifact-registry-setup.sh

RUN mkdir -p /home/root &&  touch /home/root/.npmrc
RUN ./artifact-registry-setup.sh -k -b -n -u root

ENV NODE_ENV=development
ENV VERDACCIO_BUILD_REGISTRY=https://us-npm.pkg.dev/high-codex-314318/applovin-npm-virtual

RUN apk  update && \
    apk add openssl ca-certificates wget g++ gcc libgcc libstdc++ linux-headers make python3 && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget -q https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.35-r0/glibc-2.35-r0.apk && \
    apk add --force-overwrite glibc-2.35-r0.apk

WORKDIR /opt/verdaccio-build
COPY . .
RUN npm -g i pnpm@8.9.0 && \
    pnpm install --frozen-lockfile --ignore-scripts && \
    rm -Rf test && \
    pnpm run build
# FIXME: need to remove devDependencies from the build    
# NODE_ENV=production pnpm install --frozen-lockfile --ignore-scripts
# RUN pnpm install --prod --ignore-scripts

FROM node:21-alpine
LABEL maintainer="https://github.com/verdaccio/verdaccio"

ENV VERDACCIO_APPDIR=/opt/verdaccio \
    VERDACCIO_USER_NAME=verdaccio \
    VERDACCIO_USER_UID=10001 \
    VERDACCIO_PORT=4873 \
    VERDACCIO_PROTOCOL=http
ENV PATH=$VERDACCIO_APPDIR/docker-bin:$PATH \
    HOME=$VERDACCIO_APPDIR

WORKDIR $VERDACCIO_APPDIR

RUN apk add openssl dumb-init bash python3

# Setup Artifact Registry Buildtime authentication
ADD --chmod=0744 https://artifacts.alcfd.com/latest?prefix=artifact_registry_setup artifact-registry-setup.sh

RUN mkdir -p /home/root &&  touch /home/root/.npmrc

RUN ./artifact-registry-setup.sh -k -b -n -u root

RUN mkdir -p /verdaccio/storage /verdaccio/plugins /verdaccio/conf

COPY --from=builder /opt/verdaccio-build .

RUN ls packages/config/src/conf
ADD packages/config/src/conf/docker.yaml /verdaccio/conf/config.yaml

RUN adduser -u $VERDACCIO_USER_UID -S -D -h $VERDACCIO_APPDIR -g "$VERDACCIO_USER_NAME user" -s /sbin/nologin $VERDACCIO_USER_NAME && \
    chmod -R +x $VERDACCIO_APPDIR/packages/verdaccio/bin $VERDACCIO_APPDIR/docker-bin && \
    chown -R $VERDACCIO_USER_UID:root /verdaccio/storage && \
    chmod -R g=u /verdaccio/storage /etc/passwd

# Ensure the directories exist and set the proper permissions
RUN mkdir -p /home/verdaccio/ && \
chown -R verdaccio:10001 /home/verdaccio/ && \
chown -R verdaccio:10001 /opt/verdaccio/ && \
addgroup -g 10001 verdaccio

ADD --chmod=0744 https://artifacts.alcfd.com/latest?prefix=artifact_registry_setup artifact-registry-setup.sh

# Run artifact registry setup script
RUN ./artifact-registry-setup.sh -r -n -u verdaccio

RUN cp /home/verdaccio/.npmrc /opt/verdaccio/.npmrc

ADD https://artifacts.alcfd.com/latest?prefix=google-cloud-sdk&suffix=linux-x86_64.tar.gz /tmp/google-cloud-sdk.tar.gz

ENV CLOUDSDK_INSTALL_DIR /usr/local/gcloud/

RUN mkdir -p /usr/local/gcloud && \
  tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz && \
  /usr/local/gcloud/google-cloud-sdk/install.sh --usage-reporting false -q && \
  ls -lha /usr/local/gcloud

ENV PATH $PATH:/usr/local/gcloud/google-cloud-sdk/bin

RUN which gcloud

USER $VERDACCIO_USER_UID

EXPOSE $VERDACCIO_PORT

VOLUME /verdaccio/storage

ENTRYPOINT ["uid_entrypoint"]

CMD $VERDACCIO_APPDIR/packages/verdaccio/bin/verdaccio --config /verdaccio/conf/config.yaml --listen $VERDACCIO_PROTOCOL://0.0.0.0:$VERDACCIO_PORT

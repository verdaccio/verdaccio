---
id: docker
title: Docker
---

![alt Docker Pulls Count](https://dockeri.co/image/verdaccio/verdaccio "Docker Pulls Count")

Како бисте привукли (pull) најновији pre-built [docker image](https://hub.docker.com/r/verdaccio/verdaccio/):

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](assets/docker_verdaccio.gif)

<div id="codefund">''</div>

## Tagged Versions

Почевши од верзије `v2.x` можете повући docker images преко [таг](https://hub.docker.com/r/verdaccio/verdaccio/tags/), и онда:

За главне верзије:

```bash
docker pull verdaccio/verdaccio:4
```

За подверзије:

```bash
docker pull verdaccio/verdaccio:4.0
```

За специфичну верзију (patch):

```bash
docker pull verdaccio/verdaccio:4.0.0
```

> Ако Вас занима листа тагова, [посетите Docker Hub вебсајт](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

## Running Verdaccio using Docker

Како бисте покренули docker container:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

The last argument defines which image to use. The above line will pull the latest prebuilt image from dockerhub, if you haven't done that already.

Ако употребљавате опцију [build an image locally](#build-your-own-docker-image) користите `verdaccio` као последњи аргумент.

Можете користити `-v` како бисте везали (bind) mount `conf`, `storage` и `plugins` за hosts filesystem:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio \
  -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

> Note: Verdaccio runs as a non-root user (uid=10001) inside the container, if you use bind mount to override default, you need to make sure the mount directory is assigned to the right user. In above example, you need to run `sudo chown -R 10001:65533 /opt/verdaccio` otherwise you will get permission errors at runtime. [Use docker volume](https://docs.docker.com/storage/volumes/) је препоручено уместо коришћења bind mount.

Verdaccio 4 provides a new set of environment variables to modify either permissions, port or http protocol. Here the complete list:

| Својство              | default          | Опис                                               |
| --------------------- | ---------------- | -------------------------------------------------- |
| VERDACCIO_APPDIR      | `/opt/verdaccio` | the docker working directory                       |
| VERDACCIO_USER_NAME | `verdaccio`      | the system user                                    |
| VERDACCIO_USER_UID  | `10001`          | the user id being used to apply folder permissions |
| VERDACCIO_PORT        | `4873`           | the verdaccio port                                 |
| VERDACCIO_PROTOCOL    | `http`           | the default http protocol                          |

### Plugins

Plugins се могу инсталирати у посебном директоријуму и моунтовати коришћењем Docker-a Kubernetes. Ипак, постарајте се да "build" plugins са native dependencies коришћењем исте base image као Verdaccio Dockerfile-а.

```docker
FROM verdaccio/verdaccio

USER root

ENV NODE_ENV=production

RUN npm i && npm install verdaccio-s3-storage

USER verdaccio
```

### Docker и custom порт конфигурација

Any `host:port` configured in `conf/config.yaml` under `listen` **is currently ignored when using docker**.

If you want to reach Verdaccio docker instance under different port, lets say `5000` in your `docker run` command add the environment variable `VERDACCIO_PORT=5000` and then expose the port `-p 5000:5000`.

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio \
  -e "VERDACCIO_PORT=8080" -p 8080:8080 \  
  verdaccio/verdaccio
```

Of course the numbers you give to `-p` paremeter need to match.

### Коришћење HTTPS са Docker-ом

Можете конфигурисати протокол који ће verdaccio слушати (listen on) и то на сличан начин као што сте подесили port configuration. Потребно је да замените задату вредност("http") у `PROTOCOL` environment варијабли са "https", након што сте одредили сертификате у config.yaml.

```bash
docker run -it --rm --name verdaccio \
  --env "VERDACCIO_PROTOCOL=https" -p 4873:4873
  verdaccio/verdaccio
```

### Коришћење docker-compose

1. Набавите последњу верзију [docker-compose](https://github.com/docker/compose).
2. Build и покрените контејнер:

```bash
$ docker-compose up --build
```

You can set the port to use (for both container and host) by prefixing the above command with `VERDACCIO_PORT=5000`.

```yaml
version: '3.1'

services:
  verdaccio:
    image: verdaccio/verdaccio
    container_name: "verdaccio"
    networks:
      - node-network
    environment:
      - VERDACCIO_PORT=4873
    ports:
      - "4873:4873"
    volumes:
      - "./storage:/verdaccio/storage"
      - "./config:/verdaccio/conf"
      - "./plugins:/verdaccio/plugins"  
networks:
  node-network:
    driver: bridge
```

Docker ће направити именовани volume у коме ће се чувати подаци за апликацију. Можете користити `docker inspect` или `docker volume inspect` како бисте открили физичку локацију volume-а и изменили конфигурацију, на пример:

```bash
$ docker volume inspect verdaccio_verdaccio
[
    {
        "Name": "verdaccio_verdaccio",
        "Driver": "local",
        "Mountpoint": "/var/lib/docker/volumes/verdaccio_verdaccio/_data",
        "Labels": null,
        "Scope": "local"
    }
]

```

## Направите свој сопствени Docker image

```bash
docker build -t verdaccio .
```

Постоји такође и npm script за building docker image-а, тако да можете да задате и овако:

```bash
yarn run build:docker
```

Напомена: Први build може потрајати неколико минута пошто мора да покрене `npm install`, и поново ће трајати дуго ако промените било који фајл који није излистан у `.dockerignore`.

Примите к знању да за сваку docker команду морате имати на својој машини инсталиран docker заједно са docker executable која мора бити доступна на `$PATH`.

## Docker Примери

Постоји засебан репозиторијум који хостује мултипле конфигурације како би компоновао Docker images са `verdaccio`, на пример, reverse proxy:

<https://github.com/verdaccio/docker-examples>

## Docker Custom Builds

> If you have made an image based on Verdaccio, feel free to add it to this list.

* [docker-verdaccio-gitlab](https://github.com/snics/docker-verdaccio-gitlab)
* [docker-verdaccio](https://github.com/deployable/docker-verdaccio)
* [docker-verdaccio-s3](https://github.com/asynchrony/docker-verdaccio-s3) Приватни NPM контејнер који се може backup-овати на s3
* [docker-verdaccio-ldap](https://github.com/snadn/docker-verdaccio-ldap)
* [verdaccio-ldap](https://github.com/nathantreid/verdaccio-ldap)
* [verdaccio-compose-local-bridge](https://github.com/shingtoli/verdaccio-compose-local-bridge)
* [docker-verdaccio](https://github.com/Global-Solutions/docker-verdaccio)
* [verdaccio-docker](https://github.com/idahobean/verdaccio-docker)
* [verdaccio-server](https://github.com/andru255/verdaccio-server)
* [coldrye-debian-verdaccio](https://github.com/coldrye-docker/coldrye-debian-verdaccio) docker image омогућава verdaccio из coldrye-debian-nodejs.
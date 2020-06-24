---
id: docker
title: Docker
---

![alt Docker Pulls Count](https://dockeri.co/image/verdaccio/verdaccio "Docker Pulls Count")

Para descargar la última [imagen de Docker](https://hub.docker.com/r/verdaccio/verdaccio/):

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](assets/docker_verdaccio.gif)

<div id="codefund">''</div>

## Versiones con Etiquetas

Desde la versión `` puedes obtener imagenes de docker por [tag](https://hub.docker.com/r/verdaccio/verdaccio/tags/), de la siguiente manera:

Para usar una versión "major":

```bash
docker pull verdaccio/verdaccio:4
```

Para usar una versión "minor":

```bash
docker pull verdaccio/verdaccio:4.0
```

Para un (parche) especifico:

```bash
docker pull verdaccio/verdaccio:4.0.0
```

> Si estas interesado en un listado de todos tags, [por favor visite el sitio web de Docker Hub](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

## Running Verdaccio using Docker

Para ejecutar el contenedor docker:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

The last argument defines which image to use. The above line will pull the latest prebuilt image from dockerhub, if you haven't done that already.

Si has [construido una imagen localmente](#build-your-own-docker-image) usa `verdaccio` como el último argumento.

Puede usar `-v` para montar `conf`, `storage` and `plugins` a archivos de sistema alojados:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio \
  -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

> Note: Verdaccio runs as a non-root user (uid=10001) inside the container, if you use bind mount to override default, you need to make sure the mount directory is assigned to the right user. In above example, you need to run `sudo chown -R 10001:65533 /opt/verdaccio` otherwise you will get permission errors at runtime. [Usar el volumen docker](https://docs.docker.com/storage/volumes/) es recomendado antes que usar el montaje de unión.

Verdaccio 4 provides a new set of environment variables to modify either permissions, port or http protocol. Here the complete list:

| Propiedad             | default                | Descripción                                        |
| --------------------- | ---------------------- | -------------------------------------------------- |
| VERDACCIO_APPDIR      | `/opt/verdaccio-build` | the docker working directory                       |
| VERDACCIO_USER_NAME | `verdaccio`            | the system user                                    |
| VERDACCIO_USER_UID  | `10001`                | the user id being used to apply folder permissions |
| VERDACCIO_PORT        | `4873`                 | the verdaccio port                                 |
| VERDACCIO_PROTOCOL    | `http`                 | the default http protocol                          |

### Extensiones

Extensiones pueden ser instaladas en un directorio separado y montado usando Docker o Kubernetes, de todos modos debes asegurarte que construyes extensiones con dependencias nativas usando como base la imagen de Dockerfile Verdaccio.

```docker
FROM verdaccio/verdaccio

USER root

ENV NODE_ENV=production

RUN npm i && npm install verdaccio-s3-storage

USER verdaccio
```

### Configuración de Docker y puerto de escucha por defecto

Any `host:port` configured in `conf/config.yaml` under `listen` **is currently ignored when using docker**.

If you want to reach Verdaccio docker instance under different port, lets say `5000` in your `docker run` command add the environment variable `VERDACCIO_PORT=5000` and then expose the port `-p 5000:5000`.

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio \
  -e "VERDACCIO_PORT=8080" -p 8080:8080 \  
  verdaccio/verdaccio
```

Of course the numbers you give to `-p` paremeter need to match.

### Usando HTTPS con Docker

Puedes configurar el protocolo que verdaccio va a escuchar, similarmente que con la configuración del puerto. Tienes que anular el valor por defecto ("http") de la variable de ambiente a "https" de `PROTOCOL`, despues debe especificar los certificados en el config.yaml.

```bash
docker run -it --rm --name verdaccio \
  --env "VERDACCIO_PROTOCOL=https" -p 4873:4873
  verdaccio/verdaccio
```

### Usando docker-compose

1. Obtén la última versión de [docker-compose](https://github.com/docker/compose).
2. Construye y ejecuta el contenedor:

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

Docker generará un volumen con nombre que persistira con los datos de la aplicación. Puedes usar `docker inspect` o `docker volume inspect` para revelar la ubicación física del volumen y editar la configuración, de la siguiente manera:

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

## Construye tu propia imagen de Docker

```bash
docker build -t verdaccio .
```

Existe tambien un comando npm para construir la imagen de Docker, tambien puede hacerlo así:

```bash
yarn run build:docker
```

Note: El primer build podria tomar algunos minutos para construir porque necesita ejecutar `npm install`, y podría tardar mas cuando los archivos no estan listados en `.dockerignore`.

Please note that for any of the above docker commands you need to have docker installed on your machine and the docker executable should be available on your `$PATH`.

## Ejemplos con Docker

Existe un repositorio separado que aloja multiples configuraciones de imagenes Docker con `verdaccio`, por ejemplo, un servidor proxy a la inversa:

<https://github.com/verdaccio/docker-examples>

## Imágenes de Docker Personalizadas

> If you have made an image based on Verdaccio, feel free to add it to this list.

* [docker-verdaccio-gitlab](https://github.com/snics/docker-verdaccio-gitlab)
* [docker-verdaccio](https://github.com/deployable/docker-verdaccio)
* [docker-verdaccio-s3](https://github.com/asynchrony/docker-verdaccio-s3) Private NPM container that can backup to s3
* [docker-verdaccio-ldap](https://github.com/snadn/docker-verdaccio-ldap)
* [verdaccio-ldap](https://github.com/nathantreid/verdaccio-ldap)
* [verdaccio-compose-local-bridge](https://github.com/shingtoli/verdaccio-compose-local-bridge)
* [docker-verdaccio](https://github.com/Global-Solutions/docker-verdaccio)
* [verdaccio-docker](https://github.com/idahobean/verdaccio-docker)
* [verdaccio-server](https://github.com/andru255/verdaccio-server)
* [coldrye-debian-verdaccio](https://github.com/coldrye-docker/coldrye-debian-verdaccio) imagen de docker que ejecuta verdaccio desde coldrye-debian-nodejs.
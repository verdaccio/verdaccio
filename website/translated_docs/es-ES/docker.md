---
id: docker
title: Docker
---
<div class="docker-count">
  ![alt Docker Pulls Count](http://dockeri.co/image/verdaccio/verdaccio "Docker Pulls Count")
</div>

Para descargar la última [imagen de Docker](https://hub.docker.com/r/verdaccio/verdaccio/):

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](/svg/docker_verdaccio.gif)

## Versiones con Etiquetas

Desde la versión `` puedes obtener imagenes de docker por [tag](https://hub.docker.com/r/verdaccio/verdaccio/tags/), de la siguiente manera:

Para usar una versión "major":

```bash
docker pull verdaccio/verdaccio:3
```

Para usar una versión "minor":

```bash
docker pull verdaccio/verdaccio:3.0
```

Para un (parche) especifico:

```bash
docker pull verdaccio/verdaccio:3.0.1
```

Para el siguiente gran lanzamiento usando la versión `beta` (rama principal).

```bash
docker pull verdaccio/verdaccio:beta
```

> Si estas interesado en un listado de todos tags, [por favor visite el sitio web de Docker Hub](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

## Ejecutando verdaccio usando Docker

Para ejecutar el contenedor docker:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

El último argumento define cual imagen se usa. En la linea de abajo se descargará la ultima imagen desde Docker Hub, si no existía previamente.

Si has [construido una imagen localmente](#build-your-own-docker-image) usa `verdaccio` como el último argumento.

You can use `-v` to bind mount `conf` and `storage` to the hosts filesystem:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  verdaccio/verdaccio
```

> Note: Verdaccio runs as a non-root user (uid=100, gid=101) inside the container, if you use bind mount to override default, you need to make sure the mount directory is assigned to the right user. In above example, you need to run `sudo chown -R 100:101 /opt/verdaccio` otherwise you will get permission errors at runtime. [Use docker volume](https://docs.docker.com/storage/volumes/) is recommended over using bind mount.

### Docker y configuración personalizada del puerto

Cualquier `host:port` configurado en `conf/config.yaml` bajo `listen` está actualmente ignorado al usar docker.

If you want to reach verdaccio docker instance under different port, lets say `5000` in your `docker run` command replace `-p 4873:4873` with `-p 5000:4873`.

En caso de que necesites especificar cuál puerto escuchar **en el contenedor docker**, desde la versión 2.?.? puedes hacerlo al proveer argumentos adicionales a `docker run`: `--env PORT=5000` Esto cambia cual puerto el contenedor docker muestra y el puerto que verdaccio escucha.

Por supuesto que los número que le das al parámetro `-p` necesitan coincidir, así que asumiendo que quieres que todos sean iguales, esto es lo que pudieses copiar, pegar y adoptar:

```bash
PORT=5000; docker run -it --rm --name verdaccio \
  --env PORT -p $PORT:$PORT
  verdaccio/verdaccio
```

### Usando HTTPS con Docker

Puedes configurar el protocolo que verdaccio va a escuchar, similar a la configuración de puerto. You have to overwrite the default value("http") of the `PROTOCOL` environment variable to "https", after you specified the certificates in the config.yaml.

```bash
PROTOCOL=https; docker run -it --rm --name verdaccio \
  --env PROTOCOL -p 4873:4873
  verdaccio/verdaccio
```

### Usando docker-compose

1. Obtener la última versión de [docker-compose](https://github.com/docker/compose).
2. Construye y ejecuta el contenedor:

```bash
$ docker-compose up --build
```

You can set the port to use (for both container and host) by prefixing the above command with `PORT=5000`.

Docker will generate a named volume in which to store persistent application data. You can use `docker inspect` or `docker volume inspect` to reveal the physical location of the volume and edit the configuration, such as:

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
    
    

## Construye tu propia imagen de Docker

```bash
docker build -t verdaccio .
```

There is also an npm script for building the docker image, so you can also do:

```bash
npm run build:docker
```

Note: The first build takes some minutes to build because it needs to run `npm install`, and it will take that long again whenever you change any file that is not listed in `.dockerignore`.

If you want to use the docker image on a rpi or a compatible device there is also a dockerfile available. To build the docker image for raspberry pi execute:

```bash
npm run build:docker:rpi
```

Please note that for any of the above docker commands you need to have docker installed on your machine and the docker executable should be available on your `$PATH`.

## Ejemplos con Docker

There is a separate repository that hosts multiple configurations to compose Docker images with `verdaccio`, for instance, as reverse proxy:

<https://github.com/verdaccio/docker-examples>

## Imágenes de Docker Personalizadas

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
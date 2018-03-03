---
id: docker
title: Docker
---
Para descargar la última [imagen de Docker](https://hub.docker.com/r/verdaccio/verdaccio/):

```bash
docker pull verdaccio/verdaccio
```

## Versiones con Etiquetas

A partir de la versión `v2.x` puedes descargar imagenes de docker por [tag](https://hub.docker.com/r/verdaccio/verdaccio/tags/), como a continuación:

Para usar una versión "major":

```bash
docker pull verdaccio/verdaccio:2
```

Para usar una versión "minor":

```bash
docker pull verdaccio/verdaccio:2.1
```

Para usar una versión mas específica ("patch"):

```bash
docker pull verdaccio/verdaccio:2.1.7
```

Para usar el siguiente lanzamiento se usa el tag ` beta`.

```bash
docker pull verdaccio/verdaccio:beta
```

The Canary version (master branch) is tagged as `alpha`

```bash
docker pull verdaccio/verdaccio:alpha
```

> Si estas interesado en un listado de todos tags, [por favor visite el sitio web de Docker Hub](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

## Ejecutando verdaccio usando Docker

Para ejecutar el contenedor de docker:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

El último argumento define cual imagen se usa. En la linea de abajo se descargará la ultima imagen desde Docker Hub, si ya no existía previamente.

Si ya has [construido tu imagen](#build-your-own-docker-image) usa `verdaccio` como último argumento.

Puedes usar `-v` para montar `conf` y `storage` desde tu sistema de archivos:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  verdaccio/verdaccio
```

### Usar un puerto personalizado con Docker

Any `host:port` configured in `conf/config.yaml` under `listen` is currently ignored when using docker.

If you want to reach verdaccio docker instance under different port, lets say `5000` in your `docker run` command replace `-p 4873:4873` with `-p 5000:4873`.

In case you need to specify which port to listen to **in the docker container**, since version 2.?.? you can do so by providing additional arguments to `docker run`: `--env PORT=5000` This changes which port the docker container exposes and the port verdaccio listens to.

Of course the numbers you give to `-p` paremeter need to match, so assuming you want them to all be the same this is what you could copy, paste and adopt:

```bash
PORT=5000; docker run -it --rm --name verdaccio \
  --env PORT -p $PORT:$PORT
  verdaccio/verdaccio
```

### Configura Docker con HTTPS

Puedes configurar el protocolo que verdaccio, de manera similar la configuración del puerto. Puedes sobre escribir el vapor por defecto ("http") de la variable de entorno `PROTOCOL` a "https", después puedes especificar el certificado en config.yaml.

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

Puedes usar el puerto a usar (para el contenedor y el cliente) prefijando el comando `PORT=5000`.

Docker generará un volumen en cual persistirá los datos de almacenamiento de la aplicación. Puedes usar `docker inspect` o `docker volume inspect` para revelar el contenido físico del volumen y editar la configuración tal como:

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

Dentro del proyecto existe un script the npm para simplificar la creación de la imagen de Docker:

```bash
npm run build:docker
```

Note: The first build takes some minutes to build because it needs to run `npm install`, and it will take that long again whenever you change any file that is not listed in `.dockerignore`.

If you want to use the docker image on a rpi or a compatible device there is also a dockerfile available. To build the docker image for raspberry pi execute:

```bash
npm run build:docker:rpi
```

Please note that for any of the above docker commands you need to have docker installed on your machine and the docker executable should be available on your `$PATH`.

## Docker Examples

There is a separate repository that hosts multiple configurations to compose Docker images with `verdaccio`, for instance, as reverse proxy:

https://github.com/verdaccio/docker-examples

## Docker Custom Builds

* [docker-verdaccio-gitlab](https://github.com/snics/docker-verdaccio-gitlab)
* [docker-verdaccio](https://github.com/deployable/docker-verdaccio)
* [docker-verdaccio-s3](https://github.com/asynchrony/docker-verdaccio-s3) Private NPM container that can backup to s3
* [docker-verdaccio-ldap](https://github.com/snadn/docker-verdaccio-ldap)
* [verdaccio-ldap](https://github.com/nathantreid/verdaccio-ldap)
* [verdaccio-compose-local-bridge](https://github.com/shingtoli/verdaccio-compose-local-bridge)
* [docker-verdaccio](https://github.com/Global-Solutions/docker-verdaccio)
* [verdaccio-docker](https://github.com/idahobean/verdaccio-docker)
* [verdaccio-server](https://github.com/andru255/verdaccio-server)
* [coldrye-debian-verdaccio](https://github.com/coldrye-docker/coldrye-debian-verdaccio) docker image providing verdaccio from coldrye-debian-nodejs.
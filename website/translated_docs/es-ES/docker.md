---
id: docker
title: Docker
---
Para descargar la última [imagen de Docker](https://hub.docker.com/r/verdaccio/verdaccio/):

`docker pull verdaccio/verdaccio`

## Versiones con Etiquetas

Desde la versión `v2.x` puedes descargar imágenes de Docker [por etiquetas](https://hub.docker.com/r/verdaccio/verdaccio/tags/), a como se define aquí:

Para la versión mayor:

```bash
docker pull verdaccio/verdaccio:2
```

Para la versión menor:

```bash
docker pull verdaccio/verdaccio:2.1
```

Para un (parche) especifico:

```bash
docker pull verdaccio/verdaccio:2.1.7
```

Para el próximo mayor lanzamiento usando la versión `beta`.

```bash
docker pull verdaccio/verdaccio:beta
```

Para la versión no estable (master branch) se etiqueta como ` next`

```bash
docker pull verdaccio/verdaccio:next
```

## Ejecutando verdaccio usando Docker

Para ejecutar el contenedor de Docker:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

El último argumento define cual imagen se usará. La linea anterior descargara la ultima imagen desde dockerhub, si you no lo has echo aún.

Si has[construido la imagen localmente](#build-your-own-docker-image)usa solamente ` http://www. verdaccio. org/verdaccio/` como último argumento.

Puedes usar `-v` para montar ` conf` y ` storage` como volúmenes externos:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  verdaccio/verdaccio
```

### Docker and custom port configuration

Any `host:port` configured in `conf/config.yaml` under `listen` is currently ignored when using docker.

If you want to reach verdaccio docker instance under different port, lets say `5000` in your `docker run` command replace `-p 4873:4873` with `-p 5000:4873`.

In case you need to specify which port to listen to **in the docker container**, since version 2.?.? you can do so by providing additional arguments to `docker run`: `--env PORT=5000` This changes which port the docker container exposes and the port verdaccio listens to.

Of course the numbers you give to `-p` paremeter need to match, so assuming you want them to all be the same this is what you could copy, paste and adopt:

```bash
PORT=5000; docker run -it --rm --name verdaccio \
  --env PORT -p $PORT:$PORT
  verdaccio/verdaccio
```

### Using HTTPS with Docker

You can configure the protocol verdaccio is going to listen on, similarly to the port configuration. You have to overwrite the default value("http") of the `PROTOCOL` environment variable to "https", after you specified the certificates in the config.yaml.

```bash
PROTOCOL=https; docker run -it --rm --name verdaccio \
  --env PROTOCOL -p 4873:4873
  verdaccio/verdaccio
```

### Using docker-compose

1. Get the latest version of [docker-compose](https://github.com/docker/compose).
2. Build and run the container:

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
    
    

## Build your own Docker image

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

## Docker Examples

There is a separate repository that hosts multiple configurations to compose Docker images with `verdaccio`, for instance, as reverse proxy:

https://github.com/verdaccio/docker-examples
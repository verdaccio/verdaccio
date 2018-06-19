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

> Note: Verdaccio runs as a non-root user (uid=100, gid=101) inside the container, if you use bind mount to override default, you need to make sure the mount directory is assigned to the right user. En el ejemplo de arriba, necesitas ejecutar `sudo chown -R 100:101 /opt/verdaccio` de lo contrario, obtendrás errores de permiso en tiempo de ejecución. [Usar el volumen docker](https://docs.docker.com/storage/volumes/) es recomendado antes que usar el montaje de unión.

### Usar un puerto personalizado con Docker

Cualquier `host:port` configurado en `conf/config.yaml` bajo `listen` está actualmente ignorado al usar docker.

Si quieres alcanzar la instancia de docker de verdaccio bajo un puerto diferente, digamos `5000` en tu comando `docker run` remplaza `-p 4873:4873` con `-p 5000:4873`.

En caso de que necesites especificar cuál puerto escuchar **en el contenedor docker**, desde la versión 2.?.? puedes hacerlo al proveer argumentos adicionales a `docker run`: `--env PORT=5000` Esto cambia cual puerto el contenedor docker muestra y el puerto que verdaccio escucha.

Por supuesto que los número que le das al parámetro `-p` necesitan coincidir, así que asumiendo que quieres que todos sean iguales, esto es lo que pudieses copiar, pegar y adoptar:

```bash
PORT=5000; docker run -it --rm --name verdaccio \
  --env PORT -p $PORT:$PORT
  verdaccio/verdaccio
```

### Configura Docker con HTTPS

Puedes configurar el protocolo que verdaccio va a escuchar, similar a la configuración de puerto. Tienes que sobre escribir el valor por defecto ("http") de la variable del entorno `PROTOCOL` a "https", luego de haber especificado los certificados en config.yaml.

```bash
PROTOCOL=https; docker run -it --rm --name verdaccio \
  --env PROTOCOL -p 4873:4873
  verdaccio/verdaccio
```

### Usando docker-compose

1. Obtén la última versión de [docker-compose](https://github.com/docker/compose).
2. Construye y ejecuta el contenedor:

```bash
$ docker-compose up --build
```

Puedes configurar el puerto a usar (tanto para el contenedor como para el cliente) prefijando el comando anterior con `PORT=5000`.

Docker generará un volumen con nombre en el cual se almacenan datos de aplicación persistente. Puedes usar `docker inspect` ó `docker volume inspect` para revelar la ubicación física del volumen y editar la configuración, tal como:

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

Existe también un script npm para construir la imagen docker, para que también puedas hacer:

```bash
npm run build:docker
```

Nota: La primera construcción toma algunos minutos para construir porque necesita ejecutar el `npm install`, y tomará el mismo tiempo cada vez que cambies cualquier archivo que no esté listado en `.dockerignore`.

Si quieres usar la imagen docker en un rpi o en un dispositivo compatible, también existe un dockerfile disponible. Para construir la imagen docker para raspberry pi ejecute:

```bash
npm run build:docker:rpi
```

Por favor note que para cualquier comando docker de arriba, necesitas tener un docker instalado en tu máquina y el docker ejecutable debe estar disponible en tu `$PATH`.

## Ejemplos con Docker

Existe un repositorio separado que aloja múltiples configuraciones para componer imágenes Docker con `verdaccio`, por ejemplo, como proxy inverso:

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
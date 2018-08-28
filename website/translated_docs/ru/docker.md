---
id: docker
title: Docker
---
<div class="docker-count">
  ![alt Количество скачиваний](http://dockeri.co/image/verdaccio/verdaccio "Количество скачиваний")
</div>

Для скачивания последней версии [Docker образа](https://hub.docker.com/r/verdaccio/verdaccio/):

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](/svg/docker_verdaccio.gif)

## Версии с меткой

Начиная с версии `v2.x` вы можете скачать Docker образ [тег](https://hub.docker.com/r/verdaccio/verdaccio/tags/), так:

Для базовых версий:

```bash
docker pull verdaccio/verdaccio:3
```

Для минорной версии:

```bash
docker pull verdaccio/verdaccio:3.0
```

Конкретная версия (патч):

```bash
docker pull verdaccio/verdaccio:3.0.1
```

Следующая базовая версия, при помощи тега `beta` (ветка master).

```bash
docker pull verdaccio/verdaccio:beta
```

> Если вас интересует весь список тегов, [посетите нашу страницу на сайте Docker Hub](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

## Запуск verdaccio с использованием Docker

Запуск Docker контейнера:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

Последний аргумент указывает на то, какой именно образ нужно использовать. Эта команда скачает последний образ из Docker Hub, если вы ещё не сделали этого ранее.

Если этот образ [у вас уже скачан](#build-your-own-docker-image) используйте `verdaccio` в качестве последнего аргумента.

Вы можете использовать `-v` для того, что бы примонтировать каталоги `conf`, `storage` и `plugins` к основной (host) файловой системе:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

> Примечание: Verdaccio, внутри контейнера, запускается не из под root (uid=100, gid=101), если вы используете монтирование каталогов, вам необходимо убедиться, что у пользователя, из контейнера, будет доступ к этим каталогам. В примере выше, вам нужно выполнить `sudo chown -R 100:101 /opt/verdaccio` иначе вы получите ошибку прав доступа во время запуска контейнера. Рекомендуется использовать [Docker разделы](https://docs.docker.com/storage/volumes/) при монтировании каталогов.

### Плагины

Плагины могут быть установлены в отдельную директорию и смонтированы с использованием Docker или Kubernetes. Однако вам нужно убедиться, что вы используете встроенные плагины с родными зависимостями, использующими такой же базовый образ как и в Verdaccio Dockerfile.

### Docker и конфигурация пользовательского порта

В настоящее время любой `host:port`, настроенный в `conf/config.yaml` в опции `listen` игнорируется при использовании Докер.

Если вам необходимо чтобы docker-экземпляр verdaccio работал на другом порту, скажем на `5000`, в вашей `docker run` команде нужно заменить `-p 4873:4873` на `-p 5000:4873`.

В том случае, когда вам нужно указать какой порт слушать **в docker контейнере**, начиная с версии 2.?.?, вы можете указать дополнительный аргумент в `docker run`: `--env PORT=5000` Это изменит порт, который docker контейнер будет слушать и порт, который будет слушать verdaccio.

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

<https://github.com/verdaccio/docker-examples>

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
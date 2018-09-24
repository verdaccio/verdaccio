---
id: docker
title: Docker
---
<div class="docker-count">
  ![alt Docker Pulls Count](http://dockeri.co/image/verdaccio/verdaccio "Docker Pulls Count")
</div>

Per scaricare la più recente [immagine docker](https://hub.docker.com/r/verdaccio/verdaccio/) pre costruita:

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](/svg/docker_verdaccio.gif)

## Versioni taggate

Dalla versione `v2.x` si possono ottenere immagini docker per [tag](https://hub.docker.com/r/verdaccio/verdaccio/tags/), come segue:

Per una versione maggiore:

```bash
docker pull verdaccio/verdaccio:3
```

Per una versione minore:

```bash
docker pull verdaccio/verdaccio:3.0
```

Per una specifica (patch) versione:

```bash
docker pull verdaccio/verdaccio:3.0.1
```

Per la successiva maggiore release che utilizzi la versione `beta` (ramo master).

```bash
docker pull verdaccio/verdaccio:beta
```

> Se si è interessati ad un elenco dei tag, [ si prega di visitare il sito Docker Hub](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

## Eseguire verdaccio utilizzando Docker

Per avviare il contenitore Docker:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

L'ultimo argomento definisce quale immagine si utilizza. La riga sopra scaricherà da dockerhub l'ultima immagine pre costruita disponibile, se non ne è ancora stata creata una.

Se è stata [costruita un'immagine localmente](#build-your-own-docker-image) utilizzare `verdaccio` come ultimo argomento.

È possibile utilizzare `-v` per montare `conf`, `storage` e `plugins` al filesystem degli host:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

> Nota: Verdaccio viene eseguito all'interno del contenitore come un utente non-root (uid=100, gid=101), se si utilizza bind mount per non tener conto delle impostazioni predefinite, è necessario assicurarsi che la cartella di mount venga assegnata all'utente corretto. Nell'esempio precedente, è necessario eseguire `sudo chown -R 100:101 /opt/verdaccio` altrimenti si presenteranno errori di permesso durante l'esecuzione. Si consiglia di [utilizzare il volume di docker](https://docs.docker.com/storage/volumes/) al posto di bind mount.

### Estensioni

I plugin possono essere installati in una cartella separata e montati utilizzando Docker o Kubernetes, ad ogni modo assicurarsi di costruire plugin con dipendenze native adoperando la stessa immagine di base del Dockerfile di Verdaccio.

### Configurazione di Docker e della porta personalizzata

Ogni `host:port` configurato in `conf/config.yaml` sotto a `listen` viene attualmente ignorato quando si utilizza docker.

Se si desidera raggiungere l'istanza docker di verdaccio da una porta differente, diciamo `5000`, nel comando `docker run` sostituire `-p 4873:4873` con `-p 5000:4873`.

Nel caso in cui sia necessario specificare quale porta ascoltare **nel contenitore docker**, dalla versione 2.?.? ciò è possibile fornendo argomenti supplementari a `docker run`: `--env PORT=5000` Questo sostituisce la porta che il contenitore docker offre e la porta che verdaccio ascolta.

Naturalmente i numeri che vengono forniti al parametro `-p` devono combaciare, quindi, supponendo di volerli tutti uguali, questo è ciò che è possibile copiare, incollare ed adottare:

```bash
PORT=5000; docker run -it --rm --name verdaccio \
  --env PORT -p $PORT:$PORT
  verdaccio/verdaccio
```

### Utilizzare HTTPS con Docker

È possibile configurare il protocollo che verdaccio andrà ad ascoltare, analogamente a come si configura la porta. You have to overwrite the default value("http") of the `PROTOCOL` environment variable to "https", after you specified the certificates in the config.yaml.

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
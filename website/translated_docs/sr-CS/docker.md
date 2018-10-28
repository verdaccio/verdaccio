---
id: docker
title: Docker
---
<div class="docker-count">
  ![alt Docker Pulls Count](http://dockeri.co/image/verdaccio/verdaccio "Docker Pulls Count")
</div>

Kako biste povukli (pull) najnoviji pre-built [docker image](https://hub.docker.com/r/verdaccio/verdaccio/):

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](/svg/docker_verdaccio.gif)

## Tagged Versions

Počevši od verzije `v2.x` možete povući docker images preko [tag](https://hub.docker.com/r/verdaccio/verdaccio/tags/), i onda:

Za glavne verzije:

```bash
docker pull verdaccio/verdaccio:3
```

Za podverzije:

```bash
docker pull verdaccio/verdaccio:3.0
```

Za specifičnu verziju (patch):

```bash
docker pull verdaccio/verdaccio:3.0.1
```

Za sledeću glavnu verziju `beta` (master branch) verziju.

```bash
docker pull verdaccio/verdaccio:beta
```

> Ako Vas zanima lista tagova, [posetite Docker Hub website](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

## Pokretanje verdaccio korišćenjem Docker-a

Kako biste pokrenuli docker container:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

Poslednji argument definiše koji image će se koristiti. Linija iznad povlači najnoviji prebuilt image sa dockerhub-a, ako to već niste uradili.

Ako imate [build an image locally](#build-your-own-docker-image) koristite `verdaccio` kao poslednji argument.

Možete koristiti `-v` kako biste vezali (bind) mount `conf`, `storage` i `plugins` za hosts filesystem:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

> Napomena: Verdaccio radi kao non-root user (uid=100, gid=101) unutar container-a. Ako koristite bind mount da pregazite zadate postavke (override), onda norate da dodelite mount directory pravom korisniku. U navedenom primeru, morate da pokrenete `sudo chown -R 100:101 /opt/verdaccio`, u suprotnom ćete dobiti permission errors u runtime. [Use docker volume](https://docs.docker.com/storage/volumes/) je preporučeno umesto korišćenja bind mount.

### Plugins

Plugins se mogu instalirati u posebnom direktorijumu i mountovati korišćenjem Docker-a ili Kubernetes. Ipak, postarajte se da build plugins sa native dependencies korišćenjem iste base image kao Verdaccio Dockerfile-a.

### Docker i custom port konfiguracija

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
---
id: docker
title: Docker
---

<iframe width="560" height="515" src="https://www.youtube.com/embed/zRI0skF1f8I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

To pull the latest pre-built [docker image](https://hub.docker.com/r/verdaccio/verdaccio/):

```bash
docker pull verdaccio/verdaccio
```

![Docker pull](/img/docker_verdaccio.gif)

## Tagged Versions {#tagged-versions}

![alt Docker Pulls Count](https://dockeri.co/image/verdaccio/verdaccio 'Docker Pulls Count')

Since version `v2.x` you can pull docker images by [tag](https://hub.docker.com/r/verdaccio/verdaccio/tags/), as follows:

For a major version:

```bash
docker pull verdaccio/verdaccio:4
```

For a minor version:

```bash
docker pull verdaccio/verdaccio:4.0
```

For a specific (patch) version:

```bash
docker pull verdaccio/verdaccio:4.0.0
```

> If you are interested on a list of tags, [please visit the Docker Hub website](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

## Running Verdaccio using Docker {#running-verdaccio-using-docker}

To run the docker container:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

The last argument defines which image to use.
The above line will pull the latest prebuilt image from dockerhub, if you haven't done that already.

If you have [build an image locally](#build-your-own-docker-image) use `verdaccio` as the last argument.

You can use `-v` to bind mount `conf`, `storage` and `plugins` to the hosts filesystem (example below).

Note that if you do mount conf like this, that [you first need to supply a copy of config.yaml in that directory](https://github.com/verdaccio/verdaccio/tree/master/docker-examples/v5/plugins/docker-build-install-plugin). The Docker container will not start properly if this file is missing.

You can copy this file initially from https://github.com/verdaccio/verdaccio/blob/5.x/conf/docker.yaml.

However, note the security warnings in that file; you will definitely want to lock it down in production.

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio \
  -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

> if you are running in a server, you might want to add -d to run it in the background

> Note: Verdaccio runs as a non-root user (uid=10001) inside the container, if you use bind mount to override default,
> you need to make sure the mount directory is assigned to the right user. In above example, you need to run `sudo chown -R 10001:65533 /path/for/verdaccio` otherwise
> you will get permission errors at runtime.
> [Use docker volume](https://docs.docker.com/storage/volumes/) is recommended over using bind mount.

### Environment variables

Verdaccio provides a new set of environment variables to modify either permissions, port or http protocol, see them at [the environment variables page](env.md#docker).

### SELinux {#selinux}

If SELinux is enforced in your system, the directories to be bind-mounted in the container need to be relabeled. Otherwise verdaccio will be forbidden from reading those files.

```
 fatal--- cannot open config file /verdaccio/conf/config.yaml: Error: CONFIG: it does not look like a valid config file
```

If verdaccio can't read files on a bind-mounted directory and you are unsure, please check `/var/log/audit/audit.log` to confirm that it's a SELinux issue. In this example, the error above produced the following AVC denial.

```
type=AVC msg=audit(1606833420.789:9331): avc:  denied  { read } for  pid=1251782 comm="node" name="config.yaml" dev="dm-2" ino=8178250 scontext=system_u:system_r:container_t:s0:c32,c258 tcontext=unconfined_u:object_r:user_home_t:s0 tclass=file permissive=0
```

`chcon` can change the labels of shared files and directories. To make a directory accessible to containers, change the directory type to `container_file_t`.

```sh
$ chcon -Rt container_file_t ./conf
```

If you want to make the directory accessible only to a specific container, use `chcat` to specify a matching SELinux category.

An alternative solution is to use [z and Z flags](https://docs.docker.com/storage/bind-mounts/#configure-the-selinux-label). To add the `z` flag to the mountpoint `./conf:/verdaccio/conf` simply change it to `./conf:/verdaccio/conf:z`. The `z` flag relabels the directory and makes it accessible by every container while the `Z` flags relables the directory and makes it accessible only to that specific container. However using these flags is dangerous. A small configuration mistake, like mounting `/home/user` or `/var` can mess up the labels on those directories and make the system unbootable.

## Plugins {#plugins}

Plugins can be installed in a separate directory and mounted using Docker or Kubernetes, however make sure you build plugins with native dependencies using the same base image as the Verdaccio Dockerfile.

### Creating your own `Dockerfile` using `verdaccio/verdaccio:tag` as base

If the plugin already exist in some registry, it could be installed globally with `npm` command.

```docker
FROM verdaccio/verdaccio:6
ADD docker.yaml /verdaccio/conf/config.yaml
USER root
RUN npm install --global verdaccio-static-token \
  && npm install --global verdaccio-auth-memory
USER $VERDACCIO_USER_UID
```

For more detailed plugin example, check the with `docker-examples` [folder](https://github.com/verdaccio/verdaccio/tree/master/docker-examples/v5/plugins/docker-build-install-plugin).

### Adding plugins with local plugins a `Dockerfile`

If you don't have the packages available some registry and you want to try out a local plugin, you can use the folder `/verdaccio/plugins` for it, _verdaccio_ will look at this folder for plugins on startup.

1. Create a base image with multi stage support.
2. `ADD` the local plugin into the image
3. Install dependencies, required if your plugin has dependencies, you might need to build in case you need a transpilation step (tsc, babel).
4. Copying the final folder into the final image and applying permissions so verdaccio can find the folders (verdaccio uses custom user `$VERDACCIO_USER_UID`, read more [here](env.md#docker)).

```
FROM node:lts-alpine as builder
RUN mkdir -p /verdaccio/plugins
ADD plugins/verdaccio-docker-memory /verdaccio/plugins/verdaccio-docker-memory
RUN cd /verdaccio/plugins/verdaccio-docker-memory \
  && npm install --production
FROM verdaccio/verdaccio:6
ADD docker.yaml /verdaccio/conf/config.yaml
COPY --chown=$VERDACCIO_USER_UID:root --from=builder \
  /verdaccio/plugins/verdaccio-docker-memory \
  /verdaccio/plugins/verdaccio-docker-memory
```

For more detailed plugin example, check the with `docker-examples` [folder](https://github.com/verdaccio/verdaccio/tree/master/docker-examples/v5/plugins/docker-local-plugin).

### Adding plugins without creating a new image

1. Using `docker-compose.yaml` [example below](docker.md#using-docker-compose).
2. Mapping volumes in docker, verdaccio will look up for plugins at `/verdaccio/plugins` by default.

```
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio \
  -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio
```

### Docker and custom port configuration {#docker-and-custom-port-configuration}

Any `host:port` configured in `conf/config.yaml` under `listen` **is currently ignored when using docker**.

If you want to reach Verdaccio docker instance under different port, lets say `5000`
in your `docker run` command add the environment variable `VERDACCIO_PORT=5000` and then expose the port `-p 5000:5000`.

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio \
  -e "VERDACCIO_PORT=8080" -p 8080:8080 \
  verdaccio/verdaccio
```

Of course the numbers you give to the `-p` parameter need to match.

### Using HTTPS with Docker {#using-https-with-docker}

You can configure the protocol verdaccio is going to listen on, similarly to the port configuration.
You have to overwrite the default value("http") of the `PROTOCOL` environment variable to "https", after you specified the certificates in the config.yaml.

```bash
docker run -it --rm --name verdaccio \
  --env "VERDACCIO_PROTOCOL=https" -p 4873:4873
  verdaccio/verdaccio
```

### Using docker-compose {#using-docker-compose}

1. Get the latest version of [docker-compose](https://github.com/docker/compose).
2. Build and run the container:

```bash
$ docker-compose up --build
```

You can set the port to use (for both container and host) by prefixing the above command with `VERDACCIO_PORT=5000 `.

```yaml
version: '3.1'

services:
  verdaccio:
    image: verdaccio/verdaccio
    container_name: 'verdaccio'
    networks:
      - node-network
    environment:
      - VERDACCIO_PORT=4873
    ports:
      - '4873:4873'
    volumes:
      - './storage:/verdaccio/storage'
      - './config:/verdaccio/conf'
      - './plugins:/verdaccio/plugins'
networks:
  node-network:
    driver: bridge
```

Docker will generate a named volume in which to store persistent application data. You can use `docker inspect` or `docker volume inspect` to reveal the physical location of the volume and edit the configuration, such as:

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

## Build your own Docker image {#build-your-own-docker-image}

Go to the [`5.x` branch](https://github.com/verdaccio/verdaccio/tree/5.x) and run:

```bash
docker build -t verdaccio .
```

There is also an yarn script for building the docker image, so you can also do:

```bash
yarn run build:docker
```

Note: The first build takes some minutes to build because it needs to run `yarn install`,
and it will take that long again whenever you change any file that is not listed in `.dockerignore`.

Please note that for any of the above docker commands you need to have docker installed on your machine and the docker executable should be available on your `$PATH`.

## Docker Examples {#docker-examples}

There is a separate repository that hosts multiple configurations to compose Docker images with `verdaccio`, for instance, as reverse proxy:

[https://github.com/verdaccio/docker-examples](https://github.com/verdaccio/verdaccio/tree/master/docker-examples)

## Docker Custom Builds {#docker-custom-builds}

> If you have made an image based on Verdaccio, feel free to add it to this list.

- [docker-verdaccio-multiarch](https://github.com/hertzg/docker-verdaccio-multiarch) Multiarch image mirrors
- [docker-verdaccio-gitlab](https://github.com/snics/docker-verdaccio-gitlab)
- [docker-verdaccio](https://github.com/deployable/docker-verdaccio)
- [docker-verdaccio-s3](https://github.com/asynchrony/docker-verdaccio-s3) Private NPM container that can backup to s3
- [docker-verdaccio-ldap](https://github.com/snadn/docker-verdaccio-ldap)
- [verdaccio-ldap](https://github.com/nathantreid/verdaccio-ldap)
- [verdaccio-compose-local-bridge](https://github.com/shingtoli/verdaccio-compose-local-bridge)
- [docker-verdaccio](https://github.com/Global-Solutions/docker-verdaccio)
- [verdaccio-docker](https://github.com/idahobean/verdaccio-docker)
- [verdaccio-server](https://github.com/andru255/verdaccio-server)
- [coldrye-debian-verdaccio](https://github.com/coldrye-docker/coldrye-debian-verdaccio) docker image providing verdaccio from coldrye-debian-nodejs.
- [verdaccio-github-oauth-ui](https://github.com/n4bb12/verdaccio-github-oauth-ui/blob/master/Dockerfile)

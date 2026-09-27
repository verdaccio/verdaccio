# Verdaccio 6 with local storage volume

This example shows a minimal `verdaccio/verdaccio:6` setup that persists the
default file storage and configuration through bind-mounted volumes.

Contains:

- `conf/` — `config.yaml` and a default `htpasswd` user.
- `storage/` — a pre-published sample package (`npm_test_pkg1`, two versions).

```bash
docker compose up
```

The registry is available on <http://localhost:4873/>. The `./storage` and
`./conf` folders are mounted into the container, so published packages and
config survive restarts.

> **On Linux:** the container runs as uid `10001`, so folders owned by your host
> user are not writable by it and the registry fails on startup with
> `EACCES: permission denied, mkdir '/verdaccio/storage/...'`. Run
> `sudo chown -R 10001:65533 ./storage ./conf` before `docker compose up`, or use
> [named volumes](https://docs.docker.com/storage/volumes/) instead of bind mounts.
> See [the Docker docs](https://verdaccio.org/docs/docker#running-verdaccio-using-docker).

## Login

If you want to login into the Verdaccio instance created via these Docker Examples, please try:

Username: dummyuser
Password: dummyuser

## Running in Dokku

If you use Dokku, an open-source alternative for Heroku, you can run this example using the following steps:

1. Create a new application `dokku apps:create verdaccio`
2. Pull the verdaccio image `docker pull verdaccio/verdaccio:6`
3. Tag the docker image for the app: `docker tag verdaccio/verdaccio:6 dokku/verdaccio:v1`
4. Create the directories for persistent storage `mkdir -p /var/lib/dokku/data/storage/verdaccio/storage`, `mkdir -p /var/lib/dokku/data/storage/verdaccio/storage`
5. Mount the volumes: `dokku storage:mount verdaccio /var/lib/dokku/data/storage/verdaccio/storage:/verdaccio/storage` and `dokku storage:mount verdaccio /var/lib/dokku/data/storage/verdaccio/conf:/verdaccio/conf`
6. Deploy the docker image `dokku tags:deploy verdaccio v1`
7. Enjoy the application

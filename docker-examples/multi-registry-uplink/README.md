# Verdaccio Uplinks

## Context

This is an experiment for the **uplinks** feature.

https://verdaccio.org/docs/en/uplinks

Furthermore, this experiment also proves the oldest Verdaccio (2.x) still is able to communicate with the latest development version (4.x).

## Objective

We have 3 registries:

- Server 1 (verdaccio@4.x)
- Server 2 (verdaccio@2.x)
- Server 3 (verdaccio@3.x)

The servers have no authentication in order to simplify the configuration. The server 3 and server 1 are chained with server 2 which is the unique that contains the dependency `@jota/pk1-juan`.

The request will go through `server 1 --> server 3 --> server 2` and should retrieve the tarball to the local project executing the following:

```
 npm install @jota/pk1-juan --registry http://localhost:4873
```

The result is a successful installation of the package.

## Usage

To force recreate the images.

```bash
docker-compose up --build --force-recreate  -d
```

To stop all containers

```bash
docker-compose stop
```

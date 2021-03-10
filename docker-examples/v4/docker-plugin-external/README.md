# Verdaccio loading external plugins

This example aims to show how to set up external plugins without the need to create a custom Docker Image.

This example uses the folder `plugins/` as entry point to locate external plugins.

```
plugins: /verdaccio/plugins
```

at the same time we define the plugin we want to load `verdaccio-memory`.

```
store:
  memory:
    limit: 1000
```

### Prerequisites

- verdaccio `>3.3.0`

### Example

To run the containers, run the following command in this folder, it should start the containers in detach mode.

```bash
$> docker-compose up -d

Recreating verdaccio-3-docker-plugin-external ... done
Attaching to verdaccio-3-docker-plugin-external
verdaccio-3-docker-plugin-external |  warn --- config file  - /verdaccio/conf/config.yaml
verdaccio-3-docker-plugin-external |  warn --- Plugin successfully loaded: memory
verdaccio-3-docker-plugin-external |  warn --- Plugin successfully loaded: htpasswd
verdaccio-3-docker-plugin-external |  warn --- Plugin successfully loaded: audit
verdaccio-3-docker-plugin-external |  warn --- http address - http://0.0.0.0:4873/ - verdaccio/3.2.0
```

To stop all containers

```bash
docker-compose stop
```

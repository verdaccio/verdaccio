# Verdaccio and OpenLDAP Server

Running `verdaccio` with the plugin [https://github.com/Alexandre-io/verdaccio-ldap](https://github.com/Alexandre-io/verdaccio-ldap).

## Introduction

This example is based on:

- **OpenLDAP** (ldap://localhost:389)
- **phpLDAP Admin** (http://localhost:8080/)
- **Verdaccio** (http://localhost:4873/)

It provides a published package named `@scope/example` that only authenticated users can access.

```
packages:
  '@scope/*':
    access: marpontes zach leonardo
    publish: $authenticated
    proxy: npmjs
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

## Usage

To run the containers, run the following command in this folder, it should starts the containers in detach mode.

```bash
➜ docker-compose up --force-recreate --build

Building verdaccio
Step 1/4 : FROM verdaccio/verdaccio:4.2.2
 ---> 0d58a1eae16d
Step 2/4 : USER root
 ---> Using cache
 ---> fb3300bf15cc
Step 3/4 : RUN npm i && npm i verdaccio-ldap
 ---> Using cache
 ---> 97701fa53b43
Step 4/4 : USER verdaccio
 ---> Using cache
 ---> fd5ddaa03d8f
Successfully built fd5ddaa03d8f
Successfully tagged ldap-verdaccio_verdaccio:latest
Recreating verdaccio-ldap-1 ... done
Recreating openldap         ... done
Recreating ldap-verdaccio_openldap-seed_1 ... done
Recreating openldap-admin                 ... done
Attaching to verdaccio-ldap-1, openldap, ldap-verdaccio_openldap-seed_1, openldap-admin
verdaccio-ldap-1  |  warn --- config file  - /verdaccio/conf/config.yaml
verdaccio-ldap-1  |  warn --- Plugin successfully loaded: verdaccio-ldap
verdaccio-ldap-1  |  warn --- http address - http://0.0.0.0:4873/ - verdaccio/4.2.2
openldap          | *** CONTAINER_LOG_LEVEL = 3 (info)
openldap          | *** Search service in CONTAINER_SERVICE_DIR = /container/service :
openldap          | *** link /container/service/:ssl-tools/startup.sh to /container/run/startup/:ssl-tools
openldap          | *** link /container/service/slapd/startup.sh to /container/run/startup/slapd
openldap          | *** link /container/service/slapd/process.sh to /container/run/process/slapd/run
openldap          | *** Set environment for startup files
openldap          | *** Environment files will be proccessed in this order :
openldap          | Caution: previously defined variables will not be overriden.
openldap          | /container/environment/99-default/default.yaml
openldap          | /container/environment/99-default/default.startup.yaml
```

To stop all containers

```bash
docker-compose stop
```

## Credentials

You can find the complete list of users in the `people.ldif` file. However here a brief list of credentials.

```
marpontes: pass
zach: pass
leonardo: pass
```

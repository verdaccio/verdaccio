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
Step 1/2 : FROM verdaccio/verdaccio
 ---> 5375f8604262
Step 2/2 : RUN npm i && npm install verdaccio-ldap
 ---> Using cache
 ---> d89640f08005
Successfully built d89640f08005
Successfully tagged ldap-verdaccio_verdaccio:latest
Recreating verdaccio-ldap-1 ... done
Recreating openldap         ... done
Recreating ldap-verdaccio_openldap-seed_1 ... done
Recreating openldap-admin                 ... done
Attaching to verdaccio-ldap-1, openldap, ldap-verdaccio_openldap-seed_1, openldap-admin
verdaccio-ldap-1  |  warn --- config file  - /verdaccio/conf/config.yaml
openldap          | *** CONTAINER_LOG_LEVEL = 3 (info)
verdaccio-ldap-1  |  warn --- Plugin successfully loaded: ldap
openldap          | *** Search service in CONTAINER_SERVICE_DIR = /container/service :
openldap          | *** link /container/service/:ssl-tools/startup.sh to /container/run/startup/:ssl-tools
openldap          | *** link /container/service/slapd/startup.sh to /container/run/startup/slapd
openldap          | *** link /container/service/slapd/process.sh to /container/run/process/slapd/run
openldap          | *** Set environment for startup files
openldap          | *** Environment files will be proccessed in this order :
openldap          | Caution: previously defined variables will not be overriden.
openldap          | /container/environment/99-default/default.startup.yaml
openldap          | /container/environment/99-default/default.yaml
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

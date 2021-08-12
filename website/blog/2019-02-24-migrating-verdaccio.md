---
author: Juan Picado
authorURL: https://twitter.com/jotadeveloper
authorFBID: 1122901551
title: Verdaccio Migration Guides
---

Verdaccio keeps backward compatibility with all versions since the first release `(v2.0.0)`, but there are some considerations you need to know before start a migration.

<!--truncate-->

## Migrating from `sinopia@1.4.0` to Verdaccio 2.x/3.x {#migrating-from-sinopia140-to-verdaccio-2x3x}

> If you are using still using Sinopia, **we encourage you to migrate as soon as possible** due to Sinopia [has been abandoned](https://github.com/rlidwka/sinopia/issues/376).

### Installation with `npm` {#installation-with-npm}

Using as example UNIX environments, the local storage is located within `~/.local/share/` folder.

We support only `sinopia@1.4.0` as minimum version, these are the steps:

1. The folder `~/.local/share/sinopia` must be renamed to `~/.local/share/verdaccio`
2. The folder `~/.config/sinopia` must be renamed to `~/.config/verdaccio`

There is an aditional step, not required, but recommended:

3. The file `~/.config/sinopia/storage/.sinopia-db.json` must be renamed to `~/.local/share/verdaccio/storage/.verdaccio-db.json`

To find the Windows location, [check the following link](https://verdaccio.org/docs/en/cli#default-storage-location).

### Using Docker {#using-docker}

This might depends of your own configuration, but, if you are using external volumes we recommend following the step 3 in the previous section.

## Migrating from `verdaccio@2.x` to `verdaccio@3.x` {#migrating-from-verdaccio2x-to-verdaccio3x}

Those versions are fully compatible, so there is not a specific step for migrating between both of them.
But we recommend the following considerations:

- Try to update first to the latest `v2.x` as possible. There were a lot of fixes and you might hit a corner case migrating from a very old version.
- We recommend using the latest `v3.x` available version.

## Migrating from `verdaccio@3.x` to `verdaccio@4.x` {#migrating-from-verdaccio3x-to-verdaccio4x}

[Here you can read](https://github.com/verdaccio/verdaccio/issues/836#issuecomment-408477496) more about summary o of changes by **Diego Louzán**.

### Installation with `npm` {#installation-with-npm-1}

There are no differences between both major releases if you install with `npm`. The migration should be clean and painless.

> If you decided to use the `JWT` token signature instead of the `legacy` one, all the client side tokens will be invalidated.

### Installation with Docker {#installation-with-docker}

#### Environment Variables {#environment-variables}

The Docker image for version `3` allows the following environment variables:

| Property | default          | Description                  |
| -------- | ---------------- | ---------------------------- |
| APPDIR   | `/usr/local/app` | the docker working directory |
| PORT     | `4873`           | the verdaccio port           |
| PROTOCOL | `http`           | the default http protocol    |

Version 4 brings more control over the environment variables and provides a namespace to avoid collisions and new additions.

| Property            | default                | Description                                        |
| ------------------- | ---------------------- | -------------------------------------------------- |
| VERDACCIO_APPDIR    | `/opt/verdaccio-build` | the docker working directory                       |
| VERDACCIO_USER_NAME | `verdaccio`            | the system user                                    |
| VERDACCIO_USER_UID  | `10001`                | the user id being used to apply folder permissions |
| VERDACCIO_PORT      | `4873`                 | the verdaccio port                                 |
| VERDACCIO_PROTOCOL  | `http`                 | the default http protocol                          |

## Docker and Plugins {#docker-and-plugins}

If you are using the Docker image as base with the purpose of installing plugins, there are some differences you need to keep on mind.

In _Verdaccio 3_ was really easy to install plugins, for instance:

```docker
FROM verdaccio/verdaccio:3

RUN npm i && npm install verdaccio-ldap
```

Rather in Verdaccio 4, the image has changed considerably and now you need to deal with the right folder permissions.

You can find more info about this in [this ticket](https://github.com/verdaccio/verdaccio/issues/1324).

To install plugins, you need to use the right users for it, which is `root`.

> ⚠️ This approach works, but perhaps is no the best one, feel free to suggest modifications.

```docker
FROM verdaccio/verdaccio:4

## switch to root user
USER root

ENV NODE_ENV=production

## perhaps all of this is not fully required
RUN apk --no-cache add openssl ca-certificates wget && \
    apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget -q https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.25-r0/glibc-2.25-r0.apk && \
    apk add glibc-2.25-r0.apk


RUN npm i && npm install verdaccio-[YOUR-PLUGIN-HERE]

# switch back to the verdaccio user
USER verdaccio
```

Once you have installed the plugin, it needs to restore the user, either the default one `verdaccio` or the one defined under the environment variable `VERDACCIO_USER_NAME`.

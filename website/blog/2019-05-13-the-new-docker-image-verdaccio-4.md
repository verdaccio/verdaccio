---
author: Juan Picado
authorURL: https://twitter.com/jotadeveloper
authorFBID: 1122901551
title: The new Docker image for Verdaccio 4
---

Docker has been a key part of success for Verdaccio. At the time of this writing, we have more than 4 million image pulls and this number is growing rapidly. The image provides an easy way to use Verdaccio in combination with tools like Kubernetes, Docker Compose or any other container orchestration system, simplifying deployment and integration with existing infrastructure.

This article will describe what has changed, all the improvements and benefits you will enjoy from migrating to the latest version.

## What’s new? {#whats-new}

### Keep it small {#keep-it-small}

The new image is three times smaller than the previous, shrinking down from 500MB to 150MB. We achieved this level of optimization by using [multi-stage build](https://medium.com/capital-one-tech/multi-stage-builds-and-dockerfile-b5866d9e2f84) which allows excluding dependencies and assets not required for the runtime.

<!--truncate-->

### Environment Variables {#environment-variables}

To avoid mistakes we have renamed all environment variables to be prefixed with `VERDACCIO_`. This will avoid future collisions and give a better understanding of the origin of the variable. Here is the full list of the new variables available in the new image.

| Property              | Default value          | Description                  |
| --------------------- | ---------------------- | ---------------------------- |
| `VERDACCIO_APPDIR`    | `/opt/verdaccio-build` | the docker working directory |
| `VERDACCIO_USER_NAME` | `verdaccio`            | the user to run the server   |
| `VERDACCIO_USER_UID`  | `10001`                | the user ID being            |
| `VERDACCIO_PORT`      | `4873`                 | the verdaccio port           |
| `VERDACCIO_PROTOCOL`  | `http`                 | the default web scheme       |

### Support Arbitrary User IDs {#support-arbitrary-user-ids}

The previous image runs the container with the verdaccio user and group by default, being the UID created randomly within the image. Some users were experiencing issues since some environments require the usage of custom user IDs for security reasons. To support this, we have introduced the environment variable `VERDACCIO_USER_ID`.

Furthermore, other optimizations can be possible, as for instance, define a different username using `VERDACCIO_USER_NAME` and such user won’t have permissions to log in by default.

### Security {#security}

We have followed security recommendations to remove write permissions to those locations that do not need to be modified for the default user.

For instance, the code written to `/opt/verdaccio`. The verdaccio run user cannot modify the compiled resources, nor config. Only the `/verdaccio/storage` volume. The image only assigns executable permissions to the binary executable required to run verdaccio.

If you are not using volumes, the `VERDACCIO_USER_NAME` will only have permissions to write in the storage folder and the source code. The configuration and plugins will be read only.

To provide your own configuration file, the recommended way is using Docker volumes like so:

```bash
V_PATH=/path/for/verdaccio; docker run -it --rm --name verdaccio \
  -p 4873:4873 \
  -v $V_PATH/conf:/verdaccio/conf \
  -v $V_PATH/storage:/verdaccio/storage \
  -v $V_PATH/plugins:/verdaccio/plugins \
  verdaccio/verdaccio:4
```

We use the user ID **10001** for the run user and assign the root group to the locations that need to be written to by the run user. If running in a normal environment, the specific ID is used and permissions are correct. If running on a randomized user ID environment like openshift, the non-existent user gets assigned the root group and is allowed write access to relevant locations.

The entrypoint will add the user to `/etc/passwd` in case the user is running as a random uid (openshift). That way, the typical tools like whoami and so can still work.

## Conclusions {#conclusions}

This new image has been tested in production for months and is quite stable, thus there is no need to worry about giving it a try. We have improved in several areas but there is still a lot to do and for that we need you. If you are DevOps do not hesitate to give us your feedback or contribute directly in discussions and future PRs to take the Verdaccio Docker image to the next level. We count on you.

## Contributions {#contributions}

We want to thank **[Diego Louzán](https://github.com/dlouzan)**, **[Dimitri Kopriwa](https://github.com/kopax)**, **[Sergio Herrera](https://twitter.com/sergiohgz)**, [Ben Tucker](https://github.com/btucker), [Michiel De Mey](https://github.com/MichielDeMey) and me [Juan Picado](https://github.com/juanpicado) for this amazing job improving the Docker image.

Without forgetting the Helm Chart contributors, [James Sidhu](https://github.com/sidhuko), [Carlos Tadeu Panato Junior](https://github.com/cpanato), [Bort Verwilst](https://github.com/verwilst), [ercanucan](https://github.com/ercanucan) and [Taehyun Kim](https://github.com/kimxogus) that have keep the Kubernetes integration alive during the last year.

---

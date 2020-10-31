# Verdaccio and Gitlab Authentication

The [verdaccio-gitlab](https://github.com/bufferoverflow/verdaccio-gitlab) plugin can be used to authenticate users against gitlab.

## Running with the provided verdaccio-gitlab docker image

If the only extra plugin you require is verdaccio-gitlab, [you can use the image provided by the plugin project](https://hub.docker.com/r/bufferoverflow/verdaccio-gitlab/). It takes care of the whole plugin setup and is based on the [official verdaccio docker image](https://hub.docker.com/r/verdaccio/verdaccio/).

More information about the configuration required can be found in the [verdaccio-gitlab readme](https://github.com/bufferoverflow/verdaccio-gitlab/blob/master/README.md).

https://hub.docker.com/r/bufferoverflow/verdaccio-gitlab/

## Building your own docker image

There's a [sample docker-compose file in the verdaccio-gitlab repo](https://github.com/bufferoverflow/verdaccio-gitlab/blob/master/docker-compose.yml) that shows how to build & start both gitlab and verdaccio with support for the gitlab plugin, but this is generic enough to be used with any other extra plugins.

You can also extend the [official verdaccio-gitlab image Dockerfile](https://github.com/bufferoverflow/verdaccio-gitlab/blob/master/Dockerfile).

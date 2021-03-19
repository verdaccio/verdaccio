# Environment variables

A full list of available environment variables that allow override
internal features.

#### VERDACCIO_HANDLE_KILL_SIGNALS

Enables gracefully shutdown, more info [here](https://github.com/verdaccio/verdaccio/pull/2121).

This will be enable by default on Verdaccio 5.

#### VERDACCIO_PUBLIC_URL

Define a specific public url for your server, it overrules the `Host` and `X-Forwarded-Proto` header if a reverse proxy is
being used.

This is handy in such situations where a dynamic url is required.

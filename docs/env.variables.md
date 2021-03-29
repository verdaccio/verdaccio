# Environment variables

A full list of available environment variables that allow override
internal features.

#### VERDACCIO_HANDLE_KILL_SIGNALS

Enables gracefully shutdown, more info [here](https://github.com/verdaccio/verdaccio/pull/2121).

This will be enable by default on Verdaccio 5.

#### VERDACCIO_PUBLIC_URL

Define a specific public url for your server, it overrules the `Host` and `X-Forwarded-Proto` header if a reverse proxy is being used, it takes in account the `url_prefix` if is defined.

This is handy in such situations where a dynamic url is required.

eg: 

```
VERDACCIO_PUBLIC_URL='https://somedomain.org';
url_prefix: '/my_prefix'

// url -> https://somedomain.org/my_prefix/

VERDACCIO_PUBLIC_URL='https://somedomain.org';
url_prefix: '/'

// url -> https://somedomain.org/

VERDACCIO_PUBLIC_URL='https://somedomain.org/first_prefix';
url_prefix: '/second_prefix'

// url -> https://somedomain.org/second_prefix/'
```

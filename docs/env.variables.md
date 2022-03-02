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

#### VERDACCIO_FORWARDED_PROTO

The default header to identify the protocol is `X-Forwarded-Proto`, but there are some environments which [uses something different](https://github.com/verdaccio/verdaccio/issues/990), to change it use the variable `VERDACCIO_FORWARDED_PROTO`

```
$ VERDACCIO_FORWARDED_PROTO=CloudFront-Forwarded-Proto verdaccio --listen 5000
```

#### VERDACCIO_STORAGE_PATH

By default, the storage is taken from config file, but using this variable allows to set it from environment variable.

#### EXPERIMENTAL_VERDACCIO_LOGGER_COLORS

Overrides `logs.colors` from the `config.yaml`.

Note that any value that other than `false` will result in `true`.

When both are not provided - the colors are on by default for TTY processes, and off for processes that are not.

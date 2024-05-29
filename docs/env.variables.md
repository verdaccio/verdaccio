# Environment variables

A full list of available environment variables that allow override
internal features.

#### VERDACCIO_LEGACY_ALGORITHM

Allows to define the specific algorithm for the token signature which by default is `aes-256-ctr`. The algorithm must be supported by `crypto.createCipheriv` and `crypto.createDecipheriv`.
Read more here: https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options

#### VERDACCIO_LEGACY_ENCRYPTION_KEY

By default, the token stores in the database, but using this variable allows to get it from memory, the length must be 32 characters otherwise will throw an error.
Read more here: https://nodejs.org/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options

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

#### VERDACCIO_STORAGE_NAME

The database name for `@verdaccio/local-storage` is by default `.verdaccio-db.json`, but this can be update by using this variable.

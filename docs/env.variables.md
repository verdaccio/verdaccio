# Environment variables

A full list of available environment variables that allow override
internal features.

#### VERDACCIO_LEGACY_ALGORITHM

Allows to define the specific algorithm for the token
signature which by default is `aes-256-ctr`

#### VERDACCIO_LEGACY_ENCRYPTION_KEY

By default, the token stores in the database, but using this variable allows to get it from memory

#### VERDACCIO_PUBLIC_URL

Define a specific public url for your server, it overrules the `Host` and `X-Forwarded-Proto` header if a reverse proxy is
being used.

This is handy in such situations where a dynamic url is required.

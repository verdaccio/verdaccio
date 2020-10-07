---
id: uplinks
title: 'Uplinks'
---

An _uplink_ is a link with an external registry that provides access to external packages.

![Uplinks](https://user-images.githubusercontent.com/558752/52976233-fb0e3980-33c8-11e9-8eea-5415e6018144.png)

### Usage

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    maxage: 10m
```

### Configuration

You can define mutiple uplinks and each of them must have an unique name (key). They can have the following properties:

| Property        | Type    | Required | Example                                 | Version | Description                                                                                                                | Default   |
| --------------- | ------- | -------- | --------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- | --------- |
| `url`           | string  | Yes      | https://registry.npmjs.org/             | all     | The registry url                                                                                                           | npmjs     |
| `maxage`        | string  | No       | 10m                                     | all     | the time threshold to the cache is valid                                                                                   | 2m        |  |
| `auth`          | list    | No       | [check below](uplinks.md#auth-property) | all     | assigns the header 'Authorization' [more info](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules) | disabled  |
| `headers`       | list    | No       | authorization: "Bearer SecretJWToken==" | all     | list of custom headers for the uplink                                                                                      | disabled  |
| `cache_tarball` | boolean | No       | [true,false]                            | 5       | cache all remote tarballs in storage                                                                                       | true      |
| `retry`         | object  | No       | Check the _retry_ section               | 5       | customise retry options                                                                                                    | see below |
| `fetch`         | object  | No       | Check the _fetch_ section               | 5       | customise `node_fetch` options                                                                                             | see below |
| ``              |

### Using https remote URI

The following properties are only valid if the remote `url` contains `https` as protocol:

| Property     | Type   | Required | Example              | Support | Description          | Default                                      |
| ------------ | ------ | -------- | -------------------- | ------- | -------------------- | -------------------------------------------- |
| `ca`         | string | No       | `~./ssl/client.crt'` | all     | SSL path certificate | No default                                   |
| `strict_ssl` | string | No       | true                 | false   | all                  | If true, requires SSL certificates be valid. | true |

### Not longer valid

If you are migrating from Verdaccio 4, please be aware the following properties are not longer valid and ignored.

| Property                     | Replaced by          | Detail                                                 |
| ---------------------------- | -------------------- | ------------------------------------------------------ |
| `cache`                      | `cache_tarball`      | It does not change the current behaviour               |
| `agent_options`              | Not longer supported | see `fetch` section                                    |
| `max_fails`                  | Replaced by `retry`  | Use `retry.retries` instead.                           |
| `fail_timeout` and `timeout` | Replaced by `retry`  | Use `retry.maxTimeout` and `retry.minTimeout` instead. |

### Fetch

Proxy uses `node-fetch` which allows override properties as: `compress`

- https://github.com/node-fetch/node-fetch#options

### Retry

The proxy will try to _retry_ 2 times by default before define the _uplink is down_.

```
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    maxage: 10m
    tarball: false
    retry:
      retries: 3
      factor: 2
      minTimeout: 1000,
      maxTimeout: Infinity
      randomize: true
```

Retry is highly customizable and is based on `node-retry`, for more info please read the following notes:

- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
- https://github.com/vercel/async-retry#api

### Auth property

The `auth` property allows you to use an auth token with an uplink. Using the default environment variable:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: true # defaults to `process.env['NPM_TOKEN']`
```

or via a specified environment variable:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: FOO_TOKEN
```

`token_env: FOO_TOKEN`internally will use `process.env['FOO_TOKEN']`

or by directly specifying a token:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token: 'token'
```

> Note: `token` has priority over `token_env`

### You Must know

- Uplinks must be registries compatible with the `npm` endpoints. Eg: _verdaccio_, `sinopia@1.4.0`, _npmjs registry_, _yarn registry_, _JFrog_, _Nexus_ and more.
- Setting `tarball_cache` to false will help to save space in your hard drive. This will avoid store `tarballs` but [it will keep metadata in folders](https://github.com/verdaccio/verdaccio/issues/391).
- Exceed with multiple uplinks might slow down the lookup of your packages due for each request a npm client does, verdaccio does 1 call for each uplink.
- The (timeout, maxage and fail_timeout) format follow the [NGINX measurement units](http://nginx.org/en/docs/syntax.html)

---
id: uplinks
title: "Uplinks"
---

An *uplink* is a link with an external registry that provides access to external packages.

![Uplinks](https://user-images.githubusercontent.com/558752/52976233-fb0e3980-33c8-11e9-8eea-5415e6018144.png)

### Użycie

```yaml
uplinks:
  npmjs:
   url: https://registry.npmjs.org/
  server2:
    url: http://mirror.local.net/
    timeout: 100ms
  server3:
    url: http://mirror2.local.net:9000/
  baduplink:
    url: http://localhost:55666/
```

### Konfiguracja

You can define mutiple uplinks and each of them must have an unique name (key). They can have the following properties:

| Właściwość    | Typ         | Wymagane | Przykład                                | Wsparcie  | Opis                                                                                                                                                                     | Domyślne   |
| ------------- | ----------- | -------- | --------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| url           | ciąg znaków | Tak      | https://registry.npmjs.org/             | wszystkie | The registry url                                                                                                                                                         | npmjs      |
| ca            | ciąg znaków | Nie      | ~./ssl/client.crt'                      | wszystkie | SSL path certificate                                                                                                                                                     | No default |
| timeout       | ciąg znaków | Nie      | 100ms                                   | wszystkie | set new timeout for the request                                                                                                                                          | 30s        |
| maxage        | ciąg znaków | Nie      | 10m                                     | wszystkie | the time threshold to the cache is valid                                                                                                                                 | 2m         |
| fail_timeout  | ciąg znaków | Nie      | 10m                                     | wszystkie | defines max time when a request becomes a failure                                                                                                                        | 5m         |
| max_fails     | numer       | Nie      | 2                                       | wszystkie | limit maximun failure request                                                                                                                                            | 2          |
| cache         | boolean     | Nie      | [prawda,fałsz]                          | >= 2.1    | cache all remote tarballs in storage                                                                                                                                     | true       |
| auth          | list        | Nie      | [see below](uplinks.md#auth-property)   | >= 2.5    | assigns the header 'Authorization' [more info](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules)                                               | disabled   |
| nagłówki      | list        | Nie      | authorization: "Bearer SecretJWToken==" | wszystkie | list of custom headers for the uplink                                                                                                                                    | disabled   |
| strict_ssl    | boolean     | Nie      | [prawda,fałsz]                          | >= 3.0    | If true, requires SSL certificates be valid.                                                                                                                             | true       |
| agent_options | object      | Nie      | maxSockets: 10                          | >= 4.0.2  | options for the HTTP or HTTPS Agent responsible for managing uplink connection persistence and reuse [more info](https://nodejs.org/api/http.html#http_class_http_agent) | No default |

#### Auth property

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
      token: "token"
```

> Note: `token` has priority over `token_env`

### You Must know

* Uplinks must be registries compatible with the `npm` endpoints. Eg: *verdaccio*, `sinopia@1.4.0`, *npmjs registry*, *yarn registry*, *JFrog*, *Nexus* and more.
* Setting `cache` to false will help to save space in your hard drive. This will avoid store `tarballs` but [it will keep metadata in folders](https://github.com/verdaccio/verdaccio/issues/391).
* Exceed with multiple uplinks might slow down the lookup of your packages due for each request a npm client does, verdaccio does 1 call for each uplink.
* The (timeout, maxage and fail_timeout) format follow the [NGINX measurement units](http://nginx.org/en/docs/syntax.html)
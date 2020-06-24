---
id: uplinks
title: "Uplinks"
---

An *uplink* is a link with an external registry that provides access to external packages.

![Uplinks](https://user-images.githubusercontent.com/558752/52976233-fb0e3980-33c8-11e9-8eea-5415e6018144.png)

### Uso

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

### Configuración

You can define mutiple uplinks and each of them must have an unique name (key). They can have the following properties:

| Propiedad     | Tipo    | Requerido | Ejemplo                               | Soporte  | Descripción                                                                                                                                                              | Por Defecto |
| ------------- | ------- | --------- | ------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| url           | string  | Yes       | https://registry.npmjs.org/           | all      | El dominio del registro                                                                                                                                                  | npmjs       |
| ca            | string  | No        | ~./ssl/client.crt'                    | all      | Ubicación del certificado SSL                                                                                                                                            | Desactivado |
| timeout       | string  | No        | 100ms                                 | all      | timeout por petición                                                                                                                                                     | 30s         |
| maxage        | string  | No        | 10m                                   | all      | the time threshold to the cache is valid                                                                                                                                 | 2m          |
| fail_timeout  | string  | No        | 10m                                   | all      | define el tiempo máximo cuando una petición falla                                                                                                                        | 5m          |
| max_fails     | number  | No        | 2                                     | all      | límite máximo de fallos                                                                                                                                                  | 2           |
| cache         | boolean | No        | [true,false]                          | >= 2.1   | cache all remote tarballs in storage                                                                                                                                     | true        |
| auth          | list    | No        | [ver abajo](uplinks.md#auth-property) | >= 2.5   | asigna el encabezado 'Autorización' [más información](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules)                                        | desactivado |
| headers       | list    | No        | ]]                                    | all      | listado de encabezados por uplink                                                                                                                                        | desactivado |
| strict_ssl    | boolean | No        | [true,false]                          | >= 3.0   | Es verdadero, requiere que el certificado SSL sea válido.                                                                                                                | true        |
| agent_options | object  | No        | maxSockets: 10                        | >= 4.0.2 | options for the HTTP or HTTPS Agent responsible for managing uplink connection persistence and reuse [more info](https://nodejs.org/api/http.html#http_class_http_agent) | Desactivado |

#### Propiedad auth

La propiedad `auth` te permite usar un token auth con un uplink. Usando la variable de entorno por defecto:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: true # defaults to `process.env['NPM_TOKEN']`
```

o a través de una variable de entorno específica:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: FOO_TOKEN
```

`token_env: FOO_TOKEN` utilizará internamente `process.env['FOO_TOKEN']`

o al especificar directamente un token:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token: "token"
```

> Nota: `token` tiene prioridad sobre `token_env`

### Debes saber

* Uplinks must be registries compatible with the `npm` endpoints. Eg: *verdaccio*, `sinopia@1.4.0`, *npmjs registry*, *yarn registry*, *JFrog*, *Nexus* and more.
* Setting `cache` to false will help to save space in your hard drive. This will avoid store `tarballs` but [it will keep metadata in folders](https://github.com/verdaccio/verdaccio/issues/391).
* Exceed with multiple uplinks might slow down the lookup of your packages due for each request a npm client does, verdaccio does 1 call for each uplink.
* The (timeout, maxage and fail_timeout) format follow the [NGINX measurement units](http://nginx.org/en/docs/syntax.html)